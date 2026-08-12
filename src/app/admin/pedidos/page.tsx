'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  MessageCircle,
  X,
} from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  variantDetails: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  deliveryMethod: string;
  paymentMethod: string;
  comments?: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePayment = async (orderId: string, newPaymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (paymentFilter && o.paymentStatus !== paymentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const numMatch = o.orderNumber.toString().includes(q);
      const nameMatch = o.customerName.toLowerCase().includes(q);
      const phoneMatch = o.customerPhone.includes(q);
      if (!numMatch && !nameMatch && !phoneMatch) return false;
    }
    return true;
  });

  const orderStatuses = [
    'PENDIENTE',
    'CONFIRMADO',
    'PREPARANDO',
    'ENVIADO',
    'ENTREGADO',
    'CANCELADO',
  ];
  const paymentStatuses = ['PENDIENTE', 'COBRADO', 'NO_COBRADO'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8E3] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D151B]">Gestión de Pedidos</h1>
          <p className="text-xs text-[#6E5C62] mt-1 font-medium">
            Administrá los pedidos de tus clientes, estados de envío, cobranzas y contacto directo por WhatsApp.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-[#EFE8E3] shadow-soft">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por # pedido, nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF7F5] text-[#2D151B] text-xs py-2.5 px-3 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
        >
          <option value="">Todos los Estados de Pedido</option>
          {orderStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-[#FAF7F5] text-[#2D151B] text-xs py-2.5 px-3 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
        >
          <option value="">Todos los Estados de Pago</option>
          {paymentStatuses.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#EFE8E3] shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#6E5C62] text-xs font-medium">Cargando pedidos...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#6E5C62] text-xs font-medium">
            No se encontraron pedidos con los criterios seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D151B]">
              <thead className="bg-[#FAF7F5] uppercase font-bold text-[#6E5C62] border-b border-[#EFE8E3]">
                <tr>
                  <th className="p-4">Nº Pedido</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Estado Pedido</th>
                  <th className="p-4">Pago</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8E3]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F5] transition">
                    <td className="p-4 font-bold text-[#7A1C30]">#{order.orderNumber}</td>
                    <td className="p-4 text-[#6E5C62]">
                      {new Date(order.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="p-4 font-bold">{order.customerName}</td>
                    <td className="p-4">{order.customerPhone}</td>
                    <td className="p-4 font-bold text-[#7A1C30]">
                      ${order.totalAmount.toLocaleString('es-AR')}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border focus:outline-none ${
                          order.status === 'ENTREGADO'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : order.status === 'CANCELADO'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {orderStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePayment(order.id, e.target.value)}
                        className={`text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none ${
                          order.paymentStatus === 'COBRADO'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {paymentStatuses.map((pst) => (
                          <option key={pst} value={pst}>
                            {pst}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg bg-[#FAF7F5] hover:bg-[#F3E3E5] text-[#7A1C30]"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                          `Hola ${order.customerName} 💕 Te escribimos de Lulo Lencería sobre tu pedido #${order.orderNumber}.`
                        )}`}
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

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE8E3] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFE8E3] pb-4">
              <div>
                <span className="text-xs font-bold text-[#C5A059] uppercase">Detalle del Pedido</span>
                <h2 className="font-serif text-2xl font-bold text-[#2D151B]">
                  Pedido #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#EFE8E3] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[#6E5C62]">Cliente:</p>
                <p className="font-bold text-[#2D151B] text-sm">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-[#6E5C62]">Teléfono:</p>
                <p className="font-bold text-[#2D151B] text-sm">{selectedOrder.customerPhone}</p>
              </div>
              <div>
                <p className="text-[#6E5C62]">Dirección & Ciudad:</p>
                <p className="font-semibold text-[#2D151B]">{selectedOrder.address}, {selectedOrder.city}</p>
              </div>
              <div>
                <p className="text-[#6E5C62]">Entrega / Pago:</p>
                <p className="font-semibold text-[#2D151B]">{selectedOrder.deliveryMethod} | {selectedOrder.paymentMethod}</p>
              </div>
              {selectedOrder.comments && (
                <div className="sm:col-span-2 pt-2 border-t border-[#EFE8E3]">
                  <p className="text-[#6E5C62]">Comentarios:</p>
                  <p className="text-[#2D151B] italic">&quot;{selectedOrder.comments}&quot;</p>
                </div>
              )}
            </div>

            {/* Products List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                Productos Comprados ({selectedOrder.items.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-[#FAF7F5] p-3 rounded-xl text-xs border border-[#EFE8E3]"
                  >
                    <div>
                      <p className="font-bold text-[#2D151B]">{item.productName}</p>
                      <p className="text-[11px] text-[#6E5C62]">{item.variantDetails}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#7A1C30]">${item.subtotal.toLocaleString('es-AR')}</p>
                      <p className="text-[10px] text-gray-500">x{item.quantity} (${item.unitPrice.toLocaleString('es-AR')}/u)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EFE8E3]">
              <span className="text-sm font-bold text-[#2D151B]">Total General</span>
              <span className="font-serif text-2xl font-bold text-[#7A1C30]">
                ${selectedOrder.totalAmount.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                  `Hola ${selectedOrder.customerName} 💕 Te escribimos de Lulo Lencería sobre tu pedido #${selectedOrder.orderNumber}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-emerald-600 shadow-soft transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" /> CONTACTAR POR WHATSAPP
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-3 px-6 rounded-xl text-xs font-semibold text-[#6E5C62] bg-[#FAF7F5] hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
