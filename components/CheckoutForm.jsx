'use client';
import {useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowLeft,ArrowRight,Check,LoaderCircle,LockKeyhole,ShieldCheck,Truck} from 'lucide-react';
import {useCart} from '@/components/CartContext';
import {useCommerce} from '@/components/CommerceContext';
import {shippingOptions,totals,id,stock as importedStock} from '@/lib/commerce';
import {validateExpiry,validateTestCard} from '@/lib/checkout';
import {formatMoney} from '@/lib/products';
import Photo from '@/components/Photo';
const states=['Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua','Ciudad de México','Coahuila','Colima','Durango','Estado de México','Guanajuato','Guerrero','Hidalgo','Jalisco','Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas'];
const asDigits=v=>v.replace(/\D/g,'');
export default function CheckoutForm(){
 const router=useRouter(),{db,commit}=useCommerce(),{lines,count,ready}=useCart();
 const user=db?.customers.find(x=>x.id===db?.session);
 const [form,setForm]=useState({name:'',email:'',phone:'',street:'',colony:'',city:'',state:'Puebla',zip:'',card:'',expiry:'',cvc:'',shippingCode:''});
 const [busy,setBusy]=useState(false),[error,setError]=useState('');const locked=useRef(false);const request=useRef(null);
 const put=(key,value)=>{setForm(p=>({...p,[key]:value}));setError('')};
 const customer={name:form.name||user?.name||'',email:form.email||user?.email||'',phone:form.phone||user?.phone||''};
 const opts=db?shippingOptions(db,db.cart,form.state):[];
 const mode=opts.some(x=>x.code===form.shippingCode)?form.shippingCode:(opts.find(x=>x.code!=='pickup')?.code||'pickup');
 const amounts=useMemo(()=>{if(!db||!lines.length)return null;try{return totals(db,db.cart,mode,form.state)}catch{return null}},[db,lines,mode,form.state]);
 const verify=()=>{
  if(customer.name.trim().length<3||!/^\S+@\S+\.\S+$/.test(customer.email)||asDigits(customer.phone).length!==10)throw Error('Ingresa nombre, correo válido y teléfono mexicano de 10 dígitos.');
  if(mode!=='pickup'&&(!form.street.trim()||!form.colony.trim()||!form.city.trim()||!/^\d{5}$/.test(form.zip)))throw Error('Completa la dirección y código postal de cinco dígitos.');
  if(!validateTestCard(form.card)&&asDigits(form.card)!=='4000000000000002')throw Error('Sólo se aceptan tarjetas ficticias 4242…4242 o 4000…0002. No ingreses datos reales.');
  if(!validateExpiry(form.expiry)||form.cvc!=='123')throw Error('Revisa el vencimiento (MM/AA) y el CVC de prueba 123.');
  if(!lines.every(x=>x.product.active&&x.quantity<=(db?.products?importedStock(db,x.id).available:0)))throw Error('El inventario cambió. Ajusta tu carrito antes de pagar.');
 };
 const submit=e=>{
  e.preventDefault();if(locked.current||!db||!amounts)return;
  try{verify();}catch(e){setError(e.message);return;}
  if(asDigits(form.card)==='4000000000000002'){
   try{commit({type:'payment/rejected',amount:amounts.total});}catch{}
   setError('Pago simulado rechazado por el emisor. No se realizó ningún cargo ni se modificó el inventario.');return;
  }
  locked.current=true;setBusy(true);setError('');request.current||=id('INTENTO');
  window.setTimeout(()=>{
   try{
    const result=commit({type:'checkout/confirm',requestId:request.current,customer,address:{street:form.street,colony:form.colony,city:form.city,state:form.state,zip:form.zip},shippingCode:mode});
    const order=result.orders.find(x=>result.processedRequests.some(p=>p.requestId===request.current&&p.orderId===x.id));
    if(!order)throw new Error('No se pudo recuperar el pedido.');
    router.push(`/pedido?orden=${encodeURIComponent(order.id)}`);
   }catch(err){setError(err.message);locked.current=false;request.current=null;setBusy(false);}
  },1000);
 };
 if(!ready)return <div className="checkout-loading">PREPARANDO TU PEDIDO...</div>;
 if(!lines.length&&!busy)return <section className="checkout-empty"><span className="eyebrow">CARRITO VACÍO</span><h1>PRIMERO,<br/>ELIGE TU MOTO.</h1><p>Selecciona una motocicleta o accesorio antes de continuar.</p><Link className="button button-dark" href="/catalogo">EXPLORAR CATÁLOGO <ArrowRight size={18}/></Link></section>;
 if(!amounts)return <div className="checkout-loading">NO SE PUDO CALCULAR EL PEDIDO. REVISA TU CARRITO.</div>;
 return <div className="checkout-layout"><div className="checkout-form-pane"><Link className="back-link" href="/catalogo"><ArrowLeft size={17}/> SEGUIR EXPLORANDO</Link><div className="checkout-heading"><span className="eyebrow">MOTOCLICK / COMPRA SIMULADA</span><h1>FINALIZA<br/><em>TU PEDIDO.</em></h1><p>Proceso académico conectado al inventario local; no se procesarán cargos reales.</p></div><form onSubmit={submit} noValidate>
 <div className="form-heading"><span>01</span><h2>DATOS DEL COMPRADOR</h2></div><div className="field-grid"><label className="field full-field"><span>NOMBRE COMPLETO</span><input value={customer.name} onChange={e=>put('name',e.target.value)} placeholder="Nombre y apellidos" autoComplete="name" required/></label><label className="field"><span>CORREO ELECTRÓNICO</span><input type="email" value={customer.email} onChange={e=>put('email',e.target.value)} placeholder="correo@ejemplo.com" autoComplete="email" required/></label><label className="field"><span>TELÉFONO</span><input inputMode="tel" value={customer.phone} onChange={e=>put('phone',e.target.value)} placeholder="2221234567" required/></label></div>
 <div className="form-heading heading-separated"><span>02</span><h2>ENTREGA</h2></div>{user?.addresses?.length>0&&<label className="field" style={{marginBottom:18}}><span>USAR UNA DIRECCIÓN GUARDADA</span><select defaultValue="" onChange={e=>{const a=user.addresses.find(x=>x.id===e.target.value);if(a)setForm(p=>({...p,street:a.street,colony:a.colony,city:a.city,state:a.state,zip:a.zip}))}}><option value="">Elegir dirección...</option>{user.addresses.map(a=><option value={a.id} key={a.id}>{a.street}, {a.city}, {a.state}</option>)}</select></label>}<p className="section-help">Los costos se estiman por destino y tipo de mercancía. Las motocicletas requieren transporte especializado.</p><div className="field-grid"><label className="field"><span>ESTADO</span><select value={form.state} onChange={e=>put('state',e.target.value)}>{states.map(s=><option key={s}>{s}</option>)}</select></label><label className="field"><span>MÉTODO DE ENTREGA</span><select value={mode} onChange={e=>put('shippingCode',e.target.value)}>{opts.map(o=><option value={o.code} key={o.code}>{o.label} · {formatMoney(o.cost)}</option>)}</select></label></div>
 {mode!=='pickup'&&<div className="field-grid" style={{marginTop:16}}><label className="field full-field"><span>CALLE Y NÚMERO</span><input value={form.street} onChange={e=>put('street',e.target.value)} autoComplete="street-address" required/></label><label className="field"><span>COLONIA</span><input value={form.colony} onChange={e=>put('colony',e.target.value)} required/></label><label className="field"><span>MUNICIPIO / CIUDAD</span><input value={form.city} onChange={e=>put('city',e.target.value)} required/></label><label className="field"><span>CÓDIGO POSTAL</span><input inputMode="numeric" maxLength={5} value={form.zip} onChange={e=>put('zip',asDigits(e.target.value).slice(0,5))} required/></label></div>}
 <div className="demo-shipping-note"><Truck size={18}/> ENTREGA REFERENCIAL: {amounts.option.days} DÍAS · {mode==='pickup'?'RECOLECCIÓN EN PUEBLA':amounts.option.label.toUpperCase()}</div>
 <div className="form-heading heading-separated"><span>03</span><h2>PAGO DE PRUEBA</h2></div><div className="demo-notice"><ShieldCheck size={22}/><div><strong>SIMULACIÓN ACADÉMICA · SIN STRIPE REAL</strong><p>No escribas datos bancarios reales. Ninguna tarjeta se envía o almacena.</p></div></div><div className="test-card-info"><span>APROBADA: 4242 4242 4242 4242</span><code>RECHAZADA: 4000 0000 0000 0002</code><small>VENCIMIENTO FUTURO · CVC DE PRUEBA 123</small></div><div className="field-grid payment-fields"><label className="field full-field"><span>NÚMERO FICTICIO</span><input inputMode="numeric" autoComplete="off" maxLength={19} value={form.card} onChange={e=>put('card',asDigits(e.target.value).slice(0,16).replace(/(.{4})/g,'$1 ').trim())} placeholder="4242 4242 4242 4242" required/></label><label className="field"><span>MM/AA</span><input inputMode="numeric" autoComplete="off" value={form.expiry} maxLength={5} onChange={e=>{const raw=asDigits(e.target.value).slice(0,4);put('expiry',raw.length>2?`${raw.slice(0,2)}/${raw.slice(2)}`:raw)}} placeholder="12/30" required/></label><label className="field"><span>CVC FICTICIO</span><input inputMode="numeric" autoComplete="off" maxLength={3} value={form.cvc} onChange={e=>put('cvc',asDigits(e.target.value).slice(0,3))} placeholder="123" required/></label></div>
 {error&&<p className="form-error" role="alert">{error}</p>}<button className="button button-dark checkout-submit" type="submit" disabled={busy}>{busy?<><LoaderCircle className="spinning" size={18}/> PROCESANDO DEMOSTRACIÓN...</>:<>CONFIRMAR COMPRA DE PRUEBA · {formatMoney(amounts.total)} <ArrowRight size={18}/></>}</button><p className="checkout-safe"><LockKeyhole size={15}/> IVA incluido; el inventario se reservará únicamente si la operación simulada es aprobada.</p>
 </form></div><aside className="checkout-summary-pane"><div className="checkout-summary-sticky"><span className="eyebrow">PEDIDO / RESUMEN</span><h2>TU SELECCIÓN <span>{count.toString().padStart(2,'0')}</span></h2><div className="checkout-items">{lines.map(x=><div className="checkout-item" key={x.id}><div className="checkout-item-photo"><Photo src={x.product.image} fallback={x.product.fallback||'/images/accessory.svg'} alt={x.product.name}/><span>{x.quantity}</span></div><div><strong>{x.product.name}</strong><span>{x.product.category} · {x.product.sku}</span></div><b>{formatMoney(x.product.price*x.quantity)}</b></div>)}</div><div className="checkout-price-line"><span>MERCANCÍA (IVA INCLUIDO)</span><span>{formatMoney(amounts.merchandise)}</span></div><div className="checkout-price-line"><span>ENVÍO (IVA INCLUIDO)</span><span>{formatMoney(amounts.shipping)}</span></div><div className="checkout-price-line"><span>SUBTOTAL SIN IVA</span><span>{formatMoney(amounts.subtotal)}</span></div><div className="checkout-price-line"><span>IVA 16% (DESGLOSADO)</span><span>{formatMoney(amounts.iva)}</span></div><div className="checkout-grand-total"><span>TOTAL DEMO</span><strong>{formatMoney(amounts.total)}</strong></div><div className="checkout-summary-note"><Check size={16}/><p>Se creará un pedido real dentro de la simulación, con reserva y seguimiento local.</p></div></div></aside></div>;
}
