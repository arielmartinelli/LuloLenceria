'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, isCartOpen, setIsCartOpen, clearCart } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-[#EFE8E3]">
        {/* Header */}
        <div className="p-6 border-b border-[#EFE8E3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#7A1C30]" />
            <h2 className="font-serif text-xl font-bold text-[#2D151B]">
              Tu Carrito ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F5] flex items-center justify-center mx-auto text-[#7A1C30]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-[#2D151B] font-serif text-lg font-bold">Tu carrito está vacío</p>
              <p className="text-xs text-[#6E5C62]">
                Explorá nuestras colecciones y encontrá tu conjunto perfecto.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 inline-block px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#7A1C30] hover:bg-[#94233B] transition"
              >
                VER CATÁLOGO
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center gap-4 bg-[#FAF7F5] p-3.5 rounded-2xl border border-[#EFE8E3]"
              >
                {/* Image */}
                <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-white border border-[#EFE8E3]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#2D151B] truncate">{item.name}</h4>
                  <p className="text-[11px] text-[#6E5C62] mt-0.5">
                    {item.color && <span>Color: {item.color} </span>}
                    {item.size && <span>| Talle: {item.size} </span>}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#D8C8CA] rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-1 text-xs text-[#2D151B] font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-50 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-[#7A1C30]">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.variantId)}
                  className="p-2 text-gray-400 hover:text-rose-600 transition"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#EFE8E3] bg-[#FAF7F5] space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-[#2D151B]">
              <span>Subtotal</span>
              <span className="text-xl font-serif text-[#7A1C30]">
                ${subtotal.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6E5C62]">
              <span>Vaciar carrito</span>
              <button onClick={clearCart} className="text-rose-600 hover:underline">
                Vaciar todo
              </button>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold tracking-wider text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition duration-300 text-xs uppercase"
            >
              FINALIZAR PEDIDO POR WHATSAPP
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
