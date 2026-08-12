'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  CreditCard,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Envío a Domicilio');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia Bancaria');
  const [comments, setComments] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const shippingCost = deliveryMethod === 'Envío a Domicilio' ? 2500 : 0;
  const totalAmount = subtotal + shippingCost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !city || !address) {
      setErrorMsg('Por favor completá todos los campos obligatorios (*)');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('El carrito está vacío');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        customerName,
        customerPhone,
        city,
        address,
        deliveryMethod,
        paymentMethod,
        comments,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: i.name,
          variantDetails: `${i.color ? `Color: ${i.color}` : ''} ${i.size ? `Talle: ${i.size}` : ''} ${
            i.model ? `Modelo: ${i.model}` : ''
          }`.trim(),
          quantity: i.quantity,
          unitPrice: i.price,
          subtotal: i.price * i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      setCompletedOrder(data.order);
      setWhatsappUrl(data.whatsappUrl);
      clearCart();

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al enviar pedido');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F5]">
        <Header />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EFE8E3] shadow-luxury space-y-6">
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              ¡Pedido Generado con Éxito!
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D151B]">
              Pedido #{completedOrder.orderNumber}
            </h1>

            <p className="text-xs text-[#6E5C62] max-w-lg mx-auto leading-relaxed">
              Tu pedido fue registrado en nuestro sistema. A continuación serás redirigido a WhatsApp para coordinar el pago y envío.
            </p>

            <div className="bg-[#FAF7F5] p-5 rounded-2xl border border-[#EFE8E3] text-left text-xs text-[#2D151B] space-y-2">
              <p><strong className="text-[#7A1C30]">Cliente:</strong> {completedOrder.customerName}</p>
              <p><strong className="text-[#7A1C30]">Teléfono:</strong> {completedOrder.customerPhone}</p>
              <p><strong className="text-[#7A1C30]">Entrega:</strong> {completedOrder.deliveryMethod} ({completedOrder.address}, {completedOrder.city})</p>
              <p><strong className="text-[#7A1C30]">Pago:</strong> {completedOrder.paymentMethod}</p>
              <p className="text-lg font-bold text-[#7A1C30] pt-2 border-t border-[#EFE8E3]">
                Total: ${completedOrder.totalAmount.toLocaleString('es-AR')}
              </p>
            </div>

            <div className="pt-4 space-y-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl text-xs font-bold text-white bg-[#25D366] hover:bg-emerald-600 shadow-soft transition"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  ABRIR WHATSAPP NUEVAMENTE
                </a>
              )}
              <Link href="/" className="inline-block text-xs font-bold text-[#7A1C30] hover:underline">
                Volver al inicio
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 text-xs text-[#6E5C62] hover:text-[#7A1C30] mb-2 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Seguir comprando
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D151B]">
            Finalizar Pedido por WhatsApp
          </h1>
          <p className="text-xs text-[#6E5C62] mt-1">
            Completá tus datos para generar tu comprobante y enviar el pedido directo a la tienda.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EFE8E3] space-y-4">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
            <h2 className="text-lg font-serif text-[#2D151B]">No tenés productos en tu carrito</h2>
            <Link
              href="/catalog"
              className="inline-block px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#7A1C30]"
            >
              IR AL CATÁLOGO
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form */}
            <div className="lg:col-span-7 space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Personal Info */}
              <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
                <h3 className="font-serif text-base font-bold text-[#2D151B] flex items-center gap-2 border-b border-[#EFE8E3] pb-3">
                  <User className="w-4 h-4 text-[#7A1C30]" />
                  1. Datos de Contacto
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2D151B] block mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Pérez"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-4 py-2.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D151B] block mb-1">
                      Teléfono WhatsApp *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 11 1234 5678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
                <h3 className="font-serif text-base font-bold text-[#2D151B] flex items-center gap-2 border-b border-[#EFE8E3] pb-3">
                  <MapPin className="w-4 h-4 text-[#7A1C30]" />
                  2. Dirección & Entrega
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2D151B] block mb-1">
                      Ciudad / Localidad *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: CABA / Rosario"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-4 py-2.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D151B] block mb-1">
                      Dirección y Número *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Calle Armenia 1540 3A"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-4 py-2.5 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2D151B] block mb-2">
                    Método de Entrega:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Envío a Domicilio', 'Retiro en Local'].map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setDeliveryMethod(method)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                          deliveryMethod === method
                            ? 'border-[#7A1C30] bg-[#F3E3E5] text-[#7A1C30]'
                            : 'border-[#EFE8E3] bg-[#FAF7F5] text-[#6E5C62]'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment & Comments */}
              <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
                <h3 className="font-serif text-base font-bold text-[#2D151B] flex items-center gap-2 border-b border-[#EFE8E3] pb-3">
                  <CreditCard className="w-4 h-4 text-[#7A1C30]" />
                  3. Forma de Pago Preferida
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {['Transferencia Bancaria', 'Efectivo', 'Otro'].map((pay) => (
                    <button
                      type="button"
                      key={pay}
                      onClick={() => setPaymentMethod(pay)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                        paymentMethod === pay
                          ? 'border-[#7A1C30] bg-[#F3E3E5] text-[#7A1C30]'
                          : 'border-[#EFE8E3] bg-[#FAF7F5] text-[#6E5C62]'
                      }`}
                    >
                      {pay}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2D151B] block mb-1">
                    Comentarios (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Entregar por la tarde..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs p-3 rounded-xl border border-[#EFE8E3] focus:outline-none focus:border-[#7A1C30]"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-6 sticky top-28">
                <h3 className="font-serif text-base font-bold text-[#2D151B] border-b border-[#EFE8E3] pb-3">
                  Resumen de tu Pedido
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3 text-xs">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-[#FAF7F5] border border-[#EFE8E3]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#2D151B] truncate">{item.name}</h4>
                        <p className="text-[11px] text-[#6E5C62]">
                          {item.color} {item.size && `| Talle: ${item.size}`} x{item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-[#7A1C30]">
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#EFE8E3] pt-4 space-y-2 text-xs text-[#6E5C62]">
                  <div className="flex justify-between">
                    <span>Subtotal Productos</span>
                    <span className="font-bold text-[#2D151B]">${subtotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo de Envío</span>
                    <span className="font-bold text-[#2D151B]">
                      {shippingCost === 0 ? '¡GRATIS / Retiro!' : `$${shippingCost.toLocaleString('es-AR')}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#2D151B] pt-2 border-t border-[#EFE8E3]">
                    <span>Total a Pagar</span>
                    <span className="text-[#7A1C30] font-serif">${totalAmount.toLocaleString('es-AR')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold tracking-wider text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition duration-300 text-xs uppercase disabled:opacity-50"
                >
                  {submitting ? (
                    'GENERANDO PEDIDO...'
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 fill-current" />
                      CONFIRMAR PEDIDO POR WHATSAPP
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
