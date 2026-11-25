'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Instagram, Facebook, Youtube, ArrowUpRight } from 'lucide-react';
import PrivacyModal from '@/components/PrivacyModal';
export default function Footer() {
  const [privacy,setPrivacy]=useState(false);
  return <>
    <footer className="footer" id="contacto">
      <div className="footer-head"><span>UNA NUEVA FORMA DE ENCONTRAR TU MOTO.</span><Link href="/catalogo" className="footer-discover">EXPLORAR EL CATÁLOGO <ArrowUpRight size={18}/></Link></div>
      <div className="footer-wordmark">MOTO<span>CLICK</span><sup>®</sup></div>
      <div className="footer-grid">
        <div className="footer-address"><span className="footer-label">MOTOCLICK / MÉXICO</span><p>Motocicletas para todos los días.<br/>Puebla, México.</p></div>
        <div className="footer-links"><span className="footer-label">EXPLORA</span><Link href="/catalogo">Motocicletas</Link><Link href="/nosotros">Nosotros</Link><Link href="/ayuda">Preguntas frecuentes</Link><Link href="/seguimiento">Seguimiento de pedidos</Link><Link href="/cuenta">Mi cuenta</Link></div>
        <div className="footer-links"><span className="footer-label">INFORMACIÓN</span><button type="button" onClick={()=>setPrivacy(true)}>Aviso de privacidad</button><Link href="/ayuda#entregas">Información de entrega</Link><Link href="/admin">Panel administrativo</Link><Link href="/ayuda#pagos">Información de pago</Link><Link href="/politicas">Envíos, garantías y devoluciones</Link><Link href="/politicas#terminos">Términos y condiciones</Link></div>
        <div className="footer-links"><span className="footer-label">REDES / PLATAFORMAS*</span><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram <Instagram size={15}/></a><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook <Facebook size={15}/></a><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube <Youtube size={15}/></a></div>
      </div>
      <p className="footer-social-note">*Enlaces a las plataformas generales. Este proyecto no tiene perfiles oficiales configurados.</p>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} MOTOCLICK</span><span>DESCUBRE TU PRÓXIMA RUTA</span><a href="#inicio">VOLVER ARRIBA ↑</a></div>
    </footer>
    <PrivacyModal open={privacy} onClose={()=>setPrivacy(false)}/>
  </>;
}
