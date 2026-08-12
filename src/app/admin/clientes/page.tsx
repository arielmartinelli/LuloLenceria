'use client';

import React, { useEffect, useState } from 'react';
import { Search, MessageCircle, Eye, X } from 'lucide-react';

interface CustomerOrder {
  id: string;
  orderNumber: number;
  date: string;
  total: number;
  status: string;
  paymentStatus: string;
  itemCount: number;
}

interface Customer {
  name: string;
  phone: string;
  city: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: CustomerOrder[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await fetch('/api/customers');
        const data = await res.json();
        setCustomers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchCity = c.city.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8E3] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D151B]">Directorio de Clientes</h1>
          <p className="text-xs text-[#6E5C62] mt-1 font-medium">
            Consolidado automático de clientes basado en historial de pedidos.
          </p>
        </div>
      </div>

      {/* Filter Box */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFE8E3] shadow-soft max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EFE8E3] shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6E5C62] text-xs font-medium">Cargando clientes...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-[#6E5C62] text-xs font-medium">
            No se encontraron clientes registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D151B]">
              <thead className="bg-[#FAF7F5] uppercase font-bold text-[#6E5C62] border-b border-[#EFE8E3]">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4">Ciudad</th>
                  <th className="p-4">Pedidos</th>
                  <th className="p-4">Total Gastado</th>
                  <th className="p-4">Último Pedido</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8E3]">
                {filteredCustomers.map((cust, i) => (
                  <tr key={i} className="hover:bg-[#FAF7F5] transition">
                    <td className="p-4 font-bold text-[#2D151B]">{cust.name}</td>
                    <td className="p-4">{cust.phone}</td>
                    <td className="p-4">{cust.city}</td>
                    <td className="p-4 font-bold text-[#C5A059]">{cust.orderCount} pedido(s)</td>
                    <td className="p-4 font-bold text-[#7A1C30]">
                      ${cust.totalSpent.toLocaleString('es-AR')}
                    </td>
                    <td className="p-4 text-[#6E5C62]">
                      {new Date(cust.lastOrderDate).toLocaleDateString('es-AR')}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="p-2 rounded-lg bg-[#FAF7F5] hover:bg-[#F3E3E5] text-[#7A1C30]"
                        title="Ver compras"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://wa.me/${cust.phone.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-[#25D366] hover:opacity-90 text-white"
                        title="Contactar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFE8E3] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2D151B]">{selectedCustomer.name}</h3>
                <p className="text-xs text-[#6E5C62]">{selectedCustomer.phone} | {selectedCustomer.city}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF7F5] p-3.5 rounded-2xl border border-[#EFE8E3]">
              <div>
                <p className="text-[#6E5C62]">Total Compras:</p>
                <p className="font-bold text-[#2D151B] text-base">{selectedCustomer.orderCount} pedido(s)</p>
              </div>
              <div>
                <p className="text-[#6E5C62]">Acumulado Histórico:</p>
                <p className="font-bold text-[#7A1C30] text-base">${selectedCustomer.totalSpent.toLocaleString('es-AR')}</p>
              </div>
            </div>

            <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              Historial de Pedidos
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedCustomer.orders.map((o) => (
                <div
                  key={o.id}
                  className="flex justify-between items-center bg-[#FAF7F5] p-3 rounded-xl text-xs border border-[#EFE8E3]"
                >
                  <div>
                    <p className="font-bold text-[#2D151B]">Pedido #{o.orderNumber}</p>
                    <p className="text-[11px] text-gray-500">{new Date(o.date).toLocaleDateString('es-AR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#7A1C30]">${o.total.toLocaleString('es-AR')}</p>
                    <span className="text-[10px] uppercase font-bold text-emerald-600">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-3 rounded-xl text-xs font-semibold text-[#6E5C62] bg-[#FAF7F5]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
