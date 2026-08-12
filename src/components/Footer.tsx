import React from 'react';
import Link from 'next/link';
import { Instagram, MessageCircle, MapPin, Clock, Phone, UserCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EFE8E3] pt-16 pb-12 text-[#5A4A4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#7A1C30]">
                LULO LENCERÍA
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-medium -mt-1">
                Sentite cómoda. Sentite vos.
              </span>
            </Link>
            <p className="text-xs text-[#6E5C62] leading-relaxed">
              Marca de lencería femenina, bikinis de diseño, indumentaria deportiva y artículos eróticos para potenciar tu sensualidad con elegancia y confort.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 shadow-soft transition-all"
                aria-label="WhatsApp"
                title="WhatsApp Directo"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </a>
              <a
                href="https://instagram.com/lulolenceria"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#F3E3E5] text-[#7A1C30] flex items-center justify-center hover:bg-[#7A1C30] hover:text-white transition-all"
                aria-label="Instagram"
                title="Instagram @lulolenceria"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="font-serif text-base font-bold text-[#2D151B] mb-4 tracking-wide border-b border-[#EFE8E3] pb-2">
              Categorías
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/catalog?category=bikinis" className="hover:text-[#7A1C30] transition">
                  Bikinis & Trajes de Baño
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=lenceria" className="hover:text-[#7A1C30] transition">
                  Lencería & Bodies
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=indumentaria-deportiva" className="hover:text-[#7A1C30] transition">
                  Indumentaria Deportiva
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=mas-18" className="hover:text-[#7A1C30] transition font-bold text-[#7A1C30]">
                  Línea +18 / Eróticos
                </Link>
              </li>
              <li>
                <Link href="/catalog?offer=true" className="hover:text-[#7A1C30] transition">
                  Ofertas Especiales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-base font-bold text-[#2D151B] mb-4 tracking-wide border-b border-[#EFE8E3] pb-2">
              Contacto & Atención
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Av. Santa Fe 1842, CABA, Argentina</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Lun a Sáb: 10:00 a 20:00 hs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>+54 9 11 1234-5678</span>
              </li>
            </ul>
          </div>

          {/* Privacy & Discretion box */}
          <div className="bg-[#FAF7F5] p-5 rounded-2xl border border-[#EFE8E3] space-y-3">
            <h4 className="font-semibold text-xs text-[#2D151B]">Envíos Discretos</h4>
            <p className="text-[11px] text-[#6E5C62] leading-relaxed">
              Todos los paquetes de artículos +18 se despachan en embalaje totalmente neutro e insonoro sin referencias de producto.
            </p>
          </div>
        </div>

        {/* Footer Bottom Bar with Admin Panel link */}
        <div className="border-t border-[#EFE8E3] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6E5C62] gap-4">
          <p>© {new Date().getFullYear()} Lulo Lencería. Todos los derechos reservados.</p>

          {/* Admin link located at the bottom of the footer */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] hover:bg-[#F3E3E5] border border-[#EFE8E3] text-[#7A1C30] font-semibold text-[11px] transition"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Panel de Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
