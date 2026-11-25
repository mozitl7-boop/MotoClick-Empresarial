'use client';
import Link from 'next/link';
import {ArrowUpRight,Plus} from 'lucide-react';
import Photo from '@/components/Photo';
import {useCart} from '@/components/CartContext';
import {useCommerce} from '@/components/CommerceContext';
import {formatMoney} from '@/lib/products';
export default function ProductCard({product,index=0}){
 const {add}=useCart();const {stock}=useCommerce();const left=stock(product.id).available;const available=product.active&&left>0;
 return <article className="product-card">
  <div className="product-photo-wrap"><Link href={`/producto?sku=${encodeURIComponent(product.sku)}`} className="product-photo-link" aria-label={`Ver ${product.name}`}><Photo className="product-photo" src={product.image} fallback={product.fallback||'/images/accessory.svg'} alt={`${product.name}, fotografía de catálogo`}/></Link><span className="product-index">{String(index+1).padStart(2,'0')} / MC</span>{!available&&<span className="product-new" style={{background:'#202020'}}>AGOTADO</span>}<Link className="product-open" href={`/producto?sku=${encodeURIComponent(product.sku)}`} aria-label={`Detalles de ${product.name}`}><ArrowUpRight size={19}/></Link></div>
  <div className="product-info"><Link href={`/producto?sku=${encodeURIComponent(product.sku)}`} className="product-name">{product.name}</Link><span className="product-price">{formatMoney(product.price)}</span></div>
  <div className="product-bottom"><span>{product.category.toUpperCase()} · {product.kind==='motocicleta'?`${product.cc} CC`:'ACCESORIO'}<small className="stock-indicator">{available?`${left} DISP.`:'SIN EXISTENCIAS'}</small></span><button disabled={!available} aria-label={`Agregar ${product.name} al carrito`} className="product-add" onClick={()=>add(product.id)}><Plus size={15}/> AGREGAR</button></div>
 </article>;
}
