import Link from 'next/link';
export const metadata={title:'Ayuda y preguntas frecuentes'};
const faqs=[
 ['¿Puedo realizar una compra real?','No. Este sitio es un prototipo académico. El proceso de compra genera un comprobante de demostración y no crea una transacción bancaria ni una orden comercial real.'],
 ['¿Los precios del catálogo son oficiales?','No. Los importes son de referencia para probar el funcionamiento de la tienda y no constituyen una cotización u oferta vigente.'],
 ['¿Las fotografías muestran exactamente cada modelo?','Las fichas utilizan ilustraciones de referencia identificadas expresamente, no fotografías atribuidas a un modelo incorrecto. El administrador puede incorporar imágenes autorizadas del modelo exacto.'],
 ['¿Qué datos puedo usar para el pago simulado?','Usa 4242 4242 4242 4242 para un pago aprobado o 4000 0000 0000 0002 para uno rechazado; vencimiento futuro y CVC ficticio 123. No introduzcas datos bancarios reales.'],
 ['¿Dónde se almacena el carrito?','El carrito, inventario, proveedores, cuentas, pedidos y envíos se conservan en localStorage del navegador. No existe sincronización entre dispositivos.'],
 ['¿Cómo funcionaría la entrega?','El sistema genera órdenes de envío y guías simuladas, actualizadas por el administrador. Las motocicletas usan transporte especializado; no se realizan entregas físicas.'],
];
export default function Ayuda(){return <><section className="info-hero"><span className="eyebrow">MOTOCLICK / SOPORTE</span><h1>LAS COSAS<br/><em>CLARAS.</em></h1><p>Respuestas rápidas sobre esta versión de demostración.</p></section><section className="faq-section">{faqs.map(([q,a],i)=><details key={q} id={i===3?'pagos':i===5?'entregas':undefined}><summary><span>{String(i+1).padStart(2,'0')}</span>{q}<b>+</b></summary><p>{a}</p></details>)}<div className="faq-return"><span>¿LISTO PARA EXPLORAR?</span><Link href="/catalogo" className="button button-dark">IR AL CATÁLOGO ↗</Link></div></section></>}
