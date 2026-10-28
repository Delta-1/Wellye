-- Wellye identity is deliberately separate from shared auth.users.
-- Run only in the selected WORKSPACE project. Other applications are untouched.
create schema if not exists wellye;
revoke all on schema wellye from public, anon, authenticated;
grant usage on schema wellye to service_role;
create table if not exists wellye.accounts (
 id uuid primary key default gen_random_uuid(),
 email text not null unique check(length(email)<=254),
 name text not null check(length(name) between 2 and 60),
 password_hash text not null,
 recovery_hash text not null,
 created_at timestamptz not null default now()
);
create table if not exists wellye.sessions (
 token_hash text primary key check(length(token_hash)=64),
 user_id uuid not null references wellye.accounts(id) on delete cascade,
 expires_at timestamptz not null default now()+interval '30 days'
);
create index if not exists wellye_sessions_user on wellye.sessions(user_id);
create index if not exists wellye_sessions_expiry on wellye.sessions(expires_at);
create table if not exists wellye.progress (
 user_id uuid primary key references wellye.accounts(id) on delete cascade,
 state jsonb,
 revision integer not null default 0,
 updated_at timestamptz not null default now()
);
create table if not exists wellye.rate_limits (
 key text not null,
 bucket bigint not null,
 hits integer not null default 1,
 created_at timestamptz not null default now(),
 primary key(key,bucket)
);
create index if not exists wellye_limits_expiry on wellye.rate_limits(created_at);
create table if not exists wellye.posts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references wellye.accounts(id) on delete cascade,
 message text not null check(length(message) between 1 and 280),
 created_at timestamptz not null default now()
);
create index if not exists wellye_posts_user on wellye.posts(user_id);
create index if not exists wellye_posts_date on wellye.posts(created_at desc);
alter table wellye.accounts enable row level security;
alter table wellye.sessions enable row level security;
alter table wellye.progress enable row level security;
alter table wellye.rate_limits enable row level security;
alter table wellye.posts enable row level security;
revoke all on all tables in schema wellye from public, anon, authenticated;
grant select,insert,update,delete on all tables in schema wellye to service_role;
-- Invoker only, explicitly revoked from all browser roles. The Edge function is
-- the sole entrypoint and authenticates opaque Wellye sessions, never shared JWTs.
create or replace function public.wellye_gateway(action text, payload jsonb default '{}'::jsonb, session_hash text default '', fingerprint text default '')
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 account wellye.accounts%rowtype;
 record wellye.progress%rowtype;
 uid uuid;
 mail text := lower(trim(payload->>'email'));
 token text := payload->>'session_hash';
 amount integer;
 limit_value integer;
 window_size integer;
 bucket_id bigint;
 result jsonb;
 new_revision integer;
 rate_key text;
 email_key text;
 password_valid boolean;
