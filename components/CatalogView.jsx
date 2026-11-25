'use client';
import {useEffect,useMemo,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Search,SlidersHorizontal,X} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import {useCommerce} from '@/components/CommerceContext';
import {stock} from '@/lib/commerce';
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export default function CatalogView(){
 const {db}=useCommerce();const params=useSearchParams();
 const [category,setCategory]=useState('Todas'),[brand,setBrand]=useState('Todas'),[query,setQuery]=useState(''),[sort,setSort]=useState('destacados'),[maxPrice,setMaxPrice]=useState(''),[onlyAvailable,setOnlyAvailable]=useState(false);
 useEffect(()=>{setCategory(params.get('categoria')||'Todas');setQuery(params.get('buscar')||'')},[params]);
 const products=db?.products.filter(p=>p.active)||[];
 const cats=['Todas',...new Set(products.map(p=>p.category))],brands=['Todas',...new Set(products.map(p=>p.brand))].sort();
 const filtered=useMemo(()=>{if(!db)return [];const items=products.filter(p=>(category==='Todas'||p.category===category)&&(brand==='Todas'||p.brand===brand)&&(!maxPrice||p.price<=Number(maxPrice))&&(!onlyAvailable||stock(db,p.id).available>0)&&normalize(p.name+' '+p.brand+' '+p.model+' '+p.category+' '+p.sku).includes(normalize(query)));if(sort==='precio-asc')items.sort((a,b)=>a.price-b.price);if(sort==='precio-desc')items.sort((a,b)=>b.price-a.price);if(sort==='nombre')items.sort((a,b)=>a.name.localeCompare(b.name));return items},[db,category,brand,maxPrice,onlyAvailable,query,sort]);
 const reset=()=>{setCategory('Todas');setBrand('Todas');setQuery('');setSort('destacados');setMaxPrice('');setOnlyAvailable(false)};
 return <><section className="catalog-hero"><span className="eyebrow">MOTOCLICK / INVENTARIO DE DEMOSTRACIÓN</span><h1>ELIGE TU<br/><em>MOTOCICLETA.</em></h1><div className="catalog-intro"><p>Explora modelos, compara precios y consulta existencias conectadas al almacén simulado.</p><span>{products.filter(p=>p.kind==='motocicleta').length} MOTOCICLETAS · MÉXICO</span></div></section>
  <section className="catalog-section"><div className="catalog-toolbar"><div className="filter-tabs">{cats.map(cat=><button key={cat} className={category===cat?'active':''} onClick={()=>setCategory(cat)} aria-pressed={category===cat}>{cat.toUpperCase()}</button>)}</div><div className="catalog-tools"><label className="catalog-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="MODELO, MARCA O SKU" aria-label="Buscar productos"/>{query&&<button onClick={()=>setQuery('')} aria-label="Limpiar"><X size={15}/></button>}</label><label className="sort-control"><SlidersHorizontal size={16}/><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Ordenar"><option value="destacados">DESTACADOS</option><option value="precio-asc">MENOR PRECIO</option><option value="precio-desc">MAYOR PRECIO</option><option value="nombre">NOMBRE A–Z</option></select></label></div></div>
  <div className="catalog-extra-filters"><label>MARCA <select value={brand} onChange={e=>setBrand(e.target.value)}>{brands.map(b=><option key={b}>{b}</option>)}</select></label><label>PRECIO MÁXIMO (MXN) <input inputMode="numeric" type="number" min="0" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Sin límite"/></label><label className="catalog-check"><input type="checkbox" checked={onlyAvailable} onChange={e=>setOnlyAvailable(e.target.checked)}/> SÓLO DISPONIBLES</label><button className="catalog-clear" onClick={reset}>LIMPIAR FILTROS</button></div>
  <div className="catalog-results"><span>{filtered.length.toString().padStart(2,'0')} RESULTADOS</span><span>PRECIOS EN MXN · IVA INCLUIDO</span></div>
  {filtered.length?<div className="catalog-grid">{filtered.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>:<div className="no-results"><h2>SIN RESULTADOS.</h2><p>Prueba otra búsqueda o restablece los filtros.</p><button className="button button-dark" onClick={reset}>MOSTRAR TODO</button></div>}
  <p className="catalog-disclaimer">Demostración académica: precios, unidades, proveedores y garantías simulados. Las fotografías del catálogo están pendientes de verificación para confirmar que correspondan exactamente al modelo y año anunciados.</p></section></>;
}
