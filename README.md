# Wellye

**Seu estudo. Seu ritmo. Seu futuro.**

Aplicativo de estudo em português, inspirado no layout fornecido: azul escuro, roxo, cartões e navegação mobile. A mesma aplicação roda na web, como PWA instalável e em um aplicativo Android via Capacitor.

## O que já funciona

- Cadastro e login exclusivos do Wellye, recuperação com código de uso único e exclusão da própria conta.
- Objetivos para provas escolares, ENEM, vestibulares, concursos e outros; formulários condicionais, banca, cargo e data opcional.
- Personalização por tempo, dificuldades e formatos de aprendizado.
- Diagnóstico de cinco questões em dificuldade crescente; correção de cada alternativa e reflexão sobre as dificuldades.
- Plano diário com prioridades, checklist persistente e cronômetro de foco. O plano fica estável durante o dia e é recalculado quando você muda suas preferências ou conclui o diagnóstico.
- 30 questões autorais comentadas em seis matérias; práticas e simulados de até 15 questões. Repetições são identificadas como revisão, sem atribuição a bancas oficiais.
- Lições de leitura, leitura em voz alta do dispositivo, mapas de conceitos e busca externa por videoaulas.
- Flashcards próprios e do banco inicial, com revisão espaçada de 1, 2, 4, 8 dias, até 60 dias.
- Métricas reais de respostas, acertos, erros, sessões concluídas, minutos registrados e constância; gráficos de 7 e 30 dias, matéria e banca.
- Retrospectiva animada do mês anterior no primeiro acesso do mês seguinte, quando há atividade; acesso manual ao mês atual.
- Comunidade opcional por apelido, ranking semanal de questões respondidas e mural; e-mail não é público.
- Offline após o primeiro carregamento, sincronização ao reconectar e cópia/restauração do progresso em JSON.
- Modo claro/escuro e lembretes de estudo. No navegador, os lembretes dependem de o app permanecer aberto. No Android, são notificações locais agendadas.
- Acervos externos oficiais de INEP, FUVEST, FGV e Cebraspe.

## Rodar localmente

Requer Node.js 22 ou superior.

```sh
npm ci
npm run dev
npm test
npm run build
```

O endpoint público está configurado para a função `wellye-api` no WORKSPACE. Para usar outra infraestrutura, copie `.env.example` para `.env` e ajuste `VITE_WELLYE_API_URL`. Nenhuma chave privilegiada é enviada ao cliente.

## GitHub Pages

O workflow **Web · testes e GitHub Pages** roda os testes, verifica TypeScript, gera a aplicação e publica os arquivos estáticos em pushes na `main`. Pull requests executam testes e build sem publicar.

URL esperada após a ativação do Pages: **https://delta-1.github.io/Wellye/**.

Se o repositório ainda não permitir publicação por Actions, configure **Settings → Pages → Source → GitHub Actions** e execute novamente o workflow. Isso depende das permissões administrativas do repositório; não é um ajuste no código da aplicação.

A aplicação utiliza URLs relativas e navegação por hash, compatíveis com o subdiretório `/Wellye/`. Fontes e conteúdo inicial são empacotados para uso offline. O service worker só armazena arquivos estáticos do escopo do Wellye, nunca chamadas à API.

## Aplicativo Android

O workflow **Android · gerar APK** monta o projeto nativo com as versões fixadas do Capacitor e compila o APK de testes. O download aparece no artefato **Wellye-Android-APK**, na execução do GitHub Actions.

```sh
npm run mobile:android
npx cap open android
```

O aplicativo usa o pacote `com.wellye.app` e inclui os arquivos web localmente, sem depender do GitHub Pages para abrir. Para publicar na Play Store, ainda será necessário configurar a assinatura de produção e gerar um AAB. O APK de debug usa a chave temporária do runner e pode exigir desinstalar uma compilação anterior para instalar outra. Para iPhone/iPad, use a instalação PWA pelo Safari; não há IPA assinado nesta versão.

