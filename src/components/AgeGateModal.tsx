'use client';

import React from 'react';
import { useAgeGate } from '@/context/AgeGateContext';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function AgeGateModal() {
  const { isVerified, verifyAge, leaveSite } = useAgeGate();

  if (isVerified) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white border border-[#EFE8E3] shadow-luxury text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F3E3E5] text-[#7A1C30] border border-[#7A1C30]/20 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-[#7A1C30]" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
            Ingreso Restringido por Edad
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2D151B] mt-1">
            AVISO +18
          </h2>
        </div>

        <div className="space-y-3 text-xs text-[#5A4A4E] leading-relaxed bg-[#FAF7F5] p-5 rounded-2xl border border-[#EFE8E3]">
          <p className="font-medium text-[#2D151B]">
            Este sitio contiene productos destinados exclusivamente a mayores de 18 años.
          </p>
          <p>
            Al ingresar confirmás que sos mayor de 18 años y aceptás nuestros términos y condiciones.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={verifyAge}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition-all duration-300"
          >
            <CheckCircle2 className="w-4 h-4" />
            SOY MAYOR DE 18
          </button>

          <button
            onClick={leaveSite}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-xs text-[#6E5C62] bg-[#FAF7F5] hover:bg-[#EFE8E3] border border-[#EFE8E3] transition duration-300"
          >
            <XCircle className="w-4 h-4" />
            SALIR
          </button>
        </div>
      </div>
    </div>
  );
}
