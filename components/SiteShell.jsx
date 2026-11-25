'use client';
import {CommerceProvider} from '@/components/CommerceContext';
import {CartProvider} from '@/components/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
export default function SiteShell({children}){
 return <CommerceProvider><CartProvider><Header/><main>{children}</main><Footer/><CartDrawer/></CartProvider></CommerceProvider>;
}
