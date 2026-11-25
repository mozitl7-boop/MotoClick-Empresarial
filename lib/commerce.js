/* Motor transaccional local de MotoClick. Sin dependencias ni servicios externos.
   Un documento JSON se escribe por operación para evitar estados parciales en una pestaña.
   NO proporciona concurrencia multiusuario ni control de acceso seguro de servidor. */
import { products as legacyProducts, breakdown } from './products.js';
export const DB_KEY = 'motoclick_business_v3';
export const CART_KEY = 'motoclick_v2_cart';
export const LEGACY_ORDER_KEY = 'motoclick_v2_last_order';
export const money = value => Math.round((Number(value) || 0) * 100) / 100;
export const id = (prefix='REG') => `${prefix}-${(globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).toUpperCase()}`;
const now = () => new Date().toISOString();
const fail = (msg) => { throw new Error(msg); };
const positive = (n, field='Cantidad') => Number.isInteger(Number(n)) && Number(n)>0 ? Number(n) : fail(`${field}: ingresa un entero mayor que cero.`);
const nonnegative = (n, field='Cantidad') => Number.isInteger(Number(n)) && Number(n)>=0 ? Number(n) : fail(`${field}: debe ser un entero no negativo.`);
const required = (v, field) => String(v ?? '').trim() || fail(`El campo ${field} es obligatorio.`);
const find = (arr, ident, name) => arr.find(x => String(x.id)===String(ident)) || fail(`${name} no encontrado.`);
const appendEvent = (item, text, extra={}) => { item.events ||= []; item.events.push({id:id('EVT'),date:now(),text,...extra}); };
const roundUnit = v => money(v);
const clone = x => structuredClone(x);
const MOTOR = 'motocicleta';
const DEFAULT_SHOPS = [
  {id:'PRV-YAMAHA', name:'Distribuidor Yamaha (simulado)',contact:'Área de suministros',phone:'2220000101',email:'proveedor-yamaha@example.test',address:'Puebla, Puebla',leadDays:12,active:true},
  {id:'PRV-HONDA', name:'Distribuidor Honda (simulado)',contact:'Departamento comercial',phone:'2220000102',email:'proveedor-honda@example.test',address:'Puebla, Puebla',leadDays:14,active:true},
  {id:'PRV-MULTI', name:'Distribuidora multimarca (simulada)',contact:'Ventas mayoristas',phone:'2220000103',email:'proveedor-multi@example.test',address:'Puebla, Puebla',leadDays:10,active:true},
];
const ACC = [
  {id:101,sku:'MC-ACC-101',slug:'casco-integral-ruta',name:'Casco integral Ruta',brand:'MotoClick',model:'Ruta',category:'Cascos',kind:'accesorio',price:1890,description:'Casco integral de demostración. Homologación y tallas pendientes de verificación.',specs:{Tallas:'S–XL',Material:'Termoplástico (referencia)'},stockMin:4,initialStock:12,image:'/images/casco%20integral.JPG'},
  {id:102,sku:'MC-ACC-102',slug:'guantes-urbanos',name:'Guantes urbanos',brand:'MotoClick',model:'Urbano',category:'Accesorios',kind:'accesorio',price:690,description:'Guantes de uso urbano, referencia académica.',specs:{Tallas:'S–XL',Uso:'Urbano'},stockMin:5,initialStock:16,image:'/images/guantes.JPG'},
  {id:103,sku:'MC-ACC-103',slug:'chamarra-protectora',name:'Chamarra protectora',brand:'MotoClick',model:'Ruta Pro',category:'Accesorios',kind:'accesorio',price:2450,description:'Chamarra de protección, especificaciones simuladas.',specs:{Tallas:'S–XL',Uso:'Carretera'},stockMin:3,initialStock:8,image:'/images/chamarra.JPG'},
  {id:104,sku:'MC-ACC-104',slug:'candado-disco',name:'Candado para disco',brand:'MotoClick',model:'Seguro',category:'Accesorios',kind:'accesorio',price:530,description:'Candado de disco para motocicleta, demostración.',specs:{Uso:'Seguridad',Presentación:'Unidad'},stockMin:5,initialStock:15,image:'/images/candado.JPG'},
];
const chooseSupplier = name => name.startsWith('Yamaha') ? 'PRV-YAMAHA' : name.startsWith('Honda') ? 'PRV-HONDA' : 'PRV-MULTI';
export function seedDB() {
  const products = legacyProducts.map((p,i)=>({
    ...p, brand:p.name.split(' ')[0], model:p.name.split(' ').slice(1).join(' '), kind:MOTOR,
    price:money(p.price), acquisitionCost:money(p.price*.76),
    stockMin:2, warranty:'12 meses (referencial)',deliveryDays: i%3===0?8:12,
    supplierId:chooseSupplier(p.name), active:true, specs:{Cilindrada:`${p.cc} cc`,Color:p.color},
    image:p.image, imageDetail:p.imageDetail, imageVerified:false,
  })).concat(ACC.map(p=>({...p, acquisitionCost:money(p.price*.63),warranty:'3 meses (referencial)',deliveryDays:4,supplierId:'PRV-MULTI',active:true,cc:null,color:'—',image:p.image,imageDetail:p.image,fallback:`/images/acc-${p.id}.svg`,imageVerified:false,new:false})));
  const units=[];
  const accessories={};
  for(const p of products){
    if(p.kind===MOTOR){ for(let i=0;i<4+(p.id%3);i++) units.push({id:id('VIN'),productId:p.id,vin:`SIM-${p.sku.replace(/[^A-Z0-9]/g,'')}-${String(i+1).padStart(4,'0')}`,status:'available',purchaseOrderId:'APERTURA',orderId:null}); }
    else accessories[p.id]={physical:p.initialStock,reserved:0};
  }
  return {version:3,revision:0,createdAt:now(),products,suppliers:DEFAULT_SHOPS,units,accessories,
    purchaseOrders:[],inventoryMovements:[],orders:[],shipments:[],returns:[],customers:[],payments:[],cart:[],session:null,
    processedRequests:[],audit:[{date:now(),text:'Inventario inicial de demostración cargado; no corresponde a existencias reales.'}]};
}
export function migrateDB(raw, legacyCart, legacyOrder) {
  if(raw?.version===3 && Array.isArray(raw.products)) {
    const base=seedDB();
    const merged={...base,...raw};
    for(const key of ['products','suppliers','units','purchaseOrders','inventoryMovements','orders','shipments','returns','customers','payments','cart','processedRequests','audit']) if(!Array.isArray(merged[key])) merged[key]=[];
    merged.accessories=raw.accessories && typeof raw.accessories==='object' ? raw.accessories : base.accessories;
    merged.products=merged.products.map(p=>{
      const seeded=base.products.find(x=>String(x.id)===String(p.id));
      return seeded&&p.image===p.fallback?{...p,image:seeded.image,imageDetail:seeded.imageDetail}:p;
    });
    return merged;
  }
  const db=seedDB();
  if(Array.isArray(legacyCart)) db.cart=legacyCart.filter(x=>db.products.some(p=>p.id===x.id)&&Number.isInteger(x.quantity)&&x.quantity>0).map(x=>({id:x.id,quantity:Math.min(x.quantity,20)}));
  if(legacyOrder?.number && Array.isArray(legacyOrder.items)) db.audit.push({date:now(),text:`Comprobante antiguo ${legacyOrder.number} encontrado. No se importa como venta: no hay datos ni reservas verificables.`});
  return db;
}
export const getProduct = (db,productId) => db.products.find(p=>String(p.id)===String(productId));
export function stock(db,productId){
  const p=getProduct(db,productId); if(!p) return {physical:0,reserved:0,available:0};
  if(p.kind===MOTOR){const u=db.units.filter(x=>x.productId===p.id);const physical=u.filter(x=>['available','reserved'].includes(x.status)).length;const reserved=u.filter(x=>x.status==='reserved').length;return {physical,reserved,available:physical-reserved};}
  const s=db.accessories[p.id]||{physical:0,reserved:0};return {physical:s.physical,reserved:s.reserved,available:s.physical-s.reserved};
}
export const sellable = (db,p) => !!p?.active && stock(db,p.id).available>0;
function move(db,p,kind,qty,reason,ref,fn){
  const before=stock(db,p.id);fn();const after=stock(db,p.id);
  if(Object.values(after).some(v=>v<0)||after.reserved>after.physical)fail('Operación inválida: inventario inconsistente.');
  db.inventoryMovements.unshift({id:id('MOV'),date:now(),productId:p.id,type:kind,quantity:qty,before,after,reason,ref});
}
const freshVIN = (db,p) => {let value;do {value=`SIM-${p.sku.replace(/[^A-Z0-9]/g,'')}-${Math.random().toString(36).slice(2,10).toUpperCase()}`;} while(db.units.some(u=>u.vin===value));return value;};
function addStock(db,p,qty,reason,ref){move(db,p,'entrada',qty,reason,ref,()=>{
  if(p.kind===MOTOR){for(let i=0;i<qty;i++)db.units.push({id:id('VIN'),productId:p.id,vin:freshVIN(db,p),status:'available',purchaseOrderId:ref,orderId:null});}
  else{db.accessories[p.id]||={physical:0,reserved:0};db.accessories[p.id].physical+=qty;}
});}
function reserve(db,p,qty,orderId){const s=stock(db,p.id);if(!p.active||s.available<qty)fail(`Existencia insuficiente de ${p.name}: ${s.available} disponibles.`);
 let vins=[];move(db,p,'reserva',qty,'Pago de demostración aprobado',orderId,()=>{
  if(p.kind===MOTOR){const selected=db.units.filter(x=>x.productId===p.id&&x.status==='available').slice(0,qty);vins=selected.map(x=>x.vin);selected.forEach(x=>{x.status='reserved';x.orderId=orderId;});}
  else db.accessories[p.id].reserved+=qty;
 });return vins;
}
function release(db,p,qty,orderId){move(db,p,'liberación',qty,'Cancelación de pedido',orderId,()=>{
 if(p.kind===MOTOR){const selected=db.units.filter(x=>x.productId===p.id&&x.status==='reserved'&&x.orderId===orderId);if(selected.length!==qty)fail('No se encontraron todas las unidades reservadas.');selected.forEach(x=>{x.status='available';x.orderId=null;});}
 else{if(db.accessories[p.id].reserved<qty)fail('Reserva inconsistente.');db.accessories[p.id].reserved-=qty;}
 });}
