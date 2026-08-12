'use client';

import React, { useEffect, useState } from 'react';
import {
  Warehouse,
  AlertTriangle,
  X,
  History,
} from 'lucide-react';

interface Movement {
  id: string;
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  notes?: string | null;
  createdAt: string;
  variant: {
    sku: string;
    size?: string | null;
    color?: string | null;
    product: { name: string };
  };
}

interface Variant {
  id: string;
  sku: string;
  size?: string | null;
  color?: string | null;
  model?: string | null;
  stock: number;
  product: {
    id: string;
    name: string;
    category?: { name: string };
  };
}

export default function AdminStockPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Adjustment Modal State
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [adjustmentType, setAdjustmentType] = useState('INGRESO');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchStockData();
  }, []);

  async function fetchStockData() {
    setLoading(true);
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      setVariants(data.variants || []);
      setMovements(data.movements || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleManualAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant || !quantity) return;

    const qtyNum = parseInt(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setErrorMsg('La cantidad debe ser un número entero positivo');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          type: adjustmentType,
          quantity: qtyNum,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al ajustar stock');
      }

      fetchStockData();
      setSelectedVariant(null);
      setQuantity('');
      setNotes('');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockVariants = variants.filter((v) => v.stock > 0 && v.stock <= 3);
  const outOfStockVariants = variants.filter((v) => v.stock === 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8E3] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D151B]">Control de Stock e Inventario</h1>
          <p className="text-xs text-[#6E5C62] mt-1 font-medium">
            Monitoreá el stock disponible por combinación de talle/color y realizá ingresos manuales.
          </p>
        </div>
      </div>

      {/* Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#EFE8E3] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6E5C62] font-bold uppercase">Total Variantes</span>
            <p className="text-2xl font-bold text-[#2D151B] font-serif mt-1">{variants.length}</p>
          </div>
          <Warehouse className="w-8 h-8 text-[#C5A059]" />
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EFE8E3] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-bold uppercase">Stock Bajo (≤3 u)</span>
            <p className="text-2xl font-bold text-amber-600 font-serif mt-1">{lowStockVariants.length}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EFE8E3] shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-700 font-bold uppercase">Sin Stock (0 u)</span>
            <p className="text-2xl font-bold text-rose-600 font-serif mt-1">{outOfStockVariants.length}</p>
          </div>
          <X className="w-8 h-8 text-rose-500" />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#EFE8E3] shadow-soft overflow-hidden">
        <div className="p-4 border-b border-[#EFE8E3] flex items-center justify-between bg-[#FAF7F5]">
          <h3 className="font-serif text-base font-bold text-[#2D151B]">Inventario por Variante</h3>
          <span className="text-xs text-[#6E5C62]">Ordenado por menor stock</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#6E5C62] text-xs font-medium">Cargando inventario...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D151B]">
              <thead className="bg-[#FAF7F5] uppercase font-bold text-[#6E5C62] border-b border-[#EFE8E3]">
                <tr>
                  <th className="p-4">Producto</th>
                  <th className="p-4">SKU Variante</th>
                  <th className="p-4">Color</th>
                  <th className="p-4">Talle</th>
                  <th className="p-4">Stock Actual</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8E3]">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FAF7F5] transition">
                    <td className="p-4 font-bold text-[#2D151B]">{v.product?.name}</td>
                    <td className="p-4 font-mono text-gray-500">{v.sku}</td>
                    <td className="p-4">{v.color || '-'}</td>
                    <td className="p-4 font-bold">{v.size || '-'}</td>
                    <td className="p-4 text-sm font-bold text-[#7A1C30]">{v.stock} u.</td>
                    <td className="p-4">
                      {v.stock === 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          SIN STOCK
                        </span>
                      ) : v.stock <= 3 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          STOCK BAJO
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedVariant(v)}
                        className="px-3 py-1.5 rounded-lg bg-[#7A1C30] hover:bg-[#94233B] text-white font-bold text-[11px]"
                      >
                        Ajustar Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Movement History Log */}
      <div className="bg-white rounded-2xl border border-[#EFE8E3] shadow-soft overflow-hidden">
        <div className="p-4 border-b border-[#EFE8E3] bg-[#FAF7F5] flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#2D151B] flex items-center gap-2">
            <History className="w-4 h-4 text-[#7A1C30]" />
            Historial de Movimientos de Inventario
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D151B]">
            <thead className="bg-[#FAF7F5] uppercase font-bold text-[#6E5C62] border-b border-[#EFE8E3]">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Producto / Variante</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Cantidad</th>
                <th className="p-3">Stock Prev → Nuevo</th>
                <th className="p-3">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8E3]">
              {movements.slice(0, 15).map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF7F5] transition">
                  <td className="p-3 text-gray-500">
                    {new Date(m.createdAt).toLocaleString('es-AR')}
                  </td>
                  <td className="p-3 font-bold text-[#2D151B]">
                    {m.variant?.product?.name} ({m.variant?.color || ''} {m.variant?.size || ''})
                  </td>
                  <td className="p-3 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        m.type === 'INGRESO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.type === 'VENTA'
                          ? 'bg-amber-100 text-amber-800'
                          : m.type === 'CANCELACION'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td className="p-3 font-bold">{m.quantity} u.</td>
                  <td className="p-3 text-gray-500">
                    {m.previousStock} → <strong className="text-[#7A1C30]">{m.newStock}</strong>
                  </td>
                  <td className="p-3 text-[#6E5C62] italic max-w-xs truncate">{m.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADJUSTMENT MODAL */}
      {selectedVariant && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={handleManualAdjustmentSubmit}
            className="w-full max-w-md bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#EFE8E3] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2D151B]">Ajustar Stock Manual</h3>
              <button
                type="button"
                onClick={() => setSelectedVariant(null)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF7F5] p-3 rounded-xl border border-[#EFE8E3] text-xs">
              <p className="font-bold text-[#2D151B]">{selectedVariant.product?.name}</p>
              <p className="text-[#6E5C62]">
                Variante: {selectedVariant.color} | Talle: {selectedVariant.size} (Stock actual:{' '}
                <strong className="text-[#7A1C30]">{selectedVariant.stock} u.</strong>)
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#2D151B] block mb-1">
                Tipo de Movimiento:
              </label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs p-2.5 rounded-xl border border-[#EFE8E3]"
              >
                <option value="INGRESO">INGRESO (Sumar mercadería)</option>
                <option value="AJUSTE_MANUAL">AJUSTE MANUAL (+ o - reposición)</option>
                <option value="DEVOLUCION">DEVOLUCIÓN (Sumar producto devuelto)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D151B] block mb-1">
                Cantidad a Unidades:
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="Ej: 5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-sm p-2.5 rounded-xl border border-[#EFE8E3] font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2D151B] block mb-1">
                Motivo / Nota (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ej: Lote recibido de fábrica"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs p-2.5 rounded-xl border border-[#EFE8E3]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-[#7A1C30] hover:bg-[#94233B]"
              >
                CONFIRMAR AJUSTE
              </button>
              <button
                type="button"
                onClick={() => setSelectedVariant(null)}
                className="py-3 px-4 rounded-xl text-xs text-[#6E5C62] bg-[#FAF7F5]"
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
