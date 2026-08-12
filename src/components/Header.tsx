'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#EFE8E3] shadow-soft transition-all">
      {/* Top Banner Announcement */}
      <div className="bg-[#7A1C30] text-white text-[10px] sm:text-xs py-1 px-4 text-center tracking-widest uppercase font-semibold">
        ENVIOS A TODO EL PAIS — VENTA PERSONALIZADA VIA WHATSAPP
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Left: Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-[#7A1C30] hover:bg-[#F3E3E5] transition"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center/Left: Brand Logo (Typography Only) */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-block">
              <span className="font-serif text-sm sm:text-2xl font-bold tracking-wider text-[#7A1C30] block leading-tight">
                LULO LENCERÍA
              </span>
              <span className="hidden sm:block text-[9px] tracking-widest text-[#C5A059] uppercase font-bold -mt-0.5">
                SENTITE CÓMODA. SENTITE VOS.
              </span>
            </Link>
          </div>

          {/* Center Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-xs uppercase tracking-wider font-semibold text-[#2D151B] hover:text-[#7A1C30] transition"
            >
              Inicio
            </Link>
            <Link
              href="/catalog"
              className="text-xs uppercase tracking-wider font-semibold text-[#2D151B] hover:text-[#7A1C30] transition"
            >
              Catálogo
            </Link>
            <Link
              href="/catalog?category=bikinis"
              className="text-xs uppercase tracking-wider font-semibold text-[#2D151B] hover:text-[#7A1C30] transition"
            >
              Bikinis
            </Link>
            <Link
              href="/catalog?category=lenceria"
              className="text-xs uppercase tracking-wider font-semibold text-[#2D151B] hover:text-[#7A1C30] transition"
            >
              Lencería
            </Link>
            <Link
              href="/catalog?category=indumentaria-deportiva"
              className="text-xs uppercase tracking-wider font-semibold text-[#2D151B] hover:text-[#7A1C30] transition"
            >
              Deportivo
            </Link>
            <Link
              href="/catalog?category=mas-18"
              className="text-xs uppercase tracking-wider font-bold text-[#7A1C30] hover:text-[#94233B] transition px-2 py-0.5 rounded bg-[#F3E3E5] border border-[#7A1C30]/20"
            >
              +18
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Search Toggle / Input */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-white rounded-full border border-[#EFE8E3] px-3 py-1 shadow-soft"
                >
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-28 sm:w-48 text-xs bg-transparent text-[#2D151B] focus:outline-none"
                  />
                  <button type="submit" className="p-1 text-[#7A1C30]">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-gray-400 hover:text-black ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-1.5 sm:p-2 rounded-full text-[#7A1C30] hover:bg-[#F3E3E5] transition"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-full text-[#7A1C30] hover:bg-[#F3E3E5] transition"
              aria-label="Carrito"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#7A1C30] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-soft">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EFE8E3] px-4 py-4 space-y-3 shadow-luxury animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <input
              type="text"
              placeholder="Buscar por bikini, encaje..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs pl-9 pr-3 py-2.5 rounded-full border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </form>

          <nav className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#2D151B] hover:text-[#7A1C30] border-b border-[#FAF7F5]"
            >
              Inicio
            </Link>
            <Link
              href="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#2D151B] hover:text-[#7A1C30] border-b border-[#FAF7F5]"
            >
              Ver Todo el Catálogo
            </Link>
            <Link
              href="/catalog?category=bikinis"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#2D151B] hover:text-[#7A1C30] border-b border-[#FAF7F5]"
            >
              Bikinis
            </Link>
            <Link
              href="/catalog?category=lenceria"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#2D151B] hover:text-[#7A1C30] border-b border-[#FAF7F5]"
            >
              Lencería
            </Link>
            <Link
              href="/catalog?category=indumentaria-deportiva"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#2D151B] hover:text-[#7A1C30] border-b border-[#FAF7F5]"
            >
              Indumentaria Deportiva
            </Link>
            <Link
              href="/catalog?category=mas-18"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#7A1C30] font-bold bg-[#F3E3E5] rounded-xl border border-[#7A1C30]/20 flex items-center justify-between"
            >
              <span>LÍNEA +18 EXCLUSIVA</span>
              <span className="text-[10px] bg-[#7A1C30] text-white px-2 py-0.5 rounded-full">HOT</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