function dispatch(db,p,qty,orderId){move(db,p,'salida',qty,'Despacho físico confirmado',orderId,()=>{
 if(p.kind===MOTOR){const selected=db.units.filter(x=>x.productId===p.id&&x.status==='reserved'&&x.orderId===orderId);if(selected.length!==qty)fail('VIN reservados insuficientes.');selected.forEach(x=>x.status='shipped');}
 else{const s=db.accessories[p.id];if(!s||s.reserved<qty||s.physical<qty)fail('Reservas inconsistentes.');s.reserved-=qty;s.physical-=qty;}
 });}
function receiveReturn(db,p,qty,orderId){move(db,p,'devolución',qty,'Inspección de devolución aprobada',orderId,()=>{
 if(p.kind===MOTOR){const u=db.units.filter(x=>x.productId===p.id&&['shipped','sold'].includes(x.status)&&x.orderId===orderId);if(u.length!==qty)fail('VIN de devolución no encontrados.');u.forEach(x=>{x.status='available';x.orderId=null;});}
 else {db.accessories[p.id]||={physical:0,reserved:0};db.accessories[p.id].physical+=qty;}
 });}
export function shippingOptions(db,items,state='Puebla'){
 const motor=items.some(i=>getProduct(db,i.id)?.kind===MOTOR);
 const acc=items.some(i=>getProduct(db,i.id)?.kind==='accesorio');
 const region=state==='Puebla'?0:['Ciudad de México','Estado de México'].includes(state)?1:2;
 const options=[{code:'pickup',label:'Recolección en sucursal (Puebla)',cost:0,days:2}];
 if(motor) options.push({code:'especializado',label:acc?'Transporte de motocicleta + accesorios por separado':'Transporte especializado de motocicletas',cost:[1950,2600,3900][region]+(acc?[180,250,350][region]:0),days:[6,8,12][region]});
 else {
  options.push({code:'estandar',label:'Envío estándar de accesorios',cost:[180,250,350][region],days:[4,6,9][region]});
  options.push({code:'expres',label:'Envío exprés de accesorios',cost:[290,420,600][region],days:[2,3,5][region]});
 }
 return options;
}
export function totals(db,items,shippingCode,state){
 const lines=items.map(i=>{const p=getProduct(db,i.id);if(!p)fail('Producto del carrito no encontrado.');return {...i,product:p,amount:money(p.price*i.quantity)};});
 const merchandise=money(lines.reduce((n,x)=>n+x.amount,0));
 const option=shippingOptions(db,items,state).find(x=>x.code===shippingCode)||fail('Selecciona un método de entrega válido.');
 const shipping=option.cost;const total=money(merchandise+shipping);const {subtotal,iva}=breakdown(total);
 return {lines,merchandise,shipping,subtotal,iva,total,option};
}
const transitions={pendiente:['confirmada','cancelada'],confirmada:['en_transito','recibida_parcial','recibida','cancelada'],en_transito:['recibida_parcial','recibida'],recibida_parcial:['recibida_parcial','recibida'],recibida:[],cancelada:[]};
function updateOrderStatus(o,status,reason=''){if(o.status!==status){o.status=status;appendEvent(o,`${labelStatus(status)}${reason?' — '+reason:''}`);}}
export const labelStatus=s=>({pago_pendiente:'Pago pendiente',pago_confirmado:'Pago confirmado',en_preparacion:'En preparación',listo_envio:'Listo para envío',enviado:'Enviado',en_reparto:'En reparto',entregado:'Entregado',cancelado:'Cancelado',devuelto:'Devuelto',pendiente:'Pendiente',confirmada:'Confirmada',en_transito:'En tránsito',recibida_parcial:'Recibida parcialmente',recibida:'Recibida',cancelada:'Cancelada',solicitada:'Solicitada',aprobada:'Aprobada',rechazada:'Rechazada',reembolsada:'Reembolsada',despachado:'Despachado',fallida:'Entrega fallida',reprogramada:'Reprogramada',disponible_retiro:'Disponible para recoger',en_revision:'En revisión',available:'Disponible en almacén',reserved:'Reservada',shipped:'Despachada',sold:'Entregada / vendida',retired:'Baja de inventario',entrada:'Entrada',salida:'Salida',ajuste:'Ajuste',reserva:'Reserva'})[s]||s;
function customerFor(db,data,sessionId){const linked=db.customers.find(c=>c.id===sessionId||c.email.toLowerCase()===data.email.toLowerCase());return linked?.id||null;}
function makeShipments(db,o,method,days){const group=(kind,items)=>({id:id('ENV'),orderId:o.id,kind,items:items.map(x=>({id:x.id,quantity:x.quantity})),method:method==='pickup'?'pickup':kind==='motocicleta'?'especializado':(method==='especializado'?'estandar':method),status:'pendiente',carrier:'',tracking:'',estimatedAt:new Date(Date.now()+days*86400000).toISOString(),events:[{id:id('EVT'),date:now(),text:'Orden de entrega creada'}],incidents:[]});
 const moto=o.items.filter(x=>getProduct(db,x.id)?.kind===MOTOR),acc=o.items.filter(x=>getProduct(db,x.id)?.kind==='accesorio');
 if(moto.length)db.shipments.unshift(group('motocicleta',moto));if(acc.length)db.shipments.unshift(group('accesorio',acc));}
