'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Hide floating WhatsApp button on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <a
      href="https://wa.me/5491112345678?text=Hola%20Lulo%20Lencer%C3%ADa%20%F0%9F%92%95%20Quiero%20hacer%20una%20consulta."
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-[990] flex items-center gap-2 py-3 px-4 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm shadow-float hover:scale-105 transition-all duration-300 group"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0" />
      <span className="hidden sm:inline-block pr-1 font-semibold">¿Consultas? Escribinos</span>
    </a>
  );
}
