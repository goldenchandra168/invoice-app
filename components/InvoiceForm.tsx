'use client';

import React from 'react';
import { Invoice, InvoiceItem, DiscountType } from '@/types/invoice';
import {
  Building2,
  User,
  CreditCard,
  FileText,
  Plus,
  Trash2,
  Calendar,
  Percent,
  Receipt,
  Hash,
} from 'lucide-react';

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
}

export default function InvoiceForm({ invoice, onChange }: InvoiceFormProps) {
  // Helper to update top-level invoice fields
  const updateInvoice = (fields: Partial<Invoice>) => {
    onChange({
      ...invoice,
      ...fields,
    });
  };

  // Helper to update sender info
  const updateSender = (field: string, value: string) => {
    onChange({
      ...invoice,
      sender: {
        ...invoice.sender,
        [field]: value,
      },
    });
  };

  // Helper to update bank details
  const updateBankDetails = (field: string, value: string) => {
    onChange({
      ...invoice,
      sender: {
        ...invoice.sender,
        bankDetails: {
          ...invoice.sender.bankDetails,
          [field]: value,
        },
      },
    });
  };

  // Helper to update client info
  const updateClient = (field: string, value: string) => {
    onChange({
      ...invoice,
      client: {
        ...invoice.client,
        [field]: value,
      },
    });
  };

  // Helper to update discount
  const getDiscountType = (): DiscountType => {
    if (typeof invoice.discount === 'object' && invoice.discount !== null) {
      return invoice.discount.type;
    }
    return 'fixed';
  };

  const getDiscountValue = (): number => {
    if (typeof invoice.discount === 'number') {
      return invoice.discount;
    }
    if (typeof invoice.discount === 'object' && invoice.discount !== null) {
      return invoice.discount.value || 0;
    }
    return 0;
  };

  const updateDiscountType = (type: DiscountType) => {
    const currentValue = getDiscountValue();
    onChange({
      ...invoice,
      discount: {
        type,
        value: currentValue,
      },
    });
  };

  const updateDiscountValue = (value: number) => {
    const currentType = getDiscountType();
    onChange({
      ...invoice,
      discount: {
        type: currentType,
        value: isNaN(value) ? 0 : value,
      },
    });
  };

  // Handlers for Items
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    onChange({
      ...invoice,
      items: [...invoice.items, newItem],
    });
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) {
      // Keep at least one item, but clear fields
      onChange({
        ...invoice,
        items: [{ id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }],
      });
      return;
    }
    onChange({
      ...invoice,
      items: invoice.items.filter((item) => item.id !== id),
    });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = invoice.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    });
    onChange({
      ...invoice,
      items: updatedItems,
    });
  };

  return (
    <div className="w-full space-y-6 text-gray-800">
      {/* Informasi Invoice & Tanggal */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Receipt className="w-5 h-5 text-blue-600" /> Detail Invoice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nomor Invoice
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
                placeholder="INV/2026/001"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tanggal Terbit
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={invoice.issueDate}
                onChange={(e) => updateInvoice({ issueDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tanggal Jatuh Tempo
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-red-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => updateInvoice({ dueDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Pengirim */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Building2 className="w-5 h-5 text-blue-600" /> Info Pengirim (Bisnis Anda)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nama Bisnis / Perusahaan *
            </label>
            <input
              type="text"
              value={invoice.sender.businessName}
              onChange={(e) => updateSender('businessName', e.target.value)}
              placeholder="PT Solusi Digital"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email Bisnis
            </label>
            <input
              type="email"
              value={invoice.sender.email}
              onChange={(e) => updateSender('email', e.target.value)}
              placeholder="email@bisnis.com"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              value={invoice.sender.phone}
              onChange={(e) => updateSender('phone', e.target.value)}
              placeholder="+62 812-xxxx-xxxx"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Alamat Lengkap
            </label>
            <input
              type="text"
              value={invoice.sender.address}
              onChange={(e) => updateSender('address', e.target.value)}
              placeholder="Jl. Merdeka No. 10, Jakarta"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Info Rekening Bank */}
        <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Rekening Bank Pembayaran
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Nama Bank
              </label>
              <input
                type="text"
                value={invoice.sender.bankDetails.bankName}
                onChange={(e) => updateBankDetails('bankName', e.target.value)}
                placeholder="BCA / Mandiri / BNI"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Nomor Rekening
              </label>
              <input
                type="text"
                value={invoice.sender.bankDetails.accountNumber}
                onChange={(e) => updateBankDetails('accountNumber', e.target.value)}
                placeholder="1234567890"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Atas Nama (Pemilik Rekening)
              </label>
              <input
                type="text"
                value={invoice.sender.bankDetails.accountHolder}
                onChange={(e) => updateBankDetails('accountHolder', e.target.value)}
                placeholder="Nama Pemilik Rekening"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Klien */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <User className="w-5 h-5 text-blue-600" /> Info Klien (Penerima Tagihan)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nama Klien *
            </label>
            <input
              type="text"
              value={invoice.client.name}
              onChange={(e) => updateClient('name', e.target.value)}
              placeholder="Nama Klien"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nama Perusahaan (Opsional)
            </label>
            <input
              type="text"
              value={invoice.client.company}
              onChange={(e) => updateClient('company', e.target.value)}
              placeholder="CV / PT Klien"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email Klien
            </label>
            <input
              type="email"
              value={invoice.client.email}
              onChange={(e) => updateClient('email', e.target.value)}
              placeholder="klien@email.com"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nomor WhatsApp Klien
            </label>
            <input
              type="text"
              value={invoice.client.phone}
              onChange={(e) => updateClient('phone', e.target.value)}
              placeholder="+62 856-xxxx-xxxx"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Daftar Item Dinamis */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" /> Daftar Item / Layanan
          </h2>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Item
          </button>
        </div>

        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center gap-3"
            >
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1 md:hidden">
                  Deskripsi
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  placeholder={`Deskripsi item #${index + 1}`}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-full md:w-28 flex-shrink-0">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1 md:hidden">
                  Kuantitas (Qty)
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity || ''}
                  onChange={(e) =>
                    handleItemChange(item.id, 'quantity', Math.max(0, parseInt(e.target.value) || 0))
                  }
                  placeholder="Qty"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-full md:w-44 flex-shrink-0">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1 md:hidden">
                  Harga Satuan (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={item.unitPrice || ''}
                  onChange={(e) =>
                    handleItemChange(item.id, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  placeholder="Harga Satuan"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-full md:w-auto flex justify-end md:justify-center flex-shrink-0 pt-1 md:pt-0">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Hapus item"
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-dashed border-blue-400 text-blue-600 font-semibold text-xs rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Baris Item Baru
          </button>
        </div>
      </section>

      {/* Diskon & PPN */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Percent className="w-5 h-5 text-blue-600" /> Potongan & Pajak
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diskon */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Tipe & Nilai Diskon
            </label>
            <div className="flex gap-2">
              <select
                value={getDiscountType()}
                onChange={(e) => updateDiscountType(e.target.value as DiscountType)}
                className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fixed">Nominal (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
              <input
                type="number"
                min="0"
                value={getDiscountValue() || ''}
                onChange={(e) => updateDiscountValue(parseFloat(e.target.value) || 0)}
                placeholder={getDiscountType() === 'percentage' ? 'Contoh: 10' : 'Contoh: 50000'}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Persentase PPN */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Pajak PPN (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={invoice.taxRate ?? 0}
                onChange={(e) => updateInvoice({ taxRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                placeholder="11"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                %
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Catatan Tambahan */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
          <FileText className="w-5 h-5 text-blue-600" /> Catatan Tambahan
        </h2>
        <div>
          <textarea
            rows={3}
            value={invoice.notes || ''}
            onChange={(e) => updateInvoice({ notes: e.target.value })}
            placeholder="Tambahkan catatan pembayaran, syarat & ketentuan, atau instruksi transfer..."
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
        </div>
      </section>
    </div>
  );
}
