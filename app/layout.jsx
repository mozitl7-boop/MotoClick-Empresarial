import './globals.css';
import SiteShell from '@/components/SiteShell';
export const metadata = {
  title: {default:'MotoClick — La calle es tuya',template:'%s | MotoClick'},
  description:'MotoClick, una nueva forma de descubrir motocicletas, comparar estilos y encontrar tu próxima ruta.',
  robots:{index:false,follow:false},
};
export default function RootLayout({children}) { return <html lang="es"><body><SiteShell>{children}</SiteShell></body></html>; }
