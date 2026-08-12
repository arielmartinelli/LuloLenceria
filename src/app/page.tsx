import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import {
  Truck,
  MessageCircle,
  ShieldCheck,
  Heart,
  Instagram,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export const revalidate = 0; // Fresh DB queries

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { active: true, isFeatured: true },
    take: 8,
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const offerProducts = await prisma.product.findMany({
    where: { active: true, isOffer: true },
    take: 4,
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5]">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION - COMPACT ON MOBILE SO 4 ITEMS SIT HIGHER UP */}
        <section className="relative min-h-[45vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#FFF9F6] border-b border-[#EFE8E3]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/img/vikinis/3r6a0119-917a25e4dc35892f9417289315787563-1024-1024.jpg"
              alt="Lulo Lencería Hero"
              fill
              priority
              className="object-cover object-center opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F5] via-white/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-6 sm:py-16 space-y-3 sm:space-y-6">
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#F3E3E5] text-[#7A1C30] text-[9px] sm:text-xs font-bold tracking-widest uppercase border border-[#7A1C30]/20">
              Colección 2026
            </span>

            <h1 className="font-serif text-3xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#7A1C30] leading-tight">
              LULO LENCERÍA
            </h1>

            <p className="font-serif text-base sm:text-3xl font-light text-[#5A4A4E] italic tracking-wide">
              &quot;Sentite cómoda. Sentite vos.&quot;
            </p>

            <p className="max-w-2xl mx-auto text-[#6E5C62] text-[11px] sm:text-base leading-relaxed hidden sm:block">
              Descubrí nuestra selección de bikinis de diseño, lencería fina, indumentaria deportiva y artículos eróticos.
            </p>

            <div className="pt-1 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
              <Link
                href="/catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-4 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-luxury transition duration-300"
              >
                VER PRODUCTOS
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
              <Link
                href="/catalog?category=mas-18"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-4 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#7A1C30] bg-white border border-[#D8C8CA] hover:bg-[#F3E3E5] transition duration-300 shadow-soft"
              >
                LÍNEA +18
              </Link>
            </div>
          </div>
        </section>

        {/* BENEFIT STRIP - 4 ITEMS SHIFTED UP HIGHER ON MOBILE */}
        <section className="border-b border-[#EFE8E3] bg-white py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6 text-center">
              <div className="flex flex-col items-center space-y-1 p-2 bg-[#FAF7F5] sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-[#EFE8E3]">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#F3E3E5] text-[#7A1C30] flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-bold text-[10px] sm:text-xs text-[#2D151B]">Envíos a Todo el País</h4>
                <p className="text-[9px] sm:text-[11px] text-[#6E5C62]">Embalaje 100% discreto</p>
              </div>

              <div className="flex flex-col items-center space-y-1 p-2 bg-[#FAF7F5] sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-[#EFE8E3]">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#F3E3E5] text-[#7A1C30] flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-bold text-[10px] sm:text-xs text-[#2D151B]">Atención Personalizada</h4>
                <p className="text-[9px] sm:text-[11px] text-[#6E5C62]">Asesoramiento de talles</p>
              </div>

              <div className="flex flex-col items-center space-y-1 p-2 bg-[#FAF7F5] sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-[#EFE8E3]">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#F3E3E5] text-[#7A1C30] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-bold text-[10px] sm:text-xs text-[#2D151B]">Pedidos por WhatsApp</h4>
                <p className="text-[9px] sm:text-[11px] text-[#6E5C62]">Rápido y sin trámites</p>
              </div>

              <div className="flex flex-col items-center space-y-1 p-2 bg-[#FAF7F5] sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-[#EFE8E3]">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#F3E3E5] text-[#7A1C30] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-bold text-[10px] sm:text-xs text-[#2D151B]">Compra 100% Segura</h4>
                <p className="text-[9px] sm:text-[11px] text-[#6E5C62]">Confirmación directa</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES GRID (2x2 Grid directly visible on mobile) */}
        <section className="py-6 sm:py-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-14 space-y-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
              Colecciones Exclusivas
            </span>
            <h2 className="font-serif text-xl sm:text-4xl font-bold text-[#2D151B]">
              Explorá por Categoría
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#7A1C30] mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group relative h-44 sm:h-96 rounded-xl sm:rounded-3xl overflow-hidden border border-[#EFE8E3] shadow-soft transition-all duration-300 hover:shadow-luxury bg-white"
              >
                <Image
                  src={
                    cat.image ||
                    '/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg'
                  }
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/10 transition-all duration-300" />

                <div className="absolute inset-0 p-2.5 sm:p-6 flex flex-col justify-end text-left z-10 space-y-0.5 sm:space-y-2">
                  <h3 className="font-serif text-xs sm:text-2xl font-bold text-white group-hover:text-[#F3E3E5] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-200 line-clamp-2 hidden sm:block">
                    {cat.description}
                  </p>
                  <div className="pt-0.5 flex items-center text-[9px] sm:text-xs font-bold text-[#C5A059] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Ver más <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="py-8 sm:py-20 bg-white border-y border-[#EFE8E3]">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-12 gap-2">
              <div>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                  Nuestra Selección
                </span>
                <h2 className="font-serif text-xl sm:text-4xl font-bold text-[#2D151B] mt-0.5">
                  Productos Destacados
                </h2>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#7A1C30] hover:underline"
              >
                Ver todo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* OFFERS SECTION */}
        {offerProducts.length > 0 && (
          <section className="py-8 sm:py-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="bg-[#F3E3E5] rounded-2xl sm:rounded-3xl p-4 sm:p-12 border border-[#E8D2D5] text-center space-y-1.5 sm:space-y-3 mb-5 sm:mb-12">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white bg-[#7A1C30] inline-block">
                Oportunidades
              </span>
              <h2 className="font-serif text-xl sm:text-4xl font-bold text-[#2D151B]">
                Precios de Oferta Especial
              </h2>
              <p className="text-[11px] sm:text-xs text-[#6E5C62] max-w-lg mx-auto">
                Descuentos por tiempo limitado hasta agotar stock.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {offerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* INSTAGRAM GRID SECTION */}
        <section className="py-8 sm:py-20 border-t border-[#EFE8E3] bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-10">
            <div className="space-y-1">
              <Instagram className="w-5 h-5 sm:w-7 sm:h-7 text-[#7A1C30] mx-auto" />
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#2D151B]">Síguenos en Instagram</h2>
              <p className="text-[11px] sm:text-xs text-[#6E5C62]">@lulolenceria — #LuloLenceria</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-4">
              {[
                '/img/vikinis/3r6a0119-917a25e4dc35892f9417289315787563-1024-1024.jpg',
                '/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg',
                '/img/deportivo/05a-ladyfit-mujer-3-calza1-3809b5d9835af671a916572394874210-480-0.jpg',
                '/img/vikinis/bikini-naima-lurex-botanico-91e0adb3b1da2c67a917722256478856-1024-1024.webp',
                '/img/lenceria/conjunto-304-Negro-malena-boomshell-distribuidora.png',
                '/img/deportivo/VUORI-yoga-deportes-banner4.jpg',
              ].map((imgUrl, i) => (
                <a
                  key={i}
                  href="https://instagram.com/lulolenceria"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square rounded-lg sm:rounded-2xl overflow-hidden border border-[#EFE8E3] bg-[#FAF7F5]"
                >
                  <Image
                    src={imgUrl}
                    alt="Instagram Post"
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                    sizes="(max-width: 640px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-[#7A1C30]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
