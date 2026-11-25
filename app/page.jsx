import Link from 'next/link';
import { ArrowUpRight, MoveUpRight } from 'lucide-react';
import HomeFeatured from '@/components/HomeFeatured';
import HeroCarousel from '@/components/HeroCarousel';
export default function HomePage() {
 
 return <>
  <HeroCarousel/>
  <div className="edition-strip"><span>MOTOCLICK / MÉXICO</span><span>NO SIGAS LA RUTA. ENCUENTRA LA TUYA.</span><span>EST. 2026</span></div>
  <section className="section-space" id="seleccion">
    <div className="section-heading"><div><span className="eyebrow">01 / CURADURÍA MOTOCLICK</span><h2 className="section-title">EN EL<br/><span>RADAR.</span></h2></div><div className="section-heading-right"><p>Una selección para quienes saben que el camino empieza antes de encender el motor.</p><Link className="text-link" href="/catalogo">VER TODO EL CATÁLOGO <ArrowUpRight size={17}/></Link></div></div>
    <HomeFeatured/>
  </section>
  <section className="manifesto-banner"><span>LA CIUDAD NO ESPERA.</span><div>MUÉVETE<br/><em>A TU MANERA.</em></div><span>LA RUTA ES TUYA. / MOTOCLICK</span></section>
  <section className="section-space categories-section">
    <div className="section-heading section-heading-tight"><div><span className="eyebrow">02 / ENCUENTRA TU ESTILO</span><h2 className="section-title">CADA RUTA.<br/><span>SU MOTO.</span></h2></div><p>Explora por tipo de conducción.<br/>Sin filtros innecesarios.</p></div>
    <div className="category-banners">
      <Link href="/catalogo?categoria=Deportivas" className="category-feature cat-sport"><span className="cat-no">01 — DEPORTIVAS</span><div><h3>HECHAS<br/>PARA SENTIR.</h3><span className="cat-link">VER DEPORTIVAS <ArrowUpRight size={20}/></span></div></Link>
      <Link href="/catalogo?categoria=Urbanas" className="category-feature cat-street"><span className="cat-no">02 — URBANAS</span><div><h3>LA CIUDAD<br/>TE ESPERA.</h3><span className="cat-link">VER URBANAS <ArrowUpRight size={20}/></span></div></Link>
    </div>
    <div className="category-small-row"><Link href="/catalogo?categoria=Aventura">AVENTURA <ArrowUpRight size={17}/></Link><Link href="/catalogo?categoria=Scooters">SCOOTERS <ArrowUpRight size={17}/></Link><Link href="/catalogo">TODAS LAS MOTOCICLETAS <ArrowUpRight size={17}/></Link></div>
  </section>
  <section className="story-split"><div className="story-photo"></div><div className="story-copy"><span className="eyebrow">03 / NUESTRA FORMA DE VERLO</span><h2>MENOS<br/>COMPLICACIONES.<br/><em>MÁS CAMINO.</em></h2><p>Elegir una motocicleta debería sentirse tan bien como el primer recorrido. Por eso reunimos modelos de distintos estilos en un solo lugar, con la información que importa y sin rodeos.</p><Link href="/nosotros" className="text-link">CONOCE MOTOCLICK <ArrowUpRight size={17}/></Link><span className="story-stamp">MOTOCLICK® · DESDE PUEBLA.</span></div></section>
  <section className="section-space process-section"><div className="section-heading section-heading-tight"><div><span className="eyebrow">04 / ASÍ FUNCIONA</span><h2 className="section-title">FÁCIL.<br/><span>COMO DEBE SER.</span></h2></div><p>Una experiencia de compra directa.<br/>Descubre modelos, compara opciones y sigue tu pedido.</p></div><div className="process-grid"><div><span>01 / DESCUBRE</span><h3>ELIGE TU MOTO.</h3><p>Explora las características de los modelos y encuentra el que va contigo.</p></div><div><span>02 / DECIDE</span><h3>REVISA TU PEDIDO.</h3><p>Agrega una motocicleta al carrito y consulta el desglose del importe.</p></div><div><span>03 / CONFIRMA</span><h3>FINALIZA TU PEDIDO.</h3><p>Completa los datos de entrega y revisa el resumen antes de continuar.</p></div></div></section>
  <section className="big-cta"><span>TODO EMPIEZA CON UNA DECISIÓN.</span><Link href="/catalogo"><span>ENCUENTRA<br/>TU PRÓXIMA <em>MOTO.</em></span><MoveUpRight strokeWidth={1.2}/></Link><span>MOTOCLICK / 2026</span></section>
 </>;
}
