'use client';
import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import {useCommerce} from '@/components/CommerceContext';
const CartContext=createContext(null);
export function CartProvider({children}){
 const {db,ready,commit,stock}=useCommerce();
 const [isOpen,setOpen]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{document.body.classList.toggle('drawer-active',isOpen);return()=>document.body.classList.remove('drawer-active')},[isOpen]);
 const execute=(a,open=false)=>{try{commit(a);setError('');if(open)setOpen(true);return true;}catch(e){setError(e.message);if(open)setOpen(true);return false;}};
 const add=(id,quantity=1,size='')=>execute({type:'cart/add',productId:id,quantity,size},true);
 const update=(id,quantity,size='')=>execute({type:'cart/set',productId:id,quantity,size});
 const remove=(id,size='')=>execute({type:'cart/set',productId:id,quantity:0,size});
 const clear=()=>execute({type:'cart/clear'});
 const cart=db?.cart||[];
 const lines=useMemo(()=>cart.map(i=>({...i,lineKey:`${i.id}:${i.size||''}`,product:db?.products.find(p=>p.id===i.id)})).filter(x=>x.product),[db]);
 const count=cart.reduce((a,c)=>a+c.quantity,0),total=lines.reduce((a,c)=>a+c.quantity*c.product.price,0);
 const value={cart,lines,count,total,ready,isOpen,setOpen,add,update,remove,clear,error,setError,stock};
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(){const c=useContext(CartContext);if(!c)throw new Error('CartProvider no disponible');return c;}
