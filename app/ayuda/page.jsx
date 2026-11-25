import Link from 'next/link';
export const metadata={title:'Ayuda y preguntas frecuentes'};
const faqs=[
 ['¿Cómo encuentro una motocicleta?','Explora el catálogo por categoría y abre la ficha de cada modelo para revisar sus características, precio y disponibilidad.'],
 ['¿Cómo agrego un producto al carrito?','En la ficha del producto, selecciona la cantidad disponible y pulsa “Agregar al carrito”. Puedes revisar o ajustar las cantidades antes de continuar al checkout.'],
 ['¿Qué formas de pago puedo usar?','El checkout permite probar el flujo con tarjetas de prueba: 4242 4242 4242 4242 para aprobar o 4000 0000 0000 0002 para rechazar. Usa vencimiento futuro y CVC 123; no ingreses datos bancarios reales. No se realizan cargos.','pagos'],
 ['¿Cómo se calcula el costo de envío?','Las opciones y tarifas se estiman según el destino y el tipo de producto. Las fechas son referenciales; esta versión no coordina entregas físicas.','entregas'],
 ['¿Dónde consulto el estado de mi pedido?','Ve a “Seguimiento de pedidos” e ingresa el número de pedido y el correo usado al finalizar. También puedes revisar tus pedidos desde “Mi cuenta”. Los registros se guardan en este navegador.'],
 ['¿Puedo cancelar o devolver un pedido?','Puedes consultar las condiciones y etapas en “Envíos, garantías y devoluciones”. Las solicitudes y reembolsos que se registren aquí son informativos: no generan una devolución ni transferencia de dinero.'],
 ['¿Mis datos se sincronizan entre dispositivos?','No. La cuenta, el carrito y los pedidos se almacenan localmente en el navegador y no se sincronizan entre dispositivos. Evita ingresar información sensible o reutilizar contraseñas.'],
];
export default function Ayuda(){return <><section className="info-hero"><span className="eyebrow">MOTOCLICK / SOPORTE</span><h1>LAS COSAS<br/><em>CLARAS.</em></h1><p>Respuestas sobre catálogo, pedidos y entregas.</p></section><section className="faq-section">{faqs.map(([q,a,id],i)=><details key={q} id={id}><summary><span>{String(i+1).padStart(2,'0')}</span>{q}<b>+</b></summary><p>{a}</p></details>)}<div className="faq-return"><span>¿LISTO PARA EXPLORAR?</span><Link href="/catalogo" className="button button-dark">IR AL CATÁLOGO ↗</Link></div></section></>}
