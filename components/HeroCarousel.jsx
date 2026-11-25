'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,ArrowUpRight,Pause,Play} from 'lucide-react';
import {products} from '@/lib/products';

const slideContent={
 'royal-enfield-himalayan-450':{headline:['HIMALAYAN','450'],category:'AVENTURA'},
 'ktm-rc-390':{headline:['KTM RC','390'],category:'DEPORTIVAS'},
 'voge-300-rally':{headline:['VOGE 300','RALLY'],category:'AVENTURA'},
};
const slides=Object.entries(slideContent).map(([slug,content])=>{
 const product=products.find(item=>item.slug===slug);
 return product?{...product,...content}:null;
}).filter(Boolean);

export default function HeroCarousel(){
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 const slide=slides[active];
 const move=step=>setActive(index=>(index+step+slides.length)%slides.length);

 useEffect(()=>{
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{if(motion.matches)setPaused(true)};
  update();
  motion.addEventListener?.('change',update);
  return ()=>motion.removeEventListener?.('change',update);
 },[]);
 useEffect(()=>{
  if(paused||slides.length<2)return;
  const timer=window.setInterval(()=>move(1),6500);
  return ()=>window.clearInterval(timer);
 },[paused]);

 return <section className="hero hero-carousel" aria-label="Motocicletas destacadas">
  <div className="hero-media" aria-hidden="true">{slides.map((item,index)=>{
   const background=`linear-gradient(90deg,rgba(12,12,12,.76) 0%,rgba(12,12,12,.3) 53%,rgba(12,12,12,.08) 100%),url("${item.image}")`;
   return <div key={item.id} className={`hero-image${index===active?' is-active':''}`} style={{backgroundImage:background,'--hero-background':background}}/>;
  })}</div>
  <div className="hero-grain"></div>
  <div className="hero-controls" aria-label="Controles del carrusel">
   <button className="hero-control" type="button" aria-label="Motocicleta anterior" onClick={()=>move(-1)}><ArrowLeft size={19}/></button>
   <button className="hero-control" type="button" aria-label="Siguiente motocicleta" onClick={()=>move(1)}><ArrowRight size={19}/></button>
   <button className="hero-control hero-control-toggle" type="button" aria-label={paused?'Reanudar carrusel':'Pausar carrusel'} onClick={()=>setPaused(value=>!value)}>
    {paused?<Play size={15}/>:<Pause size={15}/>}<span>{paused?'REPRODUCIR':'PAUSAR'}</span>
   </button>
  </div>
  <div className="hero-content" key={slide.id}>
   <span className="hero-kicker">MOTOCLICK® <i/> {slide.category} / COLECCIÓN 2026</span>
   <h1>{slide.headline[0]}<br/><em>{slide.headline[1]}.</em></h1>
   <p>{slide.description}</p>
   <Link href={`/producto?sku=${encodeURIComponent(slide.sku)}`} className="button button-light">DESCUBRIR MOTOCICLETA <ArrowUpRight size={20}/></Link>
  </div>
  <div className="hero-bottom">
   <span>{String(active+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')} — MODELOS DESTACADOS</span>
   <div className="hero-dots" role="group" aria-label="Elegir motocicleta destacada">{slides.map((item,index)=>
    <button key={item.id} type="button" className={index===active?'active':''} aria-label={`Mostrar ${item.name}`} aria-pressed={index===active} onClick={()=>setActive(index)}/>
   )}</div>
   <span>EXPLORA LA COLECCIÓN ↓</span>
  </div>
 </section>;
}
