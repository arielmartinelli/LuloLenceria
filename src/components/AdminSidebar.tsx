'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Warehouse,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Pedidos', href: '/admin/pedidos', icon: ShoppingBag },
    { label: 'Productos', href: '/admin/productos', icon: Package },
    { label: 'Stock / Inventario', href: '/admin/stock', icon: Warehouse },
    { label: 'Clientes', href: '/admin/clientes', icon: Users },
    { label: 'Categorías', href: '/admin/categorias', icon: Layers },
    { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
  ];

  return (
    <>
      {/* MOBILE TOPBAR HEADER FOR ADMIN */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#EFE8E3] px-4 py-3 flex items-center justify-between shadow-soft">
        <Link href="/admin" className="flex flex-col">
          <span className="font-serif text-lg font-bold text-[#7A1C30]">LULO LENCERÍA</span>
          <span className="text-[9px] text-[#C5A059] uppercase font-bold tracking-wider -mt-1">
            Panel Propietario
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl text-[#7A1C30] bg-[#FAF7F5] border border-[#EFE8E3]"
          aria-label="Menú Admin"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-xs bg-white h-full flex flex-col justify-between p-5 shadow-2xl animate-slideRight">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EFE8E3] mb-4">
                <span className="font-serif text-lg font-bold text-[#7A1C30]">Menú Admin</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-[#7A1C30] text-white shadow-soft'
                          : 'text-[#2D151B] hover:bg-[#FAF7F5]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7A1C30]'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#EFE8E3] space-y-2">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#5A4A4E] bg-[#FAF7F5] border border-[#EFE8E3]"
              >
                <ExternalLink className="w-4 h-4 text-[#C5A059]" /> Ver Tienda
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#EFE8E3] flex-col justify-between h-screen sticky top-0 shrink-0 shadow-soft">
        <div>
          <div className="p-6 border-b border-[#EFE8E3]">
            <Link href="/admin" className="block">
              <span className="font-serif text-xl font-bold tracking-wider text-[#7A1C30]">
                LULO LENCERÍA
              </span>
              <span className="block text-[10px] tracking-widest text-[#C5A059] uppercase font-semibold mt-0.5">
                Panel del Propietario
              </span>
            </Link>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 ${
                    isActive
                      ? 'bg-[#7A1C30] text-white shadow-soft font-bold'
                      : 'text-[#5A4A4E] hover:text-[#7A1C30] hover:bg-[#FAF7F5]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7A1C30]'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#EFE8E3] space-y-2 bg-[#FAF7F5]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5A4A4E] hover:text-[#7A1C30] hover:bg-white transition border border-[#EFE8E3]"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#C5A059]" />
              Ver Tienda Online
            </span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
