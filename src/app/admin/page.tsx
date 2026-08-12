'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

interface ProductVariant {
  id: string;
  stock: number;
  product: { name: string; category: { name: string } };
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockVariants, setStockVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const orderRes = await fetch('/api/orders');
        const orderData = await orderRes.json();
        setOrders(orderData);

        const stockRes = await fetch('/api/stock');
        const stockData = await stockRes.json();
        setStockVariants(stockData.variants || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const today = new Date().toDateString();
  const salesToday = orders
    .filter((o) => new Date(o.createdAt).toDateString() === today && o.status !== 'CANCELADO')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const salesMonth = orders
    .filter(
      (o) =>
        new Date(o.createdAt).getMonth() === new Date().getMonth() && o.status !== 'CANCELADO'
    )
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDIENTE').length;

  const lowStockCount = stockVariants.filter((v) => v.stock > 0 && v.stock <= 3).length;
  const outOfStockCount = stockVariants.filter((v) => v.stock === 0).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8E3] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D151B]">Dashboard Principal</h1>
          <p className="text-xs text-[#6E5C62] mt-1 font-medium">
            Resumen de ventas, inventarios y actividad de la tienda.
          </p>
        </div>
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition"
        >
          Ver Todos los Pedidos <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Sales Today */}
        <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E5C62]">
              Ventas del Día
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#7A1C30] font-serif">
            ${salesToday.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Facturación de hoy
          </p>
        </div>

        {/* Sales Month */}
        <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E5C62]">
              Ventas del Mes
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F3E3E5] text-[#7A1C30] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#7A1C30] font-serif">
            ${salesMonth.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-[#6E5C62]">Acumulado mes en curso</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E5C62]">
              Pedidos Pendientes
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600 font-serif">{pendingOrdersCount}</p>
          <p className="text-[11px] text-[#6E5C62]">De {totalOrdersCount} pedidos totales</p>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E5C62]">
              Alertas de Inventario
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{outOfStockCount} sin stock</span>
            <span className="text-xs text-amber-600">({lowStockCount} bajo)</span>
          </div>
          <p className="text-[11px] text-[#6E5C62]">Variantes a reponer</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Day Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#2D151B]">
              Ventas por Día (Última Semana)
            </h3>
            <span className="text-xs text-emerald-600 font-bold">+18.5% esta semana</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#EFE8E3]">
            {[
              { day: 'Lun', height: '40%' },
              { day: 'Mar', height: '65%' },
              { day: 'Mié', height: '30%' },
              { day: 'Jue', height: '85%' },
              { day: 'Vie', height: '70%' },
              { day: 'Sáb', height: '100%' },
              { day: 'Dom', height: '50%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  style={{ height: bar.height }}
                  className="w-full bg-[#7A1C30] rounded-t-lg transition-all duration-300 group-hover:bg-[#94233B]"
                />
                <span className="text-[11px] text-[#6E5C62] font-semibold">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2D151B]">Categorías Más Vendidas</h3>

          <div className="space-y-4 pt-2">
            {[
              { name: 'Lencería & Bodies', percent: 42, color: 'bg-[#7A1C30]' },
              { name: 'Bikinis de Diseño', percent: 30, color: 'bg-[#C5A059]' },
              { name: 'Indumentaria Deportiva', percent: 18, color: 'bg-[#C8A0A6]' },
              { name: '+18 / Eróticos', percent: 10, color: 'bg-[#5A4A4E]' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#2D151B]">
                  <span>{cat.name}</span>
                  <span className="text-[#7A1C30]">{cat.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#FAF7F5] rounded-full overflow-hidden border border-[#EFE8E3]">
                  <div
                    style={{ width: `${cat.percent}%` }}
                    className={`h-full ${cat.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#2D151B]">Últimos Pedidos</h3>
          <Link
            href="/admin/pedidos"
            className="text-xs text-[#7A1C30] hover:underline font-bold"
          >
            Ver todos ({totalOrdersCount}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D151B]">
            <thead className="bg-[#FAF7F5] uppercase font-bold text-[#6E5C62] border-b border-[#EFE8E3]">
              <tr>
                <th className="p-3">Nº Pedido</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Total</th>
                <th className="p-3">Estado Pedido</th>
                <th className="p-3">Estado Pago</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8E3]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF7F5] transition">
                  <td className="p-3 font-bold text-[#7A1C30]">#{order.orderNumber}</td>
                  <td className="p-3 font-semibold">{order.customerName}</td>
                  <td className="p-3 font-bold text-[#7A1C30]">
                    ${order.totalAmount.toLocaleString('es-AR')}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'ENTREGADO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'CANCELADO'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.paymentStatus === 'COBRADO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href="/admin/pedidos"
                      className="text-[#7A1C30] hover:underline font-bold"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
