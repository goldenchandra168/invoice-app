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

        <footer className="border-t py-12 mt-16 text-center text-gray-600">
          <p>© 2026 Invoicely.id. Created by Golden Chandra</p>
        </footer>

      </main>
    </div>
  );
}
