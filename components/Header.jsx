'use client';
import Link from 'next/link';
import { useEffect,useRef,useState } from 'react';
import { usePathname,useRouter } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, UserRound, PackageSearch, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/CartContext';
export default function Header() {
  const {count,setOpen}=useCart();
  const [searchOpen,setSearchOpen]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [search,setSearch]=useState('');
  const router=useRouter(); const path=usePathname(); const input=useRef(null);
  useEffect(()=>{setMobileOpen(false);setSearchOpen(false)},[path]);
  useEffect(()=>{if(searchOpen)input.current?.focus()},[searchOpen]);
  useEffect(()=>{document.body.classList.toggle('menu-active',mobileOpen);return()=>document.body.classList.remove('menu-active')},[mobileOpen]);
  const submit=e=>{e.preventDefault();router.push(`/catalogo?buscar=${encodeURIComponent(search.trim())}`);setSearchOpen(false);};
  return <>
    <div className="announcement"><span>EST. EN PUEBLA / MX</span><span>UNA NUEVA FORMA DE MOVERTE</span><span>EDICIÓN 001 — 2026</span></div>
    <header className="site-header" id="inicio">
      <div className="header-left"><button aria-label={mobileOpen?'Cerrar menú':'Abrir menú'} className="icon-button mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X size={21}/>:<Menu size={21}/>}</button><nav className="desktop-nav" aria-label="Navegación principal"><Link href="/catalogo">MOTOCICLETAS</Link><Link href="/nosotros">NOSOTROS</Link><Link href="/seguimiento">SEGUIMIENTO</Link></nav></div>
      <Link className="logo" href="/" aria-label="MotoClick, ir al inicio">MOTO<span>CLICK</span><sup>®</sup></Link>
      <div className="header-right"><Link className="header-action header-account" href="/cuenta" aria-label="Mi cuenta"><UserRound size={19} strokeWidth={1.7}/><span>CUENTA</span></Link><button className="header-action" aria-label="Buscar motocicletas" onClick={()=>setSearchOpen(!searchOpen)}><Search size={20} strokeWidth={1.7}/><span>BUSCAR</span></button><button className="header-action cart-trigger" aria-label={`Abrir carrito, ${count} artículos`} onClick={()=>setOpen(true)}><ShoppingBag size={20} strokeWidth={1.7}/><span>CARRITO</span><span className="cart-bubble">{count}</span></button></div>
    </header>
    {searchOpen && <div className="search-panel"><form onSubmit={submit}><Search size={24}/><input ref={input} value={search} onChange={e=>setSearch(e.target.value)} placeholder="¿QUÉ MOTOCICLETA BUSCAS?" aria-label="Buscar motocicletas"/><button type="submit" className="search-submit" aria-label="Buscar"><ArrowRight/></button><button type="button" className="icon-button" onClick={()=>setSearchOpen(false)} aria-label="Cerrar búsqueda"><X/></button></form></div>}
    {mobileOpen && <div className="mobile-panel"><span className="eyebrow">NAVEGACIÓN / 01</span><Link onClick={()=>setMobileOpen(false)} href="/catalogo">MOTOCICLETAS <ArrowUpRight/></Link><Link onClick={()=>setMobileOpen(false)} href="/nosotros">NOSOTROS <ArrowUpRight/></Link><Link onClick={()=>setMobileOpen(false)} href="/cuenta">MI CUENTA <ArrowUpRight/></Link><Link onClick={()=>setMobileOpen(false)} href="/seguimiento">SEGUIMIENTO <ArrowUpRight/></Link><Link onClick={()=>setMobileOpen(false)} href="/ayuda">AYUDA <ArrowUpRight/></Link><span className="mobile-panel-tail">MOTOCLICK / SIN VUELTAS, SOLO RUTA.</span></div>}
  </>;
}
