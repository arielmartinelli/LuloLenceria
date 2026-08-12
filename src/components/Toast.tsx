'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3 py-3 px-5 rounded-2xl bg-white border border-[#7A1C30]/30 shadow-luxury text-[#2D151B] text-xs font-bold animate-bounceIn">
      <CheckCircle2 className="w-5 h-5 text-[#7A1C30]" />
      <span>{toastMessage}</span>
    </div>
  );
}
