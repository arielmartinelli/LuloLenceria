'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  ShieldAlert,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface VariantInput {
  id?: string;
  size: string;
  color: string;
  model: string;
  sku: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number | null;
  cost?: number | null;
  description: string;
  categoryId: string;
  isFeatured: boolean;
  isOffer: boolean;
  is18Plus: boolean;
  active: boolean;
  category?: { name: string };
  images: { id?: string; url: string }[];
  variants: VariantInput[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [cost, setCost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [is18Plus, setIs18Plus] = useState(false);

  // Variants Fields in Modal
  const [variantsList, setVariantsList] = useState<VariantInput[]>([
    { size: 'M', color: 'Negro', model: '', sku: '', stock: 10 },
  ]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData);
      setCategories(catData);
      if (catData.length > 0) setCategoryId(catData[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`PROD-${Math.floor(100 + Math.random() * 900)}`);
    if (categories.length > 0) setCategoryId(categories[0].id);
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setCost('');
    setImageUrl('/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg');
    setIsFeatured(false);
    setIsOffer(false);
    setIs18Plus(false);
    setVariantsList([
      { size: 'S', color: 'Negro', model: '', sku: '', stock: 5 },
      { size: 'M', color: 'Negro', model: '', sku: '', stock: 10 },
      { size: 'L', color: 'Negro', model: '', sku: '', stock: 5 },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategoryId(p.categoryId);
    setDescription(p.description);
    setPrice(p.price.toString());
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setCost(p.cost ? p.cost.toString() : '');
    setImageUrl(p.images[0]?.url || '');
    setIsFeatured(p.isFeatured);
    setIsOffer(p.isOffer);
    setIs18Plus(p.is18Plus);
    setVariantsList(
      p.variants && p.variants.length > 0
        ? p.variants.map((v) => ({
            id: v.id,
            size: v.size || '',
            color: v.color || '',
            model: v.model || '',
            sku: v.sku || '',
            stock: v.stock,
          }))
        : [{ size: 'M', color: 'Negro', model: '', sku: '', stock: 10 }]
    );
    setIsModalOpen(true);
  };

  const handleAddVariantRow = () => {
    setVariantsList([
      ...variantsList,
      { size: 'S', color: 'Negro', model: '', sku: '', stock: 5 },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariantsList(variantsList.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) return;

    const payload = {
      name,
      sku,
      categoryId,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      cost: cost ? parseFloat(cost) : null,
      images: imageUrl ? [imageUrl] : [],
      isFeatured,
      isOffer,
      is18Plus,
      variants: variantsList,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchInitialData();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchInitialData();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Seguro que querés desactivar este producto?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (categoryFilter && p.categoryId !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8E3] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D151B]">Gestión de Productos</h1>
          <p className="text-xs text-[#6E5C62] mt-1 font-medium">
            Creá, editá y administrá el catálogo de bikinis, lencería, deportivo y línea +18.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition"
        >
          <Plus className="w-4 h-4" /> NUEVO PRODUCTO
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-[#EFE8E3] shadow-soft">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FAF7F5] text-[#2D151B] text-xs py-2.5 px-3 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
        >
          <option value="">Todas las Categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EFE8E3] shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6E5C62] text-xs font-medium">Cargando productos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D151B]">
              <thead className="bg-[#FAF7F5] uppercase font-bold text-[#6E5C62] border-b border-[#EFE8E3]">
                <tr>
                  <th className="p-4">Imagen</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Stock Total</th>
                  <th className="p-4">Atributos</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8E3]">
                {filteredProducts.map((p) => {
                  const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F5] transition">
                      <td className="p-4">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#FAF7F5] shrink-0 border border-[#EFE8E3]">
                          <Image
                            src={p.images[0]?.url || '/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg'}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[#2D151B] max-w-xs truncate">{p.name}</td>
                      <td className="p-4 font-mono text-gray-500">{p.sku}</td>
                      <td className="p-4">{p.category?.name}</td>
                      <td className="p-4 font-bold text-[#7A1C30]">
                        ${p.price.toLocaleString('es-AR')}
                      </td>
                      <td className="p-4 font-bold">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] ${
                            totalStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {totalStock} unid.
                        </span>
                      </td>
                      <td className="p-4 flex flex-wrap gap-1">
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                            Destacado
                          </span>
                        )}
                        {p.isOffer && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                            Oferta
                          </span>
                        )}
                        {p.is18Plus && (
                          <span className="px-2 py-0.5 rounded bg-[#F3E3E5] text-[#7A1C30] text-[9px] font-bold">
                            +18
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 rounded-lg bg-[#FAF7F5] hover:bg-[#F3E3E5] text-[#7A1C30]"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                            title="Desactivar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={handleSaveProduct}
            className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE8E3] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#EFE8E3] pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#2D151B]">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">SKU *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Categoría *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Precio Venta ($) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Precio Anterior ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Costo de Compra ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D151B] block mb-1">
                Ruta / URL Imagen Principal
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/img/lenceria/..."
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D151B] block mb-1">
                Descripción
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs p-3 rounded-xl border border-[#EFE8E3]"
              />
            </div>

            {/* Checkbox Attributes */}
            <div className="flex flex-wrap gap-6 bg-[#FAF7F5] p-4 rounded-2xl border border-[#EFE8E3] text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-[#2D151B]">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span>Destacado en Home</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#7A1C30]">
                <input
                  type="checkbox"
                  checked={isOffer}
                  onChange={(e) => setIsOffer(e.target.checked)}
                />
                <span>Producto en Oferta</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[#C5A059]">
                <input
                  type="checkbox"
                  checked={is18Plus}
                  onChange={(e) => setIs18Plus(e.target.checked)}
                />
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Exclusivo +18
                </span>
              </label>
            </div>

            {/* Variants */}
            <div className="space-y-3 border-t border-[#EFE8E3] pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                  Variantes y Stock
                </h3>
                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  className="text-xs text-[#7A1C30] hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Combinación
                </button>
              </div>

              <div className="space-y-2">
                {variantsList.map((v, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 gap-2 bg-[#FAF7F5] p-3 rounded-xl border border-[#EFE8E3] items-center text-xs"
                  >
                    <input
                      type="text"
                      placeholder="Talle"
                      value={v.size}
                      onChange={(e) => {
                        const copy = [...variantsList];
                        copy[idx].size = e.target.value;
                        setVariantsList(copy);
                      }}
                      className="bg-white text-[#2D151B] p-2 rounded border border-[#EFE8E3]"
                    />
                    <input
                      type="text"
                      placeholder="Color"
                      value={v.color}
                      onChange={(e) => {
                        const copy = [...variantsList];
                        copy[idx].color = e.target.value;
                        setVariantsList(copy);
                      }}
                      className="bg-white text-[#2D151B] p-2 rounded border border-[#EFE8E3]"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) => {
                        const copy = [...variantsList];
                        copy[idx].stock = parseInt(e.target.value) || 0;
                        setVariantsList(copy);
                      }}
                      className="bg-white text-[#2D151B] p-2 rounded border border-[#EFE8E3] font-bold"
                    />
                    <div className="text-right">
                      {variantsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantRow(idx)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#EFE8E3]">
              <button
                type="submit"
                className="flex-1 py-3.5 px-6 rounded-xl font-bold tracking-wider text-white bg-[#7A1C30] hover:bg-[#94233B] transition text-xs uppercase"
              >
                {editingProduct ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-3.5 px-6 rounded-xl text-xs font-semibold text-[#6E5C62] bg-[#FAF7F5]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
