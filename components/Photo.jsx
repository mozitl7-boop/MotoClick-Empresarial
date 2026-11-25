'use client';
import { useState } from 'react';
export default function Photo({src,fallback,alt,className='',priority=false}) {
  const [broken, setBroken] = useState(false);
  return <img className={className} src={broken ? fallback : src} onError={() => setBroken(true)} alt={alt} loading={priority?'eager':'lazy'} decoding="async" />;
}
