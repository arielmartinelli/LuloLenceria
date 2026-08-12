'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import { Lock, KeyRound } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setErrorMsg('Contraseña incorrecta. (Prueba: lulo1234)');
    } else {
      setErrorMsg('');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl border border-[#EFE8E3] shadow-luxury text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#F3E3E5] text-[#7A1C30] border border-[#7A1C30]/20 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-[#7A1C30]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              Panel del Propietario
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#2D151B] mt-1">Acceso Administrativo</h1>
            <p className="text-xs text-[#6E5C62] mt-2">
              Ingresá la contraseña para gestionar pedidos, productos e inventario.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Contraseña (ej: lulo1234)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs pl-11 pr-4 py-3.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold tracking-wider text-xs uppercase text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition"
            >
              INGRESAR AL PANEL
            </button>
          </form>

          <p className="text-[11px] text-[#6E5C62]">
            Contraseña por defecto demo: <code className="text-[#7A1C30] font-bold">lulo1234</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col lg:flex-row text-[#2D151B]">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
