// Catálogo de DEMOSTRACIÓN. Marcas/modelos reales como referencias; precios y disponibilidad FICTICIOS.
export const CATEGORIES = ['Todas', 'Urbanas', 'Deportivas', 'Aventura', 'Scooters'];
const photos = [
  '/images/yamaha fzs fi.JPG',
  '/images/hondacb190r.JPG',
  '/images/bajajpulsarn160.JPG',
  '/images/susuki%20gixxer%20150.JPG',
  '/images/italika250z.JPG',
  '/images/yamaha r15.JPG',
  '/images/kawasaki ninja400.JPG',
  '/images/KTM%20RC%20390.jpg',
  '/images/CFMOTO450SR.JPG',
  '/images/hondacbr500r.JPG',
  '/images/BMWG310GS.JPG',
  '/images/royalenfield-himalayan450.jpg',
  '/images/KTM%20390%20adventure.JPG',
  '/images/Voge-300-Rally-negro.jpg',
  '/images/susuki%20vstrom%20250.JPG',
  '/images/italikaws150.JPG',
  '/images/honda%20dio110.JPG',
  '/images/yamaha%20nmax%20155.JPG',
  '/images/vespa%20150.jpg',
  '/images/susuki%20burgman.JPG',
];
const data = [
  ['yamaha-fz-s-fi','Yamaha FZ-S FI','Urbanas',46999,149,'Ligera, directa y lista para el ritmo diario.','Negro / Azul'],
  ['honda-cb190r','Honda CB190R','Urbanas',55990,184,'Una naked de líneas definidas para la ciudad.','Rojo / Negro'],
  ['bajaj-pulsar-n160','Bajaj Pulsar N160','Urbanas',48999,165,'Agilidad urbana con carácter deportivo.','Gris grafito'],
  ['suzuki-gixxer-150','Suzuki Gixxer 150','Urbanas',51990,155,'Funcionalidad y diseño en formato compacto.','Azul oscuro'],
  ['italika-250z','Italika 250Z','Urbanas',36999,250,'Una silueta de presencia firme para el día a día.','Negro mate'],
  ['yamaha-r15-v4','Yamaha R15 V4','Deportivas',93999,155,'Geometría inspirada en circuito y estilo afilado.','Azul racing'],
  ['kawasaki-ninja-400','Kawasaki Ninja 400','Deportivas',159990,399,'Diseño carenado de personalidad deportiva.','Verde / Negro'],
  ['ktm-rc-390','KTM RC 390','Deportivas',134900,373,'Líneas agresivas para un perfil de pista.','Naranja / Negro'],
  ['cfmoto-450sr','CFMOTO 450SR','Deportivas',139900,449,'Carácter dinámico en una carrocería contundente.','Blanco / Negro'],
  ['honda-cbr500r','Honda CBR500R','Deportivas',189900,471,'Equilibrio entre estilo deportivo y versatilidad.','Rojo'],
  ['bmw-g-310-gs','BMW G 310 GS','Aventura',129900,313,'Una postura elevada para ampliar los horizontes.','Negro / Rojo'],
  ['royal-enfield-himalayan-450','Royal Enfield Himalayan 450','Aventura',149900,452,'Concebida para rutas largas y nuevos caminos.','Gris pizarra'],
  ['ktm-390-adventure','KTM 390 Adventure','Aventura',159900,373,'Espíritu explorador en formato compacto.','Naranja'],
  ['voge-300-rally','Voge 300 Rally','Aventura',99900,292,'Estética off-road y posición de manejo elevada.','Blanco / Rojo'],
  ['suzuki-v-strom-250sx','Suzuki V-Strom 250SX','Aventura',119900,249,'Carácter viajero para carretera y ciudad.','Amarillo'],
  ['italika-ws150','Italika WS150','Scooters',25999,150,'Una propuesta sencilla para la movilidad urbana.','Negro'],
  ['honda-dio-110','Honda Dio 110','Scooters',36990,110,'Proporciones compactas y conducción práctica.','Azul'],
  ['yamaha-nmax-155','Yamaha NMAX 155','Scooters',88999,155,'Comodidad y líneas contemporáneas para la ciudad.','Gris'],
  ['vespa-primavera-150','Vespa Primavera 150','Scooters',129900,150,'Estética clásica y personalidad inconfundible.','Verde oliva'],
  ['suzuki-burgman-street','Suzuki Burgman Street','Scooters',59990,125,'Un estilo funcional de vocación urbana.','Blanco'],
];
export const products = data.map((v, i) => ({
  id: i + 1,
  slug: v[0], name: v[1], category: v[2], price: v[3], cc: v[4],
  description: v[5], color: v[6],
  sku: `MC-${String(i+1).padStart(3,'0')}`,
  image: photos[i],
  imageDetail: photos[i],
  fallback: `/images/moto-${String(i+1).padStart(2,'0')}.svg`,
  new: [0,5,10,15].includes(i),
}));
export function findProduct(slug) { return products.find(p => p.slug === slug); }
export function byId(id) { return products.find(p => p.id === Number(id)); }
export const formatMoney = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:2}).format(n || 0);
export function breakdown(total) {
  const base = Math.round((total/1.16)*100)/100;
  return { subtotal: base, iva: Math.round((total-base)*100)/100, total };
}
