'use client';
import {Suspense} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {useCommerce} from '@/components/CommerceContext';
import ProductDetail from '@/components/ProductDetail';
function View(){const params=useSearchParams();const {db}=useCommerce();const product=db?.products.find(p=>p.sku===params.get('sku'));if(!db)return <p className="checkout-loading">CARGANDO...</p>;if(!product)return <section className="checkout-empty"><h1>PRODUCTO NO ENCONTRADO</h1><Link href="/catalogo">VOLVER AL CATÁLOGO</Link></section>;return <ProductDetail product={product}/>;}
export default function ProductPage(){return <Suspense fallback={<p className="checkout-loading">CARGANDO...</p>}><View/></Suspense>}
