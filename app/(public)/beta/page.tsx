import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beta Test — FoodRescue",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    n: "1",
    emoji: "📝",
    title: "Kayıt Ol",
    body: 'Sağ üstteki "Kayıt Ol" butonuna tıkla, e-posta ve şifre belirle. Gelen kutuna doğrulama maili gelecek — spam klasörünü de kontrol et.',
  },
  {
    n: "2",
    emoji: "🔍",
    title: "Kutuları Keşfet",
    body: "Ana sayfada sana yakın işletmelerin sürpriz kutularını gör. Kategori filtresi, fiyat filtresi ve harita görünümünü dene.",
  },
  {
    n: "3",
    emoji: "🛒",
    title: "Kutu Satın Al",
    body: 'Bir kutunun üzerine tıkla, detayları incele ve "Satın Al" diyerek devam et. Ödeme ekranında test kartını kullanabilirsin (aşağıda).',
  },
  {
    n: "4",
    emoji: "📲",
    title: "Kodu Göster",
    body: "Satın alma sonrası cüzdanında teslim kodu görünür. Bu kodu işletme sahibine gösterince sipariş tamamlanır.",
  },
];

const TEST_CARD = {
  number: "5528790000000008",
  expiry: "12/30",
  cvv: "123",
  name: "Test User",
};

export default function BetaPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Header ── */}
      <header className="bg-emerald-700 px-4 pb-10 pt-8 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            🧪 Beta Test
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            FoodRescue Beta'ya Hoş Geldin!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-emerald-100">
            Uygulamayı gerçek kullanıcılarla ilk kez test ediyoruz.
            <br />
            Karşılaştığın her hatayı veya garip davranışı bize bildirmeni rica ediyoruz.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">

        {/* ── Nasıl test ederim ── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
          <h2 className="mb-4 text-base font-extrabold text-stone-900">Nasıl test ederim?</h2>
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-black text-emerald-700">
                  {s.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{s.n}. {s.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-stone-500">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Test kartı ── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
          <h2 className="mb-1 text-base font-extrabold text-stone-900">💳 Test Kartı (Sandbox Ödeme)</h2>
          <p className="mb-4 text-xs text-stone-400">
            Gerçek ödeme yapılmaz — bu bilgileri ödeme adımında kullan.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Kart No", TEST_CARD.number],
              ["S.K.T.", TEST_CARD.expiry],
              ["CVV", TEST_CARD.cvv],
              ["Ad Soyad", TEST_CARD.name],
            ].map(([label, val]) => (
              <div key={label} className="rounded-xl bg-stone-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">{label}</p>
                <p className="mt-0.5 font-mono text-sm font-bold text-stone-900">{val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Test hesapları ── */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100">
          <h2 className="mb-1 text-base font-extrabold text-stone-900">🔑 Hazır Test Hesapları</h2>
          <p className="mb-4 text-xs text-stone-400">
            Kendi hesabını açmak yerine aşağıdaki hesapları kullanabilirsin.
          </p>
          <div className="space-y-2">
            {[
              { role: "Tüketici", email: "tuketici@foodrescue.com", pass: "consumer123", color: "bg-sky-50 text-sky-700" },
              { role: "İşletme", email: "isletme@foodrescue.com", pass: "merchant123", color: "bg-amber-50 text-amber-700" },
              { role: "Admin", email: "admin@foodrescue.com", pass: "admin123", color: "bg-purple-50 text-purple-700" },
            ].map((a) => (
              <div key={a.email} className="flex flex-wrap items-center gap-2 rounded-xl bg-stone-50 px-4 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${a.color}`}>{a.role}</span>
                <span className="font-mono text-sm text-stone-700">{a.email}</span>
                <span className="font-mono text-sm text-stone-400">/ {a.pass}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Hata bildir ── */}
        <section className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100">
          <h2 className="mb-1 text-base font-extrabold text-stone-900">🐞 Hata Bildir / Geri Bildirim</h2>
          <p className="mb-4 text-sm leading-relaxed text-stone-600">
            Bir hata gördüğünde, beklenmedik bir şey olduğunda veya önerin varsa lütfen bize haber ver.
            Her geri bildirim uygulamayı daha iyi yapıyor.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:beta@foodrescue.com.tr?subject=FoodRescue Beta Geri Bildirimi"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 transition-colors"
            >
              📧 E-posta Gönder
            </a>
            <a
              href="https://forms.gle/REPLACE_WITH_REAL_FORM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-5 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-50 transition-colors"
            >
              📋 Google Form
            </a>
          </div>
        </section>

        {/* ── Önemli notlar ── */}
        <section className="rounded-2xl bg-stone-100 p-5">
          <h2 className="mb-3 text-sm font-bold text-stone-700">⚠️ Beta Sürecinde Önemli Notlar</h2>
          <ul className="space-y-1.5 text-xs leading-relaxed text-stone-500 list-disc list-inside">
            <li>Bu bir beta test ortamıdır — veriler sıfırlanabilir.</li>
            <li>Ödeme sandbox modundadır; gerçek para çekilmez.</li>
            <li>Gösterilen işletmeler ve kutular test amaçlıdır.</li>
            <li>Lütfen kişisel bilgilerini girmekten kaçın.</li>
          </ul>
        </section>

        {/* ── CTA ── */}
        <div className="flex justify-center gap-3 pb-4">
          <Link
            href="/consumer"
            className="rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            🎁 Teste Başla
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-stone-200 bg-white px-6 py-3.5 text-sm font-bold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Ana Sayfa
          </Link>
        </div>
      </main>
    </div>
  );
}
