'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle2, MessageCircle, ShieldAlert, Truck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('');
  const [ageNoticeText, setAgeNoticeText] = useState('');
  const [shippingCost, setShippingCost] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setStoreName(data.storeName || 'Lulo Lencería');
        setWhatsappNumber(data.whatsappNumber || '5491112345678');
        setInstagramUrl(data.instagramUrl || 'https://instagram.com/lulolenceria');
        setAddress(data.address || 'Av. Santa Fe 1842, CABA');
        setHours(data.hours || 'Lun a Sáb de 10:00 a 20:00 hs');
        setAgeNoticeText(data.ageNoticeText || 'Este sitio contiene productos destinados exclusivamente a mayores de 18 años.');
        setShippingCost(data.shippingCost ? data.shippingCost.toString() : '2500');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          whatsappNumber,
          instagramUrl,
          address,
          hours,
          ageNoticeText,
          shippingCost: parseFloat(shippingCost),
        }),
      });

      if (res.ok) {
        setSuccessMsg('¡Configuración de la tienda guardada exitosamente!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8E3] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2D151B]">Configuración General de la Tienda</h1>
          <p className="text-xs text-[#6E5C62] mt-1 font-medium">
            Personalizá el número de WhatsApp receptor de pedidos, costo de envío, aviso +18 y datos de contacto.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-[#6E5C62] text-xs font-medium">Cargando configuración...</div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* WhatsApp & Main Contact */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2D151B] flex items-center gap-2 border-b border-[#EFE8E3] pb-3">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              Recepción de Pedidos por WhatsApp
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Número de WhatsApp Receptor (código de país sin +) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 5491112345678"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-4 py-2.5 rounded-xl border border-[#EFE8E3] font-bold"
                />
                <p className="text-[10px] text-[#6E5C62] mt-1">
                  A este número llegarán las confirmaciones de checkout enviadas por los clientes.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Costo Estándar de Envío a Domicilio ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#EFE8E3] font-bold"
                  />
                  <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2D151B] flex items-center gap-2 border-b border-[#EFE8E3] pb-3">
              <Settings className="w-5 h-5 text-[#7A1C30]" />
              Información de la Marca
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  URL Instagram
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Dirección Física de la Tienda / Retiro
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D151B] block mb-1">
                  Horarios de Atención
                </label>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs px-3.5 py-2.5 rounded-xl border border-[#EFE8E3]"
                />
              </div>
            </div>
          </div>

          {/* Age Disclaimer */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE8E3] shadow-soft space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2D151B] flex items-center gap-2 border-b border-[#EFE8E3] pb-3">
              <ShieldAlert className="w-5 h-5 text-[#C5A059]" />
              Texto del Modal Aviso +18
            </h3>

            <div>
              <label className="text-xs font-bold text-[#2D151B] block mb-1">
                Leyenda mostrada al ingresar por primera vez
              </label>
              <textarea
                rows={3}
                value={ageNoticeText}
                onChange={(e) => setAgeNoticeText(e.target.value)}
                className="w-full bg-[#FAF7F5] text-[#2D151B] text-xs p-3.5 rounded-xl border border-[#EFE8E3]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-bold text-xs text-white bg-[#7A1C30] hover:bg-[#94233B] shadow-soft transition uppercase"
          >
            <Save className="w-4 h-4" />
            {saving ? 'GUARDANDO CAMBIOS...' : 'GUARDAR CONFIGURACIÓN'}
          </button>
        </form>
      )}
    </div>
  );
}
