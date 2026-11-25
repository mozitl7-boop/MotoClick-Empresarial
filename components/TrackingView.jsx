'use client';
import {useMemo,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {Truck,ArrowRight,MapPin,PackageCheck} from 'lucide-react';
import {useCommerce} from '@/components/CommerceContext';
import {labelStatus} from '@/lib/commerce';
import {formatMoney} from '@/lib/products';
export default function TrackingView(){
 const params=useSearchParams(),{db,commit}=useCommerce();const [orderId,setOrderId]=useState(params.get('orden')||''),[email,setEmail]=useState(''),[searched,setSearched]=useState(false),[reason,setReason]=useState(''),[error,setError]=useState(''),[ok,setOk]=useState('');
 const user=db?.customers.find(x=>x.id===db.session);
 const order=useMemo(()=>{
  if(!db)return null;const candidate=db.orders.find(o=>o.id.toLowerCase()===orderId.trim().toLowerCase());
  return candidate&&(user?.email===candidate.customer.email||searched&&email.toLowerCase().trim()===candidate.customer.email)?candidate:null;
 },[db,orderId,searched,email,user]);
 const shipments=db?.shipments.filter(s=>s.orderId===order?.id)||[];
 const pos=db?.returns.filter(r=>r.orderId===order?.id)||[];
 const events=[...(order?.events||[]),...shipments.flatMap(s=>s.events.map(e=>({...e,text:`${s.kind.toUpperCase()}: ${e.text}`})))].sort((a,b)=>new Date(b.date)-new Date(a.date));
 const request=(kind)=>{try{commit({type:'return/request',orderId:order.id,kind,reason});setOk('Solicitud registrada. Puedes revisar su estado aquí.');setError('');setReason('');}catch(e){setError(e.message)}};
 return <section className="account-shell"><span className="eyebrow">MOTOCLICK / PEDIDOS</span><h1 className="admin-page-title">SEGUIMIENTO.</h1><p>Consulta el avance registrado en el sistema administrativo. Los movimientos de transporte son simulados.</p><form className="tracking-find" onSubmit={e=>{e.preventDefault();setSearched(true);setError('');setOk('')}}><label>NÚMERO DE PEDIDO <input value={orderId} onChange={e=>{setOrderId(e.target.value);setSearched(false)}} placeholder="PED-..." required/></label>{!user&&<label>CORREO USADO EN LA COMPRA <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setSearched(false)}} required/></label>}<button className="button button-dark" type="submit">BUSCAR PEDIDO <ArrowRight size={15}/></button></form>
 {(searched||user)&&!order&&<p className="form-error" role="alert">No encontramos ese pedido con los datos proporcionados.</p>}
 {error&&<p className="form-error" role="alert">{error}</p>}{ok&&<p className="success-note" role="status">{ok}</p>}
 {order&&<div className="tracking-layout"><div className="ops-panel"><span className="eyebrow">{order.id}</span><h2>{labelStatus(order.status).toUpperCase()}</h2><p>{new Date(order.date).toLocaleString('es-MX')} · {order.customer.name}</p><div className="order-products">{order.items.map(x=><div key={x.id}><strong>{x.quantity} × {x.name}</strong><span>{formatMoney(x.amount)}</span></div>)}</div><div className="order-products"><div><strong>ENTREGA</strong><span>{order.shippingLabel}</span></div><div><strong>TOTAL (IVA INCLUIDO)</strong><span>{formatMoney(order.total)}</span></div></div><Link href={`/pedido?orden=${encodeURIComponent(order.id)}`} className="ops-button">CONSULTAR COMPROBANTE</Link></div>
 <div className="ops-panel"><h2>ENVÍOS Y GUÍAS</h2>{shipments.map(s=><div className="track-shipment" key={s.id}><div className="track-shipment-head"><Truck size={22}/><strong>{s.kind==='motocicleta'?'MOTOCICLETA · TRANSPORTE ESPECIALIZADO':'ACCESORIOS / PAQUETERÍA'}</strong></div><p>Estado: <b>{labelStatus(s.status)}</b></p><p>Transportista: {s.carrier||'Pendiente de asignación'}</p><p>Guía: {s.tracking||'Se asignará al preparar el envío'}</p><p>Entrega estimada: {new Date(s.estimatedAt).toLocaleDateString('es-MX')}</p>{s.incidents.map(i=><p className="form-error" key={i.id}>INCIDENCIA: {i.reason}</p>)}</div>)}</div>
 <div className="ops-panel"><h2>HISTORIAL DE MOVIMIENTOS</h2><div className="timeline">{events.map(e=><div className="timeline-item" key={e.id}><time>{new Date(e.date).toLocaleString('es-MX')}</time><p>{e.text}</p></div>)}</div></div>
 <div className="ops-panel"><h2>ATENCIÓN POSVENTA</h2><p>Solicita una cancelación antes del despacho o una devolución después de recibir el pedido.</p>{pos.map(r=><div className="account-address" key={r.id}><span>{r.type.toUpperCase()} · {labelStatus(r.status)} · {r.reason}</span></div>)}<label className="ops-form">MOTIVO DE LA SOLICITUD <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="Describe el motivo"/></label><div className="ops-actions"><button className="ops-button" type="button" disabled={!reason.trim()||pos.some(r=>!['rechazada','reembolsada'].includes(r.status))} onClick={()=>request('cancelacion')}>SOLICITAR CANCELACIÓN</button><button className="ops-button ghost" type="button" disabled={!reason.trim()||pos.some(r=>!['rechazada','reembolsada'].includes(r.status))} onClick={()=>request('devolucion')}>SOLICITAR DEVOLUCIÓN</button></div></div></div>}
 </section>;
}
