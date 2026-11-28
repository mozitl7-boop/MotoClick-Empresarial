'use client';
import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {DB_KEY,CART_KEY,LEGACY_ORDER_KEY,migrateDB,mutateDB,stock} from '@/lib/commerce';
const CommerceContext=createContext(null);
const readJson=(key,where=localStorage)=>{try{return JSON.parse(where.getItem(key)||'null');}catch{return null}};
export function CommerceProvider({children}){
 const [db,setDb]=useState(null);const [error,setError]=useState('');const [lastOrderId,setLastOrderId]=useState('');
 useEffect(()=>{
   try {
     const oldCart=readJson(CART_KEY);
     const order=readJson(LEGACY_ORDER_KEY,sessionStorage);
     const raw=readJson(DB_KEY);
     const result=migrateDB(raw,oldCart,order);
     const photosChanged=Array.isArray(raw?.products)&&raw.products.some(p=>{
       const migrated=result.products.find(x=>String(x.id)===String(p.id));
       return migrated&&(p.image!==migrated.image||p.imageDetail!==migrated.imageDetail);
     });
     if(!raw||raw.version!==result.version||photosChanged)localStorage.setItem(DB_KEY,JSON.stringify(result));
     setDb(result);
   } catch(e){setError(`No se pudo iniciar el almacenamiento: ${e.message}`);}
   const sync=e=>{if(e.key===DB_KEY&&e.newValue){try{setDb(migrateDB(JSON.parse(e.newValue)));}catch{}}};
   window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[]);
 const commit=useCallback((action)=>{
   try{
     const latest=migrateDB(readJson(DB_KEY)||db);
     if(!latest)throw new Error('El almacenamiento todavía no está listo.');
     const next=mutateDB(latest,action);
     localStorage.setItem(DB_KEY,JSON.stringify(next));setDb(next);setError('');
     if(action.type==='checkout/confirm'&&next.orders[0])setLastOrderId(next.orders[0].id);
     return next;
   }catch(e){setError(e.message);throw e;}
 },[db]);
 const clearError=()=>setError('');
 const value=useMemo(()=>({db,ready:!!db,commit,error,clearError,stock:(id,size)=>db?stock(db,id,size):{physical:0,reserved:0,available:0},lastOrderId,setLastOrderId}),[db,commit,error,lastOrderId]);
 return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}
export function useCommerce(){const ctx=useContext(CommerceContext);if(!ctx)throw new Error('CommerceProvider no disponible');return ctx;}
