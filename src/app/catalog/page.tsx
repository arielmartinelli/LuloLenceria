'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
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
  variants: {
    id: string;
    size?: string | null;
    color?: string | null;
    model?: string | null;
    stock: number;
  }[];
}

function CatalogContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [onlyOffers, setOnlyOffers] = useState<boolean>(searchParams.get('offer') === 'true');
  const [only18Plus, setOnly18Plus] = useState<boolean>(searchParams.get('is18Plus') === 'true');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('newest');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);

    const q = searchParams.get('search');
    if (q !== null) setSearchQuery(q);

    const off = searchParams.get('offer');
    if (off !== null) setOnlyOffers(off === 'true');
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        setCategories(catData);

        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        setProducts(prodData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category?.slug !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const catMatch = p.category?.name.toLowerCase().includes(q);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }
    if (onlyOffers && !p.isOffer) return false;
    if (only18Plus && !p.is18Plus) return false;
    if (selectedSize) {
      const hasSize = p.variants?.some(
        (v) => v.size?.toLowerCase() === selectedSize.toLowerCase() && v.stock > 0
      );
      if (!hasSize) return false;
    }
    if (selectedColor) {
      const hasColor = p.variants?.some(
        (v) => v.color?.toLowerCase() === selectedColor.toLowerCase() && v.stock > 0
      );
      if (!hasColor) return false;
    }
    if (inStockOnly) {
      const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
      if (totalStock <= 0) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    return 0;
  });

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setOnlyOffers(false);
    setOnly18Plus(false);
    setSelectedSize('');
    setSelectedColor('');
    setInStockOnly(false);
    setSortOption('newest');
  };

  const sizesList = ['S', 'M', 'L', 'XL', '85', '90', '95', '100'];
  const colorsList = ['Negro', 'Vino', 'Blanco', 'Rosa Empolvado', 'Nude', 'Rojo', 'Dorado'];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
            Catálogo Completo
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2D151B] mt-1">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Catálogo'
              : onlyOffers
              ? 'Ofertas Especiales'
              : only18Plus
              ? 'Colección Erótica +18'
              : 'Nuestras Colecciones'}
          </h1>
          <p className="text-xs text-[#6E5C62] mt-1.5">
            Mostrando {sortedProducts.length} productos disponibles
          </p>
        </div>

        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFE8E3] mb-6 sm:mb-8 shadow-soft">
          <button
            onClick={() => setSelectedCategory('')}
            className="lg:hidden flex items-center justify-center gap-2 py-2.5 px-4 bg-[#7A1C30] text-white rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros & Categorías
          </button>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por bikini, talle, encaje..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <span className="text-xs text-[#6E5C62] font-semibold">Ordenar por:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-[#FAF7F5] text-[#2D151B] text-xs py-2 px-3 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
            >
              <option value="newest">Novedades</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#EFE8E3] shadow-soft h-fit">
            <div className="flex items-center justify-between border-b border-[#EFE8E3] pb-3">
              <h3 className="font-serif text-base font-bold text-[#2D151B] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#7A1C30]" />
                Filtros
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-[#6E5C62] hover:text-[#7A1C30] flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Limpiar
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                Categorías
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === ''
                      ? 'bg-[#7A1C30] text-white'
                      : 'text-[#2D151B] hover:bg-[#FAF7F5]'
                  }`}
                >
                  Todas las Categorías
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedCategory === cat.slug
                        ? 'bg-[#7A1C30] text-white'
                        : 'text-[#2D151B] hover:bg-[#FAF7F5]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Toggles */}
            <div className="space-y-2.5 border-t border-[#EFE8E3] pt-3.5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-[#2D151B]">Solo Ofertas %</span>
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className="rounded border-[#D8C8CA] text-[#7A1C30] focus:ring-[#7A1C30]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-[#7A1C30]">Línea Exclusiva +18</span>
                <input
                  type="checkbox"
                  checked={only18Plus}
                  onChange={(e) => setOnly18Plus(e.target.checked)}
                  className="rounded border-[#D8C8CA] text-[#7A1C30] focus:ring-[#7A1C30]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-[#2D151B]">En Stock Disponible</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#D8C8CA] text-[#7A1C30] focus:ring-[#7A1C30]"
                />
              </label>
            </div>

            {/* Sizes */}
            <div className="border-t border-[#EFE8E3] pt-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                Talle
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('')}
                  className={`px-2 py-1 rounded text-xs border ${
                    selectedSize === ''
                      ? 'border-[#7A1C30] bg-[#7A1C30] text-white font-bold'
                      : 'border-[#EFE8E3] text-[#2D151B] hover:border-gray-300'
                  }`}
                >
                  Todos
                </button>
                {sizesList.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    className={`px-2 py-1 rounded text-xs border ${
                      selectedSize === size
                        ? 'border-[#7A1C30] bg-[#7A1C30] text-white font-bold'
                        : 'border-[#EFE8E3] text-[#2D151B] hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="border-t border-[#EFE8E3] pt-3.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059] mb-2">
                Color
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedColor('')}
                  className={`px-2 py-1 rounded text-xs border ${
                    selectedColor === ''
                      ? 'border-[#7A1C30] bg-[#7A1C30] text-white font-bold'
                      : 'border-[#EFE8E3] text-[#2D151B] hover:border-gray-300'
                  }`}
                >
                  Todos
                </button>
                {colorsList.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(selectedColor === col ? '' : col)}
                    className={`px-2 py-1 rounded text-xs border ${
                      selectedColor === col
                        ? 'border-[#7A1C30] bg-[#7A1C30] text-white font-bold'
                        : 'border-[#EFE8E3] text-[#2D151B] hover:border-gray-300'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid (2 COLUMNS ON MOBILE - grid-cols-2) */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-72 sm:h-96 rounded-2xl bg-white animate-pulse border border-[#EFE8E3]"
                  />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#EFE8E3] space-y-4 shadow-soft">
                <p className="text-base font-serif text-[#2D151B]">No se encontraron productos</p>
                <p className="text-xs text-[#6E5C62]">
                  Prueba cambiando los filtros de búsqueda o seleccionando otra categoría.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 rounded-full text-xs font-bold text-white bg-[#7A1C30] hover:bg-[#94233B] transition"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F5]" />}>
      <CatalogContent />
    </Suspense>
  );
}
