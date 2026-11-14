'use client';

import React, { useState, useEffect } from 'react';
import { Invoice } from '@/types/invoice';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview, { formatRupiah, formatDate } from '@/components/InvoicePreview';
import { FilePlus, Download, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'invoice_app_data';

const initialInvoiceData: Invoice = {
  invoiceNumber: 'INV/2026/11/001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
    phone: '085698765432',
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
  taxRate: 11,
  notes: 'Pembayaran harap ditransfer sesuai dengan total akhir yang tertera. Cantumkan nomor invoice pada catatan transfer.',
};

export default function EditorPage() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoiceData);
  const [accentColor, setAccentColor] = useState('blue');
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  
  useEffect(() => {
    const savedColor = localStorage.getItem('invoice_accent_color');
    const savedLogo = localStorage.getItem('invoice_logo');
    if (savedColor) setAccentColor(savedColor);
    if (savedLogo) setLogoBase64(savedLogo);
  }, []);

  useEffect(() => {
    localStorage.setItem('invoice_accent_color', accentColor);
    if (logoBase64) localStorage.setItem('invoice_logo', logoBase64);
  }, [accentColor, logoBase64]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setInvoice(parsed);
      }
    } catch (e) {
      console.error('Gagal membaca data dari localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when invoice state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
      } catch (e) {
        console.error('Gagal menyimpan ke localStorage:', e);
      }
    }
  }, [invoice, isLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Reset / Buat Baru
  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin membuat invoice baru? Form klien dan item akan dikosongkan.')) {
      const dateNow = new Date();
      const year = dateNow.getFullYear();
      const month = String(dateNow.getMonth() + 1).padStart(2, '0');
      const randomNum = Math.floor(100 + Math.random() * 900);
      const nextInvoiceNumber = `INV/${year}/${month}/${randomNum}`;

      const todayStr = dateNow.toISOString().split('T')[0];
      const dueDateStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const newInvoice: Invoice = {
        invoiceNumber: nextInvoiceNumber,
        issueDate: todayStr,
        dueDate: dueDateStr,
        sender: invoice.sender, // Menjaga data bisnis/pengirim milik pengguna
        client: {
          name: '',
          company: '',
          email: '',
          phone: '',
        },
        items: [
          {
            id: Date.now().toString(),
            description: '',
            quantity: 1,
            unitPrice: 0,
          },
        ],
        discount: {
          type: 'fixed',
          value: 0,
        },
        taxRate: 11,
        notes: 'Pembayaran harap ditransfer sesuai dengan total akhir yang tertera. Cantumkan nomor invoice pada catatan transfer.',
      };

      setInvoice(newInvoice);
      showToast('Form invoice baru berhasil dibuat!');
    }
  };

  // Calculate Grand Total for WhatsApp Message
  const calculateGrandTotal = (): number => {
    const subtotal = (invoice.items || []).reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
      0
    );

    let discountAmount = 0;
    if (typeof invoice.discount === 'number') {
      discountAmount = invoice.discount;
    } else if (invoice.discount && typeof invoice.discount === 'object') {
      if (invoice.discount.type === 'percentage') {
        discountAmount = (subtotal * (invoice.discount.value || 0)) / 100;
      } else {
        discountAmount = invoice.discount.value || 0;
      }
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const ppnAmount = (subtotalAfterDiscount * (invoice.taxRate || 0)) / 100;
    return subtotalAfterDiscount + ppnAmount;
  };

  // Helper formatting nomor HP WhatsApp (mengubah 08xx menjadi 628xx)
  const formatWhatsAppPhone = (phone: string): string => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+62')) {
      cleaned = cleaned.substring(1);
    } else if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  // 2. Tagih via WhatsApp
  const handleWhatsApp = () => {
    const rawPhone = invoice.client?.phone || '';
    const formattedPhone = formatWhatsAppPhone(rawPhone);

    if (!formattedPhone) {
      alert('Silakan isi Nomor WhatsApp Klien terlebih dahulu pada form info klien.');
      return;
    }

    const totalStr = formatRupiah(calculateGrandTotal());
    const dueDateFormatted = formatDate(invoice.dueDate);
    const clientName = invoice.client?.name || 'Bapak/Ibu';
    const clientCompany = invoice.client?.company ? ` (${invoice.client.company})` : '';
    const businessName = invoice.sender?.businessName || 'kami';
    const bank = invoice.sender?.bankDetails;

    const message = `Halo ${clientName}${clientCompany},

Berikut kami sampaikan rincian tagihan invoice Anda:

📌 *Nomor Invoice:* ${invoice.invoiceNumber}
💰 *Total Tagihan:* ${totalStr}
📅 *Tanggal Jatuh Tempo:* ${dueDateFormatted}

*Detail Rekening Pembayaran:*
- Bank: ${bank?.bankName || '-'}
- No. Rekening: ${bank?.accountNumber || '-'}
- Atas Nama: ${bank?.accountHolder || '-'}

Mohon untuk melakukan konfirmasi jika pembayaran telah ditransfer. Terima kasih atas kerja sama Anda.

Salam hangat,
*${businessName}*`;

    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // 3. Download PDF
  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById('invoice-preview');
    if (!element) {
      alert('Elemen preview invoice tidak ditemukan.');
      return;
    }

    setIsDownloading(true);
    try {
        const html2pdf = (await import('html2pdf.js')).default;
      const cleanFileName = (invoice.invoiceNumber || 'Invoice')
        .replace(/[^a-zA-Z0-9-_]/g, '_');

        const opt = {
          margin: [10, 10, 10, 10] as [number, number, number, number],
          filename: `${cleanFileName}.pdf`,
          image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const,
        },
      };

      await html2pdf().set(opt).from(element).save();
      showToast('PDF berhasil diunduh!');
    } catch (error) {
      console.error('Gagal mengunduh PDF:', error);
      alert('Gagal mengunduh PDF. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-gray-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      // UI untuk kustomisasi
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4 flex gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Warna Aksen</label>
          <div className="flex gap-2">
            {['blue', 'emerald', 'black', 'purple'].map(color => (
              <button key={color} onClick={() => setAccentColor(color)} className={`w-6 h-6 rounded-full ${color === 'blue' ? 'bg-blue-600' : color === 'emerald' ? 'bg-emerald-600' : color === 'black' ? 'bg-black' : 'bg-purple-600'} ${accentColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Logo Bisnis</label>
          <input type="file" onChange={handleLogoUpload} className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Generator Invoice</h1>
              <p className="text-xs text-gray-500">Buat, Pratinjau & Unduh Invoice Profesional</p>
            </div>
          </div>

          {/* 3 Tombol Aksi Utama */}
          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-end">
            {/* Reset / Buat Baru */}
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl border border-gray-300 transition-colors shadow-sm"
              title="Mengosongkan form untuk invoice baru"
            >
              <FilePlus className="w-4 h-4 text-gray-500" />
              <span>Reset / Buat Baru</span>
            </button>

            {/* Tagih via WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
              title="Kirim pesan penagihan ke WhatsApp klien"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tagih via WA</span>
            </button>

            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
              title="Unduh Invoice sebagai file PDF"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Mengunduh...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Split Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sisi Kiri: Form Input */}
          <div className="w-full">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800">Form Editor Invoice</h2>
              <p className="text-xs text-gray-500">
                Isi rincian di bawah ini. Hasil perubahan akan diperbarui secara real-time pada pratinjau.
              </p>
            </div>
            <InvoiceForm invoice={invoice} onChange={setInvoice} />
          </div>

          {/* Sisi Kanan: Live Preview */}
          <div className="w-full lg:sticky lg:top-20">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Pratinjau Live (A4)</h2>
                <p className="text-xs text-gray-500">Tampilan hasil akhir invoice yang siap dicetak/diunduh</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Preview
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <InvoicePreview 
      invoice={invoice} 
      accentColor={accentColor} 
      logo={logoBase64} 
    />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500 mt-8">
        <p>© 2026 Generator Invoice App. Dibuat untuk kemudahan bisnis Anda.</p>
      </footer>
    </div>
  );
}
