import {notFound} from 'next/navigation';
import {findProduct,products} from '@/lib/products';
import ProductDetail from '@/components/ProductDetail';
export function generateStaticParams(){return products.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}){const {slug}=await params;const p=findProduct(slug);return {title:p?p.name:'Motocicleta no encontrada'};}
export default async function MotorcyclePage({params}){const {slug}=await params;const product=findProduct(slug);if(!product)notFound();return <ProductDetail product={product}/>;}
