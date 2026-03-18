import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-lg font-extrabold text-white">
              🌍 FoodRescue
            </p>
            <p className="mt-2 text-sm text-stone-400 leading-relaxed">
              Gıda israfını önle. Tasarruf et. Yerel işletmeleri keşfet.
            </p>
            {/* Social */}
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-sm hover:bg-emerald-600 transition-colors"
              >
                📸
              </a>
              <a
                href="#"
                aria-label="Twitter/X"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-sm hover:bg-emerald-600 transition-colors"
              >
                🐦
              </a>
            </div>
          </div>

          {/* Tüketiciler */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Tüketiciler
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/consumer" className="hover:text-white transition-colors">Kutuları Keşfet</Link></li>
              <li><Link href="/consumer/orders" className="hover:text-white transition-colors">Siparişlerim</Link></li>
              <li><Link href="/consumer/nominate" className="hover:text-white transition-colors">İşletme Öner</Link></li>
              <li><a href="#download" className="hover:text-white transition-colors">Uygulamayı İndir</a></li>
            </ul>
          </div>

          {/* İşletmeler */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              İşletmeler
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/merchant" className="hover:text-white transition-colors">İşletme Paneli</Link></li>
              <li><Link href="/merchant/publish" className="hover:text-white transition-colors">Kutu Yayınla</Link></li>
              <li><Link href="/merchant/orders" className="hover:text-white transition-colors">Siparişler</Link></li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Yasal
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/kvkk" className="hover:text-white transition-colors">KVKK Aydınlatma Metni</Link></li>
              <li><Link href="/kullanim-sartlari" className="hover:text-white transition-colors">Kullanım Şartları</Link></li>
              <li><Link href="/cerez-politikasi" className="hover:text-white transition-colors">Çerez Politikası</Link></li>
              <li><Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
              <li>
                <a
                  href="mailto:merhaba@foodrescue.com.tr"
                  className="hover:text-white transition-colors"
                >
                  merhaba@foodrescue.com.tr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-stone-800 pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between text-xs text-stone-500">
          <p>© {year} FoodRescue. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-1">
            <span>🌱</span> Gıda israfına karşı, birlikte
          </p>
        </div>
      </div>
    </footer>
  );
}
