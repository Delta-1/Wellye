import type { AppState, User } from './types';
export const API = import.meta.env.VITE_WELLYE_API_URL || 'https://qaiqflcxfxygynumapyp.supabase.co/functions/v1/wellye-api';
export class ApiError extends Error {code:string; constructor(message:string,code='unknown'){super(message);this.code=code;}}
export async function request<T=Record<string,unknown>>(action:string,payload:Record<string,unknown>={},token?:string):Promise<T>{
 const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json',...(token?{'X-Wellye-Session':token}:{})},body:JSON.stringify({action,payload}),signal:AbortSignal.timeout(action==='ai'?45000:18000)});
 const data=await response.json();if(!response.ok||data.error)throw new ApiError(data.error??'Não foi possível concluir agora.',data.code);return data;
}
export interface AuthResponse { user:User; token:string; state:AppState|null; revision:number; recoveryCode?:string }
export interface LoadResponse { user:User; state:AppState|null; revision:number }