begin
 -- Atomic fixed-window limiter. Opaque fingerprint is computed server-side.
 limit_value := case when action in ('login','register','recover','delete_account') then 12 when action='ai' then 12 when action='post' then 10 else 180 end;
 window_size := case when action in ('login','register','recover','delete_account') then 900 when action='ai' then 3600 when action='post' then 3600 else 60 end;
 bucket_id := floor(extract(epoch from now())/window_size);
 rate_key := action||':'||fingerprint;
 insert into wellye.rate_limits(key,bucket) values(rate_key,bucket_id)
 on conflict(key,bucket) do update set hits=wellye.rate_limits.hits+1 returning hits into amount;
 if amount>limit_value then return jsonb_build_object('error','Muitas tentativas. Aguarde alguns minutos e tente novamente.','code','rate_limit'); end if;
 if action in ('login','register','recover') then
   email_key := 'email:'||encode(extensions.digest(coalesce(mail,''),'sha256'),'hex');
   insert into wellye.rate_limits(key,bucket) values(email_key,floor(extract(epoch from now())/900))
   on conflict(key,bucket) do update set hits=wellye.rate_limits.hits+1 returning hits into amount;
   if amount>18 then return jsonb_build_object('error','Muitas tentativas para esta conta. Tente novamente mais tarde.','code','rate_limit');end if;
   if mail is null or mail !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or length(mail)>254 then return jsonb_build_object('error','Informe um e-mail válido.','code','validation');end if;
 end if;
 if action in ('register','recover') and (length(coalesce(payload->>'password',''))<10 or octet_length(payload->>'password')>72) then return jsonb_build_object('error','Use uma senha com pelo menos 10 caracteres e até 72 bytes.','code','validation');end if;
 if action='register' then
   if length(trim(coalesce(payload->>'name','')))<2 or length(trim(payload->>'name'))>60 then return jsonb_build_object('error','Informe um nome entre 2 e 60 caracteres.','code','validation');end if;
   insert into wellye.accounts(email,name,password_hash,recovery_hash)
   values(mail,trim(payload->>'name'),extensions.crypt(payload->>'password',extensions.gen_salt('bf',12)),payload->>'recovery_hash')
   on conflict(email) do nothing returning * into account;
   if account.id is null then return jsonb_build_object('error','Não foi possível criar a conta. Se já possui cadastro, entre ou recupere seu acesso.','code','validation');end if;
   insert into wellye.progress(user_id) values(account.id);
 elsif action='login' then
   select * into account from wellye.accounts where email=mail;
   -- Dummy hash prevents skipping expensive bcrypt when the account is absent.
   password_valid := extensions.crypt(left(coalesce(payload->>'password',''),72),coalesce(account.password_hash,'$2a$12$pUQZ1kRnVEw2fWhOTOhOcuA9QOmQTYBFm0ygOrMjEgPa.VfcqD/La'))=account.password_hash;
   if account.id is null or password_valid is not true then return jsonb_build_object('error','E-mail ou senha incorretos.','code','credentials');end if;
 elsif action='recover' then
   select * into account from wellye.accounts where email=mail and recovery_hash=payload->>'old_recovery_hash' for update;
   if account.id is null then return jsonb_build_object('error','E-mail ou código de recuperação inválido.','code','credentials');end if;
   update wellye.accounts set password_hash=extensions.crypt(payload->>'password',extensions.gen_salt('bf',12)), recovery_hash=payload->>'recovery_hash' where id=account.id;
   delete from wellye.sessions where user_id=account.id;
 end if;
 if action in ('register','login','recover') then
   delete from wellye.sessions where expires_at<now();
   delete from wellye.rate_limits where created_at<now()-interval '2 days';
   insert into wellye.sessions(token_hash,user_id) values(token,account.id);
   select * into record from wellye.progress where user_id=account.id;
   return jsonb_build_object('user',jsonb_build_object('id',account.id,'name',account.name,'email',account.email),'state',record.state,'revision',record.revision);
 end if;
 select user_id into uid from wellye.sessions where token_hash=session_hash and expires_at>now();
 if uid is null then return jsonb_build_object('error','Entre novamente para continuar.','code','unauthorized');end if;
 if action='logout' then delete from wellye.sessions where token_hash=session_hash;return '{"ok":true}'::jsonb;end if;
 select * into account from wellye.accounts where id=uid;
 if action='delete_account' then
   if extensions.crypt(coalesce(payload->>'password',''),account.password_hash)<>account.password_hash then return jsonb_build_object('error','Sua senha está incorreta.','code','credentials');end if;
   delete from wellye.accounts where id=uid;return '{"ok":true}'::jsonb;
 end if;
 if action='load' then
   select * into record from wellye.progress where user_id=uid;
   return jsonb_build_object('user',jsonb_build_object('id',uid,'name',account.name,'email',account.email),'state',record.state,'revision',record.revision);
 end if;
 if action='save' then
   if jsonb_typeof(payload->'state')<>'object' or octet_length((payload->'state')::text)>2000000 or payload#>>'{state,version}'<>'1' or jsonb_typeof(payload#>'{state,answers}')<>'array' then return jsonb_build_object('error','Seu progresso não pôde ser validado.','code','validation');end if;
   update wellye.progress set state=payload->'state',revision=revision+1,updated_at=now() where user_id=uid and revision=(payload->>'revision')::integer returning revision into new_revision;
   if new_revision is null then return jsonb_build_object('error','Há alterações em outro dispositivo. Sincronize novamente.','code','conflict');end if;
   return jsonb_build_object('revision',new_revision);
 end if;
 if action='community' then
   select jsonb_build_object('members',coalesce((select jsonb_agg(t) from (
     select p.user_id as id,left(coalesce(nullif(p.state#>>'{profile,nickname}',''),'Estudante'),24) as nickname,
     (select count(*) from jsonb_array_elements(coalesce(p.state->'answers','[]')) a where left(a->>'at',10)>=to_char(date_trunc('week',now() at time zone 'America/Sao_Paulo'),'YYYY-MM-DD')) as points,
     (select count(distinct left(a->>'at',10)) from jsonb_array_elements(coalesce(p.state->'answers','[]')) a where left(a->>'at',10)>=to_char(date_trunc('week',now() at time zone 'America/Sao_Paulo'),'YYYY-MM-DD')) as days
     from wellye.progress p where p.state#>>'{profile,community}'='true'
     order by points desc,p.user_id limit 50
   ) t),'[]'::jsonb),'posts',coalesce((select jsonb_agg(t) from (
     select x.id,x.user_id,x.message,x.created_at,left(coalesce(nullif(p.state#>>'{profile,nickname}',''),'Estudante'),24) as nickname
     from wellye.posts x join wellye.progress p on p.user_id=x.user_id where p.state#>>'{profile,community}'='true' order by x.created_at desc limit 50
   ) t),'[]'::jsonb)) into result;return result;
 end if;
 if action='post' then
   if not exists(select 1 from wellye.progress where user_id=uid and state#>>'{profile,community}'='true') then return jsonb_build_object('error','Ative seu perfil público para compartilhar.','code','validation');end if;
   if length(trim(coalesce(payload->>'message','')))<1 or length(payload->>'message')>280 then return jsonb_build_object('error','Escreva uma mensagem com até 280 caracteres.','code','validation');end if;
   insert into wellye.posts(user_id,message) values(uid,trim(payload->>'message'));return '{"ok":true}'::jsonb;
 end if;
 if action='delete_post' then delete from wellye.posts where id=(payload->>'id')::uuid and user_id=uid;return '{"ok":true}'::jsonb;end if;
 if action='ai' then return jsonb_build_object('ok',true);end if;
 return jsonb_build_object('error','Operação não reconhecida.','code','validation');
end;
$$;
revoke all on function public.wellye_gateway(text,jsonb,text,text) from public,anon,authenticated;
grant execute on function public.wellye_gateway(text,jsonb,text,text) to service_role;
comment on schema wellye is 'Wellye-only identities and study data. Never connected to shared auth.users.';
