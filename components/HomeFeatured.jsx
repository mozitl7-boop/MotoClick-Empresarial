'use client';
import ProductCard from '@/components/ProductCard';
import {useCommerce} from '@/components/CommerceContext';
export default function HomeFeatured(){const {db}=useCommerce();const selection=(db?.products||[]).filter(p=>p.active&&p.kind==='motocicleta');return <div className="featured-grid">{[selection[0],selection[5],selection[10],selection[17]].filter(Boolean).map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>}
