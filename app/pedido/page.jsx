import {Suspense} from 'react';
import ReceiptView from '@/components/ReceiptView';
export const metadata={title:'Comprobante académico'};
export default function Pedido(){return <Suspense fallback={<div className="checkout-loading">CARGANDO...</div>}><ReceiptView/></Suspense>}
