'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye } from 'lucide-react';

interface Variant {
  id: string;
  size?: string | null;
  color?: string | null;
  model?: string | null;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  description: string;
  is18Plus?: boolean;
  isOffer?: boolean;
  isFeatured?: boolean;
  category?: { name: string; slug: string };
  images: { url: string }[];
  variants: Variant[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const mainImage = product.images?.[0]?.url || '/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg';
  const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
  const isOutOfStock = totalStock <= 0;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const availableVariant = product.variants?.find((v) => v.stock > 0) || product.variants?.[0];
    if (!availableVariant) return;

    addItem({
      productId: product.id,
      variantId: availableVariant.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: mainImage,
      size: availableVariant.size,
      color: availableVariant.color,
      model: availableVariant.model,
      maxStock: availableVariant.stock,
      quantity: 1,
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#EFE8E3] hover:border-[#7A1C30]/40 transition-all duration-300 hover:shadow-luxury flex flex-col h-full">
      {/* Image & Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF7F5]">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white bg-[#7A1C30] rounded-full shadow-soft">
              -{discountPercent}%
            </span>
          )}
          {product.is18Plus && (
            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#7A1C30] bg-[#F3E3E5] border border-[#7A1C30]/20 rounded-full">
              +18
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 sm:gap-3 p-2 sm:p-4">
          <Link
            href={`/product/${product.slug}`}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#2D151B] flex items-center justify-center hover:bg-[#7A1C30] hover:text-white transition shadow-soft transform hover:scale-110"
            title="Ver detalles"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#7A1C30] text-white flex items-center justify-center hover:bg-[#94233B] transition shadow-soft transform hover:scale-110"
              title="Agregar al carrito"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#C5A059] uppercase block truncate">
            {product.category?.name || 'Lulo Lencería'}
          </span>
          <Link href={`/product/${product.slug}`} className="block mt-0.5">
            <h3 className="font-serif text-xs sm:text-base font-bold text-[#2D151B] group-hover:text-[#7A1C30] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-[#EFE8E3] flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
            <span className="text-xs sm:text-base font-bold text-[#7A1C30]">
              ${product.price.toLocaleString('es-AR')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                ${product.originalPrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="text-[10px] sm:text-xs font-semibold text-[#7A1C30] hover:underline shrink-0"
          >
            Ver →
          </Link>
        </div>
      </div>
    </div>
  );
}
