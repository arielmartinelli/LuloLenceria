'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  MessageCircle,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';

interface Variant {
  id: string;
  size?: string | null;
  color?: string | null;
  model?: string | null;
  sku: string;
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
  sku: string;
  category?: { name: string; slug: string };
  images: { id: string; url: string }[];
  variants: Variant[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Selected Variant state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (!res.ok) throw new Error('Product not found');
        const data: Product = await res.json();
        setProduct(data);

        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        }

        const firstInStock = data.variants.find((v) => v.stock > 0) || data.variants[0];
        if (firstInStock) {
          if (firstInStock.size) setSelectedSize(firstInStock.size);
          if (firstInStock.color) setSelectedColor(firstInStock.color);
        }

        if (data.category) {
          const relRes = await fetch(`/api/products?category=${data.category.slug}`);
          const relData: Product[] = await relRes.json();
          setRelatedProducts(relData.filter((p) => p.id !== data.id).slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-[#7A1C30] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6E5C62] text-xs font-semibold">Cargando producto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between">
        <Header />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <h2 className="font-serif text-3xl font-bold text-[#2D151B]">Producto no encontrado</h2>
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 rounded-full bg-[#7A1C30] text-white text-xs font-bold"
          >
            VOLVER AL CATÁLOGO
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean))
  ) as string[];
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter(Boolean))
  ) as string[];

  const activeVariant = product.variants.find((v) => {
    const sizeMatch = !selectedSize || v.size === selectedSize;
    const colorMatch = !selectedColor || v.color === selectedColor;
    return sizeMatch && colorMatch;
  });

  const currentStock = activeVariant ? activeVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (!activeVariant || isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: selectedImage || product.images[0]?.url || '',
      size: activeVariant.size,
      color: activeVariant.color,
      model: activeVariant.model,
      maxStock: activeVariant.stock,
      quantity,
    });
  };

  const handleBuyWhatsAppDirect = () => {
    if (!activeVariant) return;
    const itemText = `- ${product.name} (${activeVariant.color || ''} ${activeVariant.size || ''}) x${quantity} - $${(product.price * quantity).toLocaleString('es-AR')}`;
    const text = encodeURIComponent(
      `Hola Lulo Lencería 💕 Quiero realizar el pedido directo de este producto:\n\n${itemText}\n\nTotal: $${(product.price * quantity).toLocaleString('es-AR')}\n\n¿Tienen disponibilidad? ¡Gracias!`
    );
    window.open(`https://wa.me/5491112345678?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#6E5C62] mb-8 font-medium">
          <Link href="/" className="hover:text-[#7A1C30]">
            Inicio
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/catalog" className="hover:text-[#7A1C30]">
            Catálogo
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-[#7A1C30]">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#7A1C30] font-bold truncate">{product.name}</span>
        </div>

        {/* 18+ Disclaimer Banner */}
        {product.is18Plus && (
          <div className="mb-8 p-4 rounded-2xl bg-[#F3E3E5] border border-[#E8D2D5] flex items-center gap-3 text-xs text-[#7A1C30]">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold uppercase">Producto Exclusivo +18:</span>{' '}
              Este artículo está destinado a mayores de 18 años. Su despacho se realiza en embalaje totalmente discreto.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white border border-[#EFE8E3] shadow-soft">
              <Image
                src={selectedImage || product.images[0]?.url || ''}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
              />

              {discountPercent && (
                <span className="absolute top-4 left-4 px-3.5 py-1 text-xs font-bold text-white bg-[#7A1C30] rounded-full shadow-soft z-10">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                      selectedImage === img.url
                        ? 'border-[#7A1C30] shadow-soft'
                        : 'border-[#EFE8E3] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                SKU: {activeVariant?.sku || product.sku}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D151B] mt-1">
                {product.name}
              </h1>
              <p className="text-xs text-[#6E5C62] mt-1 font-semibold">Categoría: {product.category?.name}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-white border border-[#EFE8E3] shadow-soft">
              <span className="font-serif text-3xl font-bold text-[#7A1C30]">
                ${product.price.toLocaleString('es-AR')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toLocaleString('es-AR')}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="text-xs text-[#5A4A4E] leading-relaxed border-t border-b border-[#EFE8E3] py-4">
              {product.description}
            </div>

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2D151B] uppercase tracking-wider block">
                  Seleccionar Talle:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition ${
                        selectedSize === sz
                          ? 'border-[#7A1C30] bg-[#7A1C30] text-white'
                          : 'border-[#EFE8E3] text-[#2D151B] bg-white hover:border-gray-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2D151B] uppercase tracking-wider block">
                  Seleccionar Color:
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition ${
                        selectedColor === col
                          ? 'border-[#7A1C30] bg-[#7A1C30] text-white'
                          : 'border-[#EFE8E3] text-[#2D151B] bg-white hover:border-gray-300'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Stock */}
            <div className="flex items-center gap-2 text-xs">
              {!isOutOfStock ? (
                <span className="text-emerald-600 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> En stock ({currentStock} unidades disponibles)
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4" /> Sin stock para esta combinación
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold text-[#2D151B] uppercase">Cantidad:</span>
                <div className="flex items-center border border-[#D8C8CA] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-gray-500 hover:text-black hover:bg-gray-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-2 text-sm text-[#2D151B] font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="p-2.5 text-gray-500 hover:text-black hover:bg-gray-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold tracking-wider text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition-all duration-300 text-xs uppercase disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                AGREGAR AL CARRITO
              </button>

              <button
                onClick={handleBuyWhatsAppDirect}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold tracking-wider text-[#25D366] bg-white border border-[#25D366]/40 hover:bg-emerald-50 transition duration-300 text-xs uppercase disabled:opacity-40"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                COMPRAR DIRECTO POR WHATSAPP
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EFE8E3] space-y-2 text-xs text-[#6E5C62]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A059]" />
                <span>Envíos a todo el país con código de seguimiento.</span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#EFE8E3] pt-16">
            <h3 className="font-serif text-2xl font-bold text-[#2D151B] mb-8">
              Productos Relacionados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
