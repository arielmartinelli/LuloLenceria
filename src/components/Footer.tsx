'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Instagram, Mail, MapPin, Heart, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EFE8E3] pt-12 pb-8 text-[#2D151B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#EFE8E3]">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl font-bold tracking-wider text-[#7A1C30] block">
                LULO LENCERÍA
              </span>
              <span className="text-[9px] tracking-widest text-[#C5A059] uppercase font-bold">
                SENTITE CÓMODA. SENTITE VOS.
              </span>
            </Link>

            <p className="text-xs text-[#6E5C62] leading-relaxed">
              Diseño, confort y sensualidad en cada prenda. Bikinis, lencería femenina, indumentaria deportiva y artículos eróticos.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/lulolenceria"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#FAF7F5] border border-[#EFE8E3] text-[#7A1C30] flex items-center justify-center hover:bg-[#7A1C30] hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5491112345678?text=Hola%20Lulo%20Lencer%C3%ADa%20💕"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#FAF7F5] border border-[#EFE8E3] text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#7A1C30] uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#7A1C30] transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-[#7A1C30] transition">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/catalog?offer=true" className="hover:text-[#7A1C30] transition">
                  Ofertas Especiales
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=mas-18" className="hover:text-[#7A1C30] transition font-bold text-[#7A1C30]">
                  Línea Exclusiva +18
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#7A1C30] uppercase tracking-wider">
              Categorías
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/catalog?category=bikinis" className="hover:text-[#7A1C30] transition">
                  Bikinis de Diseño
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
                <Link href="/catalog?category=mas-18" className="hover:text-[#7A1C30] transition">
                  Juguetes & Eróticos +18
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#7A1C30] uppercase tracking-wider">
              Atención al Cliente
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6E5C62]">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 fill-current" />
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline font-bold text-[#2D151B]"
                >
                  +54 9 11 1234-5678 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Envíos discretos a todo el país</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#7A1C30] shrink-0" />
                <span>Venta reservada a +18 años</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Admin Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E5C62]">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Lulo Lencería. Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-[#7A1C30] fill-current inline" />
            <span>para vos.</span>
          </div>

          {/* Discreet Admin Footer Link */}
          <div>
            <Link
              href="/admin"
              className="text-[11px] text-gray-400 hover:text-[#7A1C30] transition font-medium underline"
            >
              Panel de Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