## Banco e isolamento de contas

Projeto Supabase **WORKSPACE**, referência `qaiqflcxfxygynumapyp`.

O schema privado **`wellye`** contém `accounts`, `sessions`, `progress`, `rate_limits` e `posts`. O Wellye **não cria nem consulta usuários em `auth.users`**, nem utiliza perfis ou sessões de outros aplicativos.

- Senhas com bcrypt, custo 12; limite de 72 bytes para evitar truncamento silencioso.
- Sessões opacas aleatórias de 256 bits, validade de 30 dias; somente hashes SHA-256 ficam no banco.
- Código de recuperação aleatório, armazenado apenas como hash. A recuperação troca o código e revoga sessões anteriores. Não há envio de e-mail ou OAuth nesta versão.
- Controle atômico de tentativas por IP e por conta, sem armazenar IP em texto puro.
- Todas as tabelas têm RLS habilitado e acesso revogado de `anon`, `authenticated` e `PUBLIC`. Sem políticas públicas: acesso é exclusivamente pelo backend.
- A função `public.wellye_gateway` é `SECURITY INVOKER`, com `search_path` vazio e permissão de execução apenas para `service_role`.
- A Edge Function autentica as sessões exclusivas do Wellye, por isso `verify_jwt=false`. JWTs de logins compartilhados não são aceitos.
- Atualizações de progresso exigem a revisão corrente; conflitos combinam respostas, checklists e sessões de foco por IDs estáveis. Preferências e edições do dispositivo local prevalecem; flashcards e objetivos não têm edição colaborativa em tempo real.
- Dados locais são separados por ID de conta. Em aparelho compartilhado, limpe também os dados de navegação depois de sair.

O SQL de referência é `supabase/schema.sql`; a migração correspondente foi criada pelo CLI em `supabase/migrations/`. O schema e a função foram aplicados exclusivamente ao namespace Wellye. Não use comandos de reset neste projeto compartilhado.

Aplique apenas essa migração em outra instalação limpa e publique a função:

```sh
supabase functions deploy wellye-api --project-ref SEU_PROJETO --no-verify-jwt
```

A lista de origens permitidas no backend inclui o GitHub Pages do proprietário, o host local do Capacitor e endereços locais de desenvolvimento. Atualize a lista se mudar de domínio.

## Gemini: ativação posterior

O assistente tem integração real no backend e fica indisponível de forma explícita enquanto falta a chave. O plano automático não depende de IA.

Configure, nos **Secrets da Edge Function** do Supabase:

- `WELLYE_GEMINI_API_KEY`: sua chave privada.
- `WELLYE_GEMINI_MODEL`: opcional; padrão `gemini-2.5-flash`. Confirme a disponibilidade do modelo na sua conta e altere o secret quando necessário.

Não coloque essas chaves em `VITE_*`, GitHub Pages ou no código. O assistente recebe apenas o pedido e um contexto reduzido de estudo, sem senha ou e-mail.

**Limites desta versão:** não há pesquisa automática do último edital, ingestão de PDF, catálogo completo de concursos, assinatura paga nem geração ilimitada de questões. O aluno pode informar concurso/cargo e colar um trecho do edital no assistente quando a chave estiver configurada. Fontes oficiais continuam sendo a referência.

## Validação

- Testes de orçamento do plano, prioridade de foco, seleção de diagnóstico, integridade de questões, evolução, constância e combinação de dados de dois dispositivos.
- Build com TypeScript estrito e projeto Android gerado/sincronizado.
- API verificada com contas temporárias: cadastro, isolamento entre contas, persistência, conflito de revisão, credencial inválida, restrição da comunidade, recuperação, revogação e limpeza das contas de teste.
- Fluxo visual de personalização, cinco questões, correção, reflexão, resultado e painel testado no navegador.

O ranking serve como incentivo informal; dados de progresso offline são declarados pelo cliente e não constituem avaliação certificada ou mecanismo antifraude.
