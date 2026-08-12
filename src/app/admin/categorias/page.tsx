'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  active: boolean;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, image }),
        });
        if (res.ok) {
          fetchCategories();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, image }),
        });
        if (res.ok) {
          fetchCategories();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8E3] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D151B]">Gestión de Categorías</h1>
          <p className="text-xs text-[#6E5C62] mt-1 font-medium">
            Administrá las categorías principales de la tienda (Bikinis, Lencería, Indumentaria Deportiva, +18).
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition"
        >
          <Plus className="w-4 h-4" /> NUEVA CATEGORÍA
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#EFE8E3] shadow-soft space-y-4 flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-[#FAF7F5]">
              <Image
                src={cat.image || '/img/lenceria/16994300665e1678729e65018751ee1f0f40848ad2_thumbnail_720x.jpg'}
                alt={cat.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-serif text-xl font-bold text-white">{cat.name}</h3>
                <span className="text-[10px] text-[#C5A059] uppercase tracking-wider font-bold">
                  {cat._count?.products || 0} productos activos
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3 pt-0">
              <p className="text-xs text-[#6E5C62] line-clamp-2">{cat.description || 'Sin descripción'}</p>

              <div className="flex gap-2 pt-2 border-t border-[#EFE8E3]">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-[#7A1C30] bg-[#FAF7F5] hover:bg-[#F3E3E5]"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100"
                  title="Eliminar categoría"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={handleSaveCategory}
            className="w-full max-w-md bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#EFE8E3] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2D151B]">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D151B] block mb-1">
                Nombre de la Categoría *
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
              <label className="text-xs font-bold text-[#2D151B] block mb-1">
                Ruta / URL Imagen
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/img/lenceria/..."
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D151B] block mb-1">Descripción</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs p-3 rounded-xl border border-[#EFE8E3]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-[#7A1C30] hover:bg-[#94233B]"
              >
                {editingCategory ? 'GUARDAR' : 'CREAR'}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-3 px-4 rounded-xl text-xs font-semibold text-[#6E5C62] bg-[#FAF7F5]"
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
