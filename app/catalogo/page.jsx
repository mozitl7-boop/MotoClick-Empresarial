import {Suspense} from 'react';
import CatalogView from '@/components/CatalogView';
export const metadata={title:'Catálogo de motocicletas'};
export default function CatalogPage(){return <Suspense fallback={<div className="checkout-loading">CARGANDO CATÁLOGO...</div>}><CatalogView/></Suspense>;}
