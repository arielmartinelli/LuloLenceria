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