function ensureOrderHasNoDispatch(db,o){if(db.shipments.filter(s=>s.orderId===o.id).some(s=>!['pendiente','disponible_retiro'].includes(s.status)))fail('El pedido ya salió; se requiere una devolución, no una cancelación.');}
function syncOrder(db,o){const all=db.shipments.filter(s=>s.orderId===o.id);if(!all.length||['cancelado','devuelto'].includes(o.status))return;
 const statuses=all.map(s=>s.status);if(statuses.every(s=>s==='entregado'))updateOrderStatus(o,'entregado');
 else if(statuses.some(s=>s==='en_reparto'||s==='fallida'||s==='reprogramada'))updateOrderStatus(o,'en_reparto');
 else if(statuses.some(s=>s==='despachado'))updateOrderStatus(o,'enviado');
 else if(statuses.every(s=>s==='disponible_retiro'))updateOrderStatus(o,'listo_envio');
}
export function mutateDB(input,action){
 const db=clone(input);const a=action||{};
 switch(a.type){
  case 'cart/add': {const p=getProduct(db,a.productId);if(!p||!p.active)fail('Producto no disponible.');const qty=positive(a.quantity||1);const line=db.cart.find(x=>x.id===p.id);const newQty=(line?.quantity||0)+qty;if(newQty>stock(db,p.id).available)fail(`Sólo hay ${stock(db,p.id).available} unidades disponibles.`);if(line)line.quantity=newQty;else db.cart.push({id:p.id,quantity:newQty});break;}
  case 'cart/set':{const qty=nonnegative(a.quantity);const p=getProduct(db,a.productId);if(!p)fail('Producto no encontrado.');if(qty>stock(db,p.id).available)fail(`Sólo hay ${stock(db,p.id).available} unidades disponibles.`);db.cart=db.cart.filter(x=>x.id!==p.id);if(qty>0)db.cart.push({id:p.id,quantity:qty});break;}
  case 'cart/clear':db.cart=[];break;
  case 'product/upsert': {
   const data=a.product||{};const same=db.products.find(p=>String(p.id)===String(data.id));
   const p={...(same||{}),...data};p.name=required(p.name,'nombre');p.sku=required(p.sku,'SKU').toUpperCase();p.imageDetail=p.image||p.imageDetail;p.brand=required(p.brand,'marca');p.model=required(p.model,'modelo');p.category=required(p.category,'categoría');p.kind=p.kind===MOTOR?MOTOR:'accesorio';p.price=money(p.price);p.acquisitionCost=money(p.acquisitionCost);if(p.price<=0||p.acquisitionCost<0)fail('Precio y costo inválidos.');p.stockMin=nonnegative(p.stockMin);p.deliveryDays=positive(p.deliveryDays||7);p.supplierId=required(p.supplierId,'proveedor');if(!db.suppliers.some(s=>s.id===p.supplierId&&s.active))fail('Proveedor inactivo o no encontrado.');
   if(db.products.some(x=>x.sku===p.sku&&x.id!==p.id))fail('El SKU ya existe.');if(db.products.some(x=>x.slug===p.slug&&x.id!==p.id))fail('La URL del producto ya está en uso.');
   if(!same){p.id=Math.max(200,...db.products.map(x=>Number(x.id)||0))+1;p.slug=`producto-${p.id}`;p.active=true;p.image=p.image||'/images/accessory.svg';p.fallback=p.fallback||'/images/accessory.svg';p.imageDetail=p.image;p.imageVerified=!!p.imageVerified;p.specs=p.specs||{};db.products.push(p);if(p.kind!=='motocicleta')db.accessories[p.id]={physical:0,reserved:0};}
   else {if(p.kind!==same.kind&&stock(db,p.id).physical)fail('No se puede cambiar el tipo con inventario existente.');Object.assign(same,p);}
   break;}
  case 'product/toggle':{const p=find(db.products,a.id,'Producto');p.active=!p.active;break;}
  case 'supplier/upsert':{const v=a.supplier||{};const existing=db.suppliers.find(x=>x.id===v.id);const obj={...(existing||{}),...v};obj.name=required(obj.name,'nombre comercial');obj.contact=required(obj.contact,'contacto');obj.email=required(obj.email,'correo');obj.phone=required(obj.phone,'teléfono');obj.address=required(obj.address,'dirección');obj.leadDays=positive(obj.leadDays||7);if(existing)Object.assign(existing,obj);else db.suppliers.push({...obj,id:id('PRV'),active:true});break;}
  case 'supplier/toggle':{const s=find(db.suppliers,a.id,'Proveedor');s.active=!s.active;break;}
  case 'inventory/adjust': {
   const p=find(db.products,a.productId,'Producto');const target=nonnegative(a.physical,'Existencia física');const before=stock(db,p.id);if(target<before.reserved)fail('No se pueden retirar unidades reservadas.');const delta=target-before.physical;if(!delta)fail('No hay cambio de existencias.');
   move(db,p,'ajuste',Math.abs(delta),required(a.reason,'motivo'),a.reference||'AJUSTE',()=>{
    if(p.kind===MOTOR){if(delta>0){for(let i=0;i<delta;i++)db.units.push({id:id('VIN'),productId:p.id,vin:freshVIN(db,p),status:'available',purchaseOrderId:'AJUSTE',orderId:null});}
      else{const free=db.units.filter(x=>x.productId===p.id&&x.status==='available');if(free.length<Math.abs(delta))fail('No hay unidades físicas libres suficientes.');free.slice(0,-delta).forEach(x=>x.status='retired');}}
    else {db.accessories[p.id]||={physical:0,reserved:0};db.accessories[p.id].physical=target;}
   });break;}
  case 'purchase/create': {
   const supplier=find(db.suppliers,a.supplierId,'Proveedor');if(!supplier.active)fail('El proveedor está inactivo.');if(!a.lines?.length)fail('La orden de compra necesita productos.');
   const seen=new Set();const lines=a.lines.map(x=>{if(seen.has(String(x.productId)))fail('No repitas un producto en la misma orden de compra.');seen.add(String(x.productId));const p=find(db.products,x.productId,'Producto');if(p.supplierId!==supplier.id)fail(`${p.name} no está asociado a ${supplier.name}.`);const q=positive(x.quantity);const cost=money(x.unitCost);if(!(cost>=0))fail('Costo incorrecto.');return {productId:p.id,quantity:q,received:0,unitCost:cost};});
   const po={id:id('OC'),supplierId:supplier.id,lines,date:now(),expectedAt:new Date(Date.now()+supplier.leadDays*86400000).toISOString(),status:'pendiente',total:money(lines.reduce((s,x)=>s+x.quantity*x.unitCost,0)),events:[]};appendEvent(po,'Orden de compra creada');db.purchaseOrders.unshift(po);break;}
  case 'purchase/status':{const po=find(db.purchaseOrders,a.id,'Orden de compra');if(!transitions[po.status]?.includes(a.status))fail('Cambio de estado de compra no permitido.');if(a.status==='cancelada'&&po.lines.some(x=>x.received>0))fail('No se puede cancelar una compra con mercancía recibida.');if(['recibida','recibida_parcial'].includes(a.status))fail('La recepción se registra desde la acción Recibir.');po.status=a.status;appendEvent(po,labelStatus(a.status));break;}
  case 'purchase/receive': {
   const po=find(db.purchaseOrders,a.id,'Orden de compra');if(!['confirmada','en_transito','recibida_parcial'].includes(po.status))fail('Confirma la orden antes de recibir mercancía.');
   const requested=a.receipts||[];if(!requested.length)fail('Indica unidades recibidas.');let totalReceived=0;
   for(const x of requested){const line=po.lines.find(y=>String(y.productId)===String(x.productId));if(!line)fail('Producto no pertenece a la orden.');const q=positive(x.quantity);if(q>line.quantity-line.received)fail('La recepción supera las unidades pendientes.');const p=find(db.products,line.productId,'Producto');addStock(db,p,q,'Recepción de compra',po.id);line.received+=q;totalReceived+=q;}
   if(!totalReceived)fail('No hay unidades nuevas.');po.status=po.lines.every(x=>x.received===x.quantity)?'recibida':'recibida_parcial';appendEvent(po,`${labelStatus(po.status)} · ${totalReceived} unidades recibidas`);break;}
  case 'payment/rejected':db.payments.unshift({id:id('PAG'),date:now(),status:'rechazado',reason:'Tarjeta ficticia de rechazo',amount:money(a.amount)});break;
  case 'checkout/confirm':{
   if(a.requestId && db.processedRequests.some(x=>x.requestId===a.requestId))break;
   const customer=a.customer||{};const name=required(customer.name,'nombre');const email=required(customer.email,'correo').toLowerCase();if(!/^\S+@\S+\.\S+$/.test(email))fail('Correo inválido.');if(!/^\d{10}$/.test(String(customer.phone||'').replace(/\D/g,'')))fail('Teléfono de 10 dígitos obligatorio.');
   const address=a.address||{};if(a.shippingCode!=='pickup'){for(const k of ['street','colony','city','state','zip'])required(address[k],k);if(!/^\d{5}$/.test(address.zip))fail('Código postal inválido.');}
   if(!db.cart.length)fail('El carrito está vacío.');const lineItems=db.cart.map(x=>({id:x.id,quantity:positive(x.quantity)}));const {lines,merchandise,shipping,subtotal,iva,total,option}=totals(db,lineItems,a.shippingCode,address.state||'Puebla');
   for(const line of lines){if(!line.product.active||stock(db,line.id).available<line.quantity)fail(`Inventario insuficiente de ${line.product.name}.`);}
   const orderId=id('PED');const items=lines.map(x=>({id:x.id,sku:x.product.sku,name:x.product.name,kind:x.product.kind,quantity:x.quantity,unitPrice:x.product.price,amount:x.amount,vins:reserve(db,x.product,x.quantity,orderId)}));
   const order={id:orderId,date:now(),customer:{name,email,phone:String(customer.phone).replace(/\D/g,''),customerId:customerFor(db,{email},db.session)},address:{...address},shippingCode:a.shippingCode,shippingLabel:option.label,items,merchandise,shippingCost:shipping,subtotal,iva,total,paymentStatus:'aprobado_demo',paymentMethod:'Tarjeta ficticia •••• 4242',status:'pago_confirmado',events:[],demo:true};appendEvent(order,'Pago de demostración confirmado y existencias reservadas');db.orders.unshift(order);
   db.payments.unshift({id:id('PAG'),date:now(),orderId,status:'aprobado_demo',amount:total,method:'prueba 4242',requestId:a.requestId});
   makeShipments(db,order,a.shippingCode,option.days);db.cart=[];if(a.requestId)db.processedRequests.push({requestId:a.requestId,orderId,date:now()});break;}
  case 'order/prepare':{const o=find(db.orders,a.id,'Pedido');if(o.status!=='pago_confirmado')fail('Sólo se preparan pedidos con pago confirmado.');updateOrderStatus(o,'en_preparacion');break;}
  case 'order/ready':{const o=find(db.orders,a.id,'Pedido');if(o.status!=='en_preparacion')fail('Primero debe prepararse el pedido.');updateOrderStatus(o,'listo_envio');break;}
  case 'shipment/assign':{const s=find(db.shipments,a.id,'Envío');if(s.status!=='pendiente')fail('Asigna transporte antes del despacho.');s.carrier=s.method==='pickup'?'Sucursal MotoClick (simulada)':required(a.carrier,'transportista');s.tracking=s.tracking||`GUIA-${s.id.slice(-8)}`;appendEvent(s,`Transportista asignado: ${s.carrier}`);break;}
  case 'shipment/transition': {
   const s=find(db.shipments,a.id,'Envío');const o=find(db.orders,s.orderId,'Pedido');const target=a.status;
   if(s.method==='pickup'){
     if(s.status==='pendiente'&&target==='disponible_retiro'){if(o.status!=='listo_envio')fail('El pedido debe estar listo para entrega.');s.carrier='Sucursal MotoClick (simulada)';s.tracking=s.tracking||`RETIRO-${s.id.slice(-8)}`;s.status=target;appendEvent(s,'Pedido listo para recoger');syncOrder(db,o);break;}
     if(s.status==='disponible_retiro'&&target==='entregado'){
       // Retiro equivale a salida física; no se había registrado una salida antes.
       for(const x of s.items)dispatch(db,find(db.products,x.id,'Producto'),x.quantity,o.id);
       s.items.forEach(line=>db.units.filter(u=>u.orderId===o.id&&u.productId===line.id&&u.status==='shipped').forEach(u=>u.status='sold'));s.status='entregado';appendEvent(s,'Retiro en sucursal confirmado');syncOrder(db,o);break;}
     fail('Cambio de estado de retiro no permitido.');
   }
   const allowed={pendiente:['despachado'],despachado:['en_reparto'],en_reparto:['entregado','fallida'],fallida:['reprogramada'],reprogramada:['en_reparto']};
   if(!allowed[s.status]?.includes(target))fail('Transición logística no permitida.');
   if(target==='despachado'){
     if(o.status!=='listo_envio'&&o.status!=='enviado')fail('El pedido debe estar preparado antes de despacharlo.');
     if(!s.carrier)fail('Asigna primero un transportista.');
     for(const x of s.items)dispatch(db,find(db.products,x.id,'Producto'),x.quantity,o.id);
   }
   if(target==='reprogramada'){const newDate=required(a.estimatedAt,'nueva fecha');if(!/^\d{4}-\d{2}-\d{2}$/.test(newDate)||Number.isNaN(Date.parse(newDate))||newDate<new Date().toISOString().slice(0,10))fail('Selecciona una fecha válida, hoy o futura.');s.estimatedAt=newDate;}
   if(target==='fallida'){s.incidents.push({id:id('INC'),date:now(),reason:required(a.reason,'incidencia')});}
   if(target==='entregado')s.items.forEach(line=>db.units.filter(u=>u.orderId===o.id&&u.productId===line.id&&u.status==='shipped').forEach(u=>u.status='sold'));s.status=target;appendEvent(s,`${labelStatus(target)}${a.reason?' — '+a.reason:''}`);syncOrder(db,o);break;}
  case 'return/request': {
   const o=find(db.orders,a.orderId,'Pedido');const type=a.kind==='cancelacion'?'cancelacion':'devolucion';
   if(db.returns.some(r=>r.orderId===o.id&&!['rechazada','reembolsada'].includes(r.status)))fail('Ya existe una solicitud abierta para este pedido.');
   if(type==='cancelacion'){ensureOrderHasNoDispatch(db,o);if(!['pago_confirmado','en_preparacion','listo_envio'].includes(o.status))fail('Este pedido ya no admite cancelación.');}
   else if(o.status!=='entregado')fail('Sólo se puede solicitar devolución de un pedido entregado.');
   db.returns.unshift({id:id('POS'),orderId:o.id,type,reason:required(a.reason,'motivo'),status:'solicitada',date:now(),events:[{id:id('EVT'),date:now(),text:'Solicitud registrada'}],refundId:null});break;}
  case 'return/review':{const r=find(db.returns,a.id,'Solicitud');if(r.status!=='solicitada')fail('Solicitud ya revisada.');if(!['aprobada','rechazada'].includes(a.status))fail('Decisión inválida.');const o=find(db.orders,r.orderId,'Pedido');if(r.type==='cancelacion'&&a.status==='aprobada'){
     ensureOrderHasNoDispatch(db,o);for(const x of o.items)release(db,find(db.products,x.id,'Producto'),x.quantity,o.id);updateOrderStatus(o,'cancelado','Reserva liberada');db.shipments.filter(s=>s.orderId===o.id).forEach(s=>{s.status='cancelado';appendEvent(s,'Cancelado antes de salida');});
   }
   r.status=a.status;appendEvent(r,`Solicitud ${labelStatus(a.status).toLowerCase()}`);break;}
  case 'return/receive':{const r=find(db.returns,a.id,'Solicitud');if(r.type!=='devolucion'||r.status!=='aprobada')fail('Devolución no aprobada.');const o=find(db.orders,r.orderId,'Pedido');for(const x of o.items)receiveReturn(db,find(db.products,x.id,'Producto'),x.quantity,o.id);r.status='recibida';updateOrderStatus(o,'devuelto','Recepción e inspección confirmadas');appendEvent(r,'Mercancía recibida, inspeccionada y reincorporada');break;}
  case 'return/refund':{const r=find(db.returns,a.id,'Solicitud');if(r.refundId||r.status!==(r.type==='cancelacion'?'aprobada':'recibida'))fail('Reembolso ya efectuado o no autorizado.');const o=find(db.orders,r.orderId,'Pedido');const payment={id:id('REEM'),orderId:o.id,date:now(),status:'reembolso_demo',amount:o.total,reason:r.type};db.payments.unshift(payment);r.refundId=payment.id;r.status='reembolsada';appendEvent(r,'Reembolso simulado registrado');break;}
  case 'customer/register': {const c=a.customer||{};const email=required(c.email,'correo').toLowerCase();if(db.customers.some(x=>x.email===email))fail('Ya existe una cuenta con ese correo.');const user={id:id('CLI'),name:required(c.name,'nombre'),email,phone:required(c.phone,'teléfono'),passwordHash:required(c.passwordHash,'contraseña'),salt:required(c.salt,'salt'),addresses:[],date:now()};db.customers.push(user);db.session=user.id;break;}
  case 'customer/login':{const user=find(db.customers,a.customerId,'Cliente');db.session=user.id;break;}
  case 'customer/logout':db.session=null;break;
  case 'customer/profile':{if(!db.session)fail('Inicia sesión.');const user=find(db.customers,db.session,'Cliente');user.name=required(a.name,'nombre');user.phone=required(a.phone,'teléfono');break;}
  case 'customer/address':{if(!db.session)fail('Inicia sesión.');const user=find(db.customers,db.session,'Cliente');const v=a.address||{};const address={id:id('DIR'),street:required(v.street,'calle'),colony:required(v.colony,'colonia'),city:required(v.city,'municipio'),state:required(v.state,'estado'),zip:required(v.zip,'código postal')};user.addresses.push(address);break;}
  case 'customer/address/remove':{const user=find(db.customers,db.session,'Cliente');user.addresses=user.addresses.filter(x=>x.id!==a.id);break;}
  default:fail('Operación desconocida.');
 }
 db.revision=(db.revision||0)+1;
 return db;
}
