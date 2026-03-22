import Link from "next/link";

const FOOTER_LINKS = {
  consumers: [
    { href: "/consumer",           label: "Kutuları Keşfet" },
    { href: "/consumer/orders",    label: "Siparişlerim" },
    { href: "/consumer/favorites", label: "Favorilerim" },
    { href: "/consumer/nominate",  label: "İşletme Öner" },
    { href: "#download",           label: "Uygulamayı İndir" },
  ],
  merchants: [
    { href: "/merchant",          label: "İşletme Paneli" },
    { href: "/merchant/publish",  label: "Kutu Yayınla" },
    { href: "/merchant/orders",   label: "Siparişler" },
    { href: "/isletme-kayit",     label: "İşletme Olarak Kaydol" },
  ],
  legal: [
    { href: "/kvkk",                      label: "KVKK Aydınlatma Metni" },
    { href: "/kullanim-sartlari",          label: "Kullanım Şartları" },
    { href: "/cerez-politikasi",           label: "Çerez Politikası" },
    { href: "/mesafeli-satis-sozlesmesi",  label: "Mesafeli Satış" },
  ],
};

function IconInstagram() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTwitterX() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl leading-none">🌍</span>
              <span className="text-lg font-extrabold tracking-tight text-white">FoodRescue</span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              Gıda israfını önle. Tasarruf et. Yerel işletmeleri keşfet.
            </p>

            {/* Social links */}
            <div className="mt-5 flex gap-2">
              {[
                { href: "#", label: "Instagram", Icon: IconInstagram },
                { href: "#", label: "Twitter/X",  Icon: IconTwitterX },
                { href: "#", label: "LinkedIn",   Icon: IconLinkedIn },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-800 text-stone-400 hover:bg-emerald-600 hover:text-white transition-all duration-150"
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* No-fee badge */}
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-900/50 px-3 py-2 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-800">
              <span>🎉</span>
              Ücretsiz kayıt · Ücretsiz kullanım
            </div>
          </div>

          {/* Tüketiciler */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
              Tüketiciler
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.consumers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İşletmeler */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
              İşletmeler
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.merchants.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-500">
              Yasal
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:merhaba@foodrescue.com.tr"
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  merhaba@foodrescue.com.tr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-stone-800 pt-6 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
          <p className="text-xs text-stone-600">
            © {year} FoodRescue. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-stone-600 flex items-center gap-1.5">
            <span>🌱</span>
            Gıda israfına karşı, birlikte mücadele ediyoruz
          </p>
        </div>
      </div>
    </footer>
  );
}
