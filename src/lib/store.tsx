import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState, User } from './types';
import { ApiError, request } from './api';
import type { AuthResponse, LoadResponse } from './api';
import { emptyState, mergeStates, validateState } from './study';
interface Session {user:User;token:string}
interface Context {state:AppState;update:(fn:(s:AppState)=>AppState)=>void;user:User|null;guest:boolean;ready:boolean;online:boolean;syncStatus:string;authenticate:(mode:string,data:Record<string,unknown>)=>Promise<string|undefined>;explore:()=>void;logout:()=>void;toast:(text:string)=>void;message:string;sync:()=>Promise<void>;token?:string;recoveryCode:string;dismissRecovery:()=>void}
const Context=createContext<Context|null>(null);
function read<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)??'null')??fallback;}catch{return fallback;}}
export function Provider({children}:{children:ReactNode}){
 const [session,setSession]=useState<Session|null>(()=>read('wellye.session',null));
 const [recoveryCode,setRecoveryCode]=useState('');
 const [guest,setGuest]=useState(()=>read('wellye.guest',false));
 const key=session?`wellye.data.${session.user.id}`:'wellye.data.guest';
 const [state,setState]=useState<AppState>(()=>{const s=read(key,null);return validateState(s)?s:emptyState(session?.user.name);});
 const [ready,setReady]=useState(!session);const [online,setOnline]=useState(navigator.onLine);const [syncStatus,setSyncStatus]=useState(session?'Conectando…':'Neste dispositivo');const [message,setMessage]=useState('');
 const activeToken=useRef(session?.token);activeToken.current=session?.token;
 const revision=useRef(read<number>(key+'.revision',0));const pending=useRef(read<boolean>(key+'.pending',false));const active=useRef(false);const current=useRef(state);current.current=state;const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const toast=useCallback((text:string)=>{setMessage(text);clearTimeout(timer.current);timer.current=setTimeout(()=>setMessage(''),5000);},[]);
 const sync=useCallback(async()=>{if(!session)return;if(!navigator.onLine){setReady(true);setSyncStatus('Salvo aqui · offline');return;}if(active.current)return;const runToken=session.token;active.current=true;setSyncStatus('Sincronizando…');try{
 const remote=await request<LoadResponse>('load',{},session.token);if(activeToken.current!==runToken)return;revision.current=remote.revision;
 let next=current.current;
 if(pending.current){if(remote.state&&validateState(remote.state)&&read<number>(key+'.revision',0)!==remote.revision)next=mergeStates(next,remote.state);
 const captured=next;const result=await request<{revision:number}>('save',{state:captured,revision:revision.current},session.token);if(activeToken.current!==runToken)return;revision.current=result.revision;
 // Edits made while the network request was in flight stay pending for the next sync.
 if(current.current===next||current.current===captured){pending.current=false;setState(captured);}else if(next!==current.current){setState(s=>mergeStates(s,captured));}
 }else if(remote.state&&validateState(remote.state)){next=remote.state;setState(next);}
 localStorage.setItem(key+'.revision',String(revision.current));localStorage.setItem(key+'.pending',JSON.stringify(pending.current));setSyncStatus(pending.current?'Alterações pendentes':'Tudo sincronizado');
 }catch(error){if(activeToken.current!==runToken)return;if(error instanceof ApiError&&error.code==='unauthorized'){setSession(null);localStorage.removeItem('wellye.session');setGuest(false);toast('Sua sessão terminou. Entre novamente para continuar.');}else setSyncStatus('Salvo aqui · sincronização pendente');}finally{active.current=false;if(activeToken.current===runToken)setReady(true);}},[session,key,toast]);
 const update=useCallback((fn:(s:AppState)=>AppState)=>{pending.current=true;localStorage.setItem(key+'.pending','true');setState(fn);},[key]);
 useEffect(()=>{if(!session&&!guest)return;localStorage.setItem(key,JSON.stringify(state));if(session&&pending.current){const t=setTimeout(()=>void sync(),900);return()=>clearTimeout(t);}},[state,key,session,guest,sync]);
 useEffect(()=>{void sync();const t=setInterval(()=>void sync(),60000);return()=>clearInterval(t);},[sync]);
 useEffect(()=>{const on=()=>{setOnline(true);void sync();};const off=()=>setOnline(false);window.addEventListener('online',on);window.addEventListener('offline',off);return()=>{window.removeEventListener('online',on);window.removeEventListener('offline',off);};},[sync]);
 async function authenticate(mode:string,data:Record<string,unknown>){const result=await request<AuthResponse>(mode,data);if(result.recoveryCode)setRecoveryCode(result.recoveryCode);const nextSession={user:result.user,token:result.token};const accountKey=`wellye.data.${result.user.id}`;let next=result.state&&validateState(result.state)?result.state:emptyState(result.user.name);
 const cached=read<AppState|null>(accountKey,null);if(cached&&validateState(cached)&&read(accountKey+'.pending',false)){next=mergeStates(cached,next);pending.current=true;}else pending.current=false;
 if(mode==='register'){const visitor=read<AppState|null>('wellye.data.guest',null);if(visitor&&validateState(visitor)&&visitor.profile.onboarded){next={...visitor,profile:{...visitor.profile,name:result.user.name}};pending.current=true;}}
 localStorage.setItem(accountKey+'.pending',JSON.stringify(pending.current));activeToken.current=result.token;
 revision.current=result.revision;localStorage.setItem('wellye.session',JSON.stringify(nextSession));localStorage.setItem(accountKey,JSON.stringify(next));localStorage.setItem(accountKey+'.revision',String(result.revision));localStorage.setItem('wellye.guest','false');setState(next);setGuest(false);setSession(nextSession);setReady(true);setSyncStatus('Tudo sincronizado');return result.recoveryCode;}
 function explore(){const saved=read('wellye.data.guest',null);setState(validateState(saved)?saved:emptyState('Visitante'));setGuest(true);localStorage.setItem('wellye.guest','true');setReady(true);}
 function logout(){activeToken.current=undefined;if(session)void request('logout',{},session.token).catch(()=>{});localStorage.removeItem('wellye.session');localStorage.setItem('wellye.guest','false');setSession(null);setGuest(false);setState(emptyState());pending.current=false;setSyncStatus('Neste dispositivo');}
 return <Context.Provider value={{state,update,user:session?.user??null,token:session?.token,guest,ready,online,syncStatus,authenticate,explore,logout,toast,message,sync,recoveryCode,dismissRecovery:()=>setRecoveryCode('')}}>{children}{message&&<div className="toast" role="status">{message}</div>}</Context.Provider>;
}
export function useApp(){const c=useContext(Context);if(!c)throw new Error('Provider ausente');return c;}
