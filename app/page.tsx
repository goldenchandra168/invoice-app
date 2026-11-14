import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">Invoicely.id</div>
          <Link href="/editor" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
            Buat Invoice
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Tagih Klien Anda <span className="text-blue-600">Lebih Cepat</span>.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Solusi invoice gratis untuk freelancer & UMKM Indonesia. Buat invoice profesional dalam hitungan detik.
          </p>
          <Link href="/editor" className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Buat Invoice Gratis Sekarang
          </Link>
        </header>

        <section className="grid md:grid-cols-3 gap-12 mb-24">
          {[
            { title: "Sangat Cepat", desc: "Buat invoice hanya dalam 1 menit." },
            { title: "Desain Profesional", desc: "Tampilan bersih & siap cetak." },
            { title: "Kirim via WhatsApp", desc: "Langsung ke klien tanpa ribet." }
          ].map((f, i) => (
            <div key={i} className="p-8 border border-gray-100 rounded-3xl bg-gray-50">
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Pilihan Paket</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 border border-gray-200 rounded-3xl text-center">
              <h3 className="text-xl font-bold mb-2">Paket Gratis</h3>
              <p className="text-4xl font-black mb-6">Rp0</p>
              <p className="text-gray-600 mb-8">Untuk kebutuhan dasar</p>
              <Link href="/editor" className="block w-full py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition">
                Mulai Gratis
              </Link>
            </div>
            <div className="p-8 border-2 border-blue-600 rounded-3xl text-center bg-blue-50">
              <h3 className="text-xl font-bold mb-2">Paket Pro</h3>
              <p className="text-4xl font-black mb-6">Rp49.000<span className="text-sm font-normal text-gray-500">/bulan</span></p>
              <p className="text-gray-600 mb-8">Fitur lengkap & kustomisasi</p>
              <button className="block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                Pilih Paket Pro
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
