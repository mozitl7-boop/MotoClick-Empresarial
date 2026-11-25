'use client';
import { X } from 'lucide-react';
import { useEffect } from 'react';
export default function PrivacyModal({open,onClose}) {
  useEffect(()=>{
    if(!open) return;
    const key = e => { if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown',key);
    return ()=>window.removeEventListener('keydown',key);
  },[open,onClose]);
  if(!open) return null;
  return <div className="modal-layer" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section className="privacy-panel" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <div className="modal-top"><span className="eyebrow">DOCUMENTACIÓN / 01</span><button className="icon-button" aria-label="Cerrar aviso de privacidad" onClick={onClose}><X size={21}/></button></div>
      <h2 id="privacy-title" className="section-title">AVISO DE<br/>PRIVACIDAD.</h2>
      <div className="legal-copy">
        <p><strong>Responsable del ejercicio.</strong> MotoClick es una demostración académica localizada en Puebla, México. No es una tienda operativa ni cuenta con un responsable mercantil registrado en esta simulación. Este texto es un modelo educativo que debe sustituirse antes de una operación comercial real.</p>
        <p><strong>Datos recabados.</strong> La aplicación puede solicitar nombre, correo electrónico, teléfono, dirección, cuentas de demostración, información de pedidos, seguimiento y solicitudes posventa. Las contraseñas de cuenta se guardan en forma de resumen criptográfico; esto no equivale a autenticación segura.</p>
        <p><strong>Finalidades.</strong> Simular compras, asignar mercancía, administrar entregas, mostrar historial y gestionar solicitudes de atención. No se realizan promociones, campañas ni transferencias a terceros desde esta aplicación.</p>
        <p><strong>Almacenamiento.</strong> Estos datos se guardan en localStorage del mismo navegador. El panel administrativo y la tienda comparten ese almacenamiento local; no existe base de datos central ni sincronización entre equipos. Quien tenga acceso al dispositivo o a las herramientas del navegador podría consultar o modificar los registros.</p>
        <p><strong>Datos de pago.</strong> Sólo se aceptan números de tarjeta ficticios predefinidos. No introduzcas ni se almacena el número completo de tarjetas bancarias reales o el CVC.</p>
        <p><strong>Conservación y eliminación.</strong> Los registros permanecen hasta que se borre el almacenamiento local del navegador. La eliminación puede realizarse desde las herramientas de privacidad del navegador; no se dispone de un servidor que reciba solicitudes.</p>
        <p><strong>Derechos ARCO y contacto.</strong> En una operación real se necesitará informar identidad y domicilio del responsable, correo de contacto, finalidades, mecanismos para acceso, rectificación, cancelación y oposición, y posibles transferencias, conforme a la normativa mexicana aplicable. Este proyecto no cuenta con un canal oficial para tales solicitudes.</p>
      </div>
      <button className="button button-dark full" onClick={onClose}>ENTENDIDO / CERRAR <span>↗</span></button>
    </section>
  </div>;
}
