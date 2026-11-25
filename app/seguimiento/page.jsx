import {Suspense} from 'react';
import TrackingView from '@/components/TrackingView';
export const metadata={title:'Seguimiento de pedidos'};
export default function TrackingPage(){return <Suspense fallback={<p className="checkout-loading">CARGANDO PEDIDOS...</p>}><TrackingView/></Suspense>}
