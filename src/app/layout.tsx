import type { Metadata } from 'next';
import './globals.css';
import { AgeGateProvider } from '@/context/AgeGateContext';
import { CartProvider } from '@/context/CartContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import AgeGateModal from '@/components/AgeGateModal';
import CartDrawer from '@/components/CartDrawer';
import Toast from '@/components/Toast';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Lulo Lencería | Sentite cómoda. Sentite vos.',
  description:
    'Tienda online de lencería femenina, bikinis de diseño, indumentaria deportiva y artículos eróticos +18 con envíos a todo el país y atención personalizada vía WhatsApp.',
  metadataBase: new URL('https://lulo-lenceria.vercel.app'),
  icons: {
    icon: '/icono.png',
    shortcut: '/icono.png',
    apple: '/icono.png',
  },
  openGraph: {
    title: 'Lulo Lencería | Sentite cómoda. Sentite vos.',
    description:
      'Tienda online de lencería femenina, bikinis de diseño, indumentaria deportiva y artículos eróticos +18. Pedidos directos por WhatsApp.',
    url: 'https://lulo-lenceria.vercel.app',
    siteName: 'Lulo Lencería',
    images: [
      {
        url: 'https://lulo-lenceria.vercel.app/metaimg.png',
        width: 1200,
        height: 1200,
        alt: 'Lulo Lencería',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lulo Lencería | Sentite cómoda. Sentite vos.',
    description:
      'Tienda online de lencería femenina, bikinis de diseño, indumentaria deportiva y artículos eróticos +18.',
    images: ['https://lulo-lenceria.vercel.app/metaimg.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#FAF7F5] text-[#2D151B] min-h-screen flex flex-col font-sans selection:bg-[#7A1C30] selection:text-white">
        <AgeGateProvider>
          <CartProvider>
            <AdminAuthProvider>
              <AgeGateModal />
              <CartDrawer />
              <Toast />
              <FloatingWhatsApp />
              {children}
            </AdminAuthProvider>
          </CartProvider>
        </AgeGateProvider>
      </body>
    </html>
  );
}
