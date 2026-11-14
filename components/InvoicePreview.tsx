import React from 'react';
import { Invoice } from '@/types/invoice';
import { Building2, User, Mail, Phone, CreditCard, Calendar, FileText } from 'lucide-react';

interface InvoicePreviewProps {
  invoice?: Invoice;
}

const defaultInvoice: Invoice = {
  invoiceNumber: 'INV/2026/11/001',
  issueDate: '2026-11-15',
  dueDate: '2026-11-29',
  sender: {
    businessName: 'PT Solusi Digital Kreatif',
    address: 'Jl. Jendral Sudirman No. 45, Jakarta Selatan, 12190',
    email: 'finance@solusidigital.id',
    phone: '+62 812-3456-7890',
    bankDetails: {
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '123-456-7890',
      accountHolder: 'PT Solusi Digital Kreatif',
    },
  },
  client: {
    name: 'Budi Santoso',
    company: 'CV Maju Bersama',
    email: 'budi@majubersama.com',
    phone: '+62 856-9876-5432',
  },
  items: [
    {
      id: '1',
      description: 'Pengembangan Website E-Commerce',
      quantity: 1,
      unitPrice: 15000000,
    },
    {
      id: '2',
      description: 'Desain UI/UX & Wireframing',
      quantity: 1,
      unitPrice: 5000000,
    },
    {
      id: '3',
      description: 'Pemeliharaan Server & Cloud (3 Bulan)',
      quantity: 3,
      unitPrice: 1000000,
    },
  ],
  discount: {
    type: 'fixed',
    value: 1000000,
  },
  taxRate: 11, // PPN 11%
  notes: 'Pembayaran harap ditransfer sesuai dengan total akhir yang tertera. Cantumkan nomor invoice pada catatan transfer.',
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

interface InvoicePreviewProps {
  invoice?: Invoice;
  accentColor?: string;
  logo?: string | null;
}

export default function InvoicePreview({ invoice = defaultInvoice, accentColor = "blue", logo = null }: InvoicePreviewProps) {
  const accentClass = `text-${accentColor}-600`;
  const bgAccentClass = `bg-${accentColor}-600`;
  const borderAccentClass = `border-${accentColor}-600`;

  const {
    invoiceNumber,
    issueDate,
    dueDate,
    sender,
    client,
    items = [],
    discount = 0,
    taxRate = 0,
    notes,
  } = invoice;

  // Calculate Subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );

  // Calculate Discount Value
  let discountAmount = 0;
  let discountLabel = '';
  if (typeof discount === 'number') {
    discountAmount = discount;
    if (discountAmount > 0) {
      discountLabel = `Diskon (${formatRupiah(discountAmount)})`;
    }
  } else if (discount && typeof discount === 'object') {
    if (discount.type === 'percentage') {
      discountAmount = (subtotal * (discount.value || 0)) / 100;
      discountLabel = `Diskon (${discount.value}%)`;
    } else {
      discountAmount = discount.value || 0;
      discountLabel = `Diskon Nominal`;
    }
  }

  // Calculate Subtotal After Discount
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

  // Calculate PPN
  const ppnAmount = (subtotalAfterDiscount * (taxRate || 0)) / 100;

  // Calculate Grand Total
  const grandTotal = subtotalAfterDiscount + ppnAmount;

  return (
    <div className="w-full flex justify-center p-4 bg-gray-100 min-h-screen text-gray-800">
      {/* A4 Container Sheet */}
      <div
        id="invoice-preview"
        className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-xl rounded-sm p-8 sm:p-12 flex flex-col justify-between text-sm leading-relaxed border border-gray-200 print:shadow-none print:p-0 print:border-none print:w-full print:max-w-none"
      >
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-8 mb-8 border-b border-gray-200 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-9 h-9 rounded-lg ${bgAccentClass} text-white flex items-center justify-center font-bold text-lg`}>
                  {logo ? <img src={logo} className="w-full h-full object-cover rounded-lg" alt="logo" /> : sender?.businessName?.charAt(0) || 'I'}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {sender?.businessName || 'Nama Bisnis'}
                </h1>
              </div>
              <p className="text-gray-600 max-w-sm whitespace-pre-line text-xs sm:text-sm">
                {sender?.address || 'Alamat Perusahaan'}
              </p>
              <div className="mt-3 text-xs text-gray-500 space-y-1">
                {sender?.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{sender.email}</span>
                  </p>
                )}
                {sender?.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>WA: {sender.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right flex flex-col sm:items-end">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                FAKTUR / INVOICE
              </span>
              <h2 className="text-xl font-bold text-gray-800 tracking-wide mb-3">
                #{invoiceNumber || 'INV-000'}
              </h2>
              <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100 min-w-[200px]">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Tanggal Terbit:</span>
                  <span className="font-medium text-gray-800">{formatDate(issueDate)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Jatuh Tempo:</span>
                  <span className="font-medium text-red-600">{formatDate(dueDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client & Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" /> Tagihan Kepada:
              </h3>
              <p className="font-bold text-gray-900 text-base">{client?.name || '-'}</p>
              {client?.company && (
                <p className="text-sm font-semibold text-gray-700 mt-0.5">{client.company}</p>
              )}
              <div className="mt-3 text-xs text-gray-600 space-y-1">
                {client?.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{client.email}</span>
                  </p>
                )}
                {client?.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>WA: {client.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" /> Info Pembayaran:
                </h3>
                <div className="text-xs space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-semibold text-gray-900">
                      {sender?.bankDetails?.bankName || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. Rekening:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {sender?.bankDetails?.accountNumber || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Atas Nama:</span>
                    <span className="font-medium text-gray-900">
                      {sender?.bankDetails?.accountHolder || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4 rounded-tl-lg">Deskripsi Item</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Harga Satuan</th>
                  <th className="py-3 px-4 text-right rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {items.length > 0 ? (
                  items.map((item, index) => {
                    const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
                    return (
                      <tr key={item.id || index} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-4 font-medium text-gray-800">
                          {item.description || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-4 text-right text-gray-600">
                          {formatRupiah(item.unitPrice || 0)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-gray-900">
                          {formatRupiah(itemTotal)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400 italic">
                      Tidak ada item invoice
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Calculations / Summary */}
          <div className="flex flex-col sm:flex-row justify-end mb-8">
            <div className="w-full sm:w-80 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 px-2 text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">{formatRupiah(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between py-1.5 px-2 text-emerald-600 bg-emerald-50 rounded">
                  <span>{discountLabel || 'Diskon'}</span>
                  <span className="font-semibold">-{formatRupiah(discountAmount)}</span>
                </div>
              )}

              {taxRate > 0 && (
                <div className="flex justify-between py-1.5 px-2 text-gray-600">
                  <span>PPN ({taxRate}%)</span>
                  <span className="font-semibold text-gray-800">{formatRupiah(ppnAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-3 px-3 bg-blue-600 text-white font-bold rounded-lg text-base shadow-sm mt-3">
                <span>Total Akhir</span>
                <span>{formatRupiah(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Notes */}
        <div className="pt-6 border-t border-gray-200">
          {notes && (
            <div className="mb-6 p-4 bg-amber-50/60 rounded-lg border border-amber-200/60">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" /> Catatan Tambahan:
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed whitespace-pre-line">{notes}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
            <p>Terima kasih atas kerja sama Anda.</p>
            <p>Invoice ini dibuat secara otomatis dan sah tanpa tanda tangan basah.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
