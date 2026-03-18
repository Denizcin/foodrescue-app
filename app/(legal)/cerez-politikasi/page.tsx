import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çerez Politikası — FoodRescue",
};

export default function CerezPolitikasiPage() {
  return (
    <article className="prose prose-stone max-w-none">
      <h1 className="text-2xl font-extrabold text-stone-900">Çerez Politikası</h1>
      <p className="text-sm text-stone-500">Son güncelleme: 16 Mart 2026</p>

      <Section title="1. Çerez Nedir?">
        <p>
          Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza
          yerleştirilen küçük metin dosyalarıdır. Çerezler, site deneyiminizi kişiselleştirmek,
          oturumunuzu yönetmek ve kullanım istatistiklerini toplamak amacıyla kullanılır.
        </p>
      </Section>

      <Section title="2. Kullandığımız Çerez Türleri">
        <h3 className="mt-4 font-semibold text-stone-800">2.1 Zorunlu Çerezler</h3>
        <p>
          Bu çerezler platformun temel işlevleri için gereklidir ve devre dışı bırakılamazlar.
          Oturum yönetimi, güvenlik doğrulaması ve tercih kaydı bu kapsamda yer alır.
        </p>
        <ul>
          <li><code>next-auth.session-token</code> — Oturum bilgisini güvenli şekilde saklar</li>
          <li><code>next-auth.csrf-token</code> — CSRF saldırılarına karşı koruma sağlar</li>
          <li><code>foodrescue_cookie_consent</code> — Çerez tercihlerinizi saklar</li>
        </ul>

        <h3 className="mt-4 font-semibold text-stone-800">2.2 Analitik Çerezler (İsteğe Bağlı)</h3>
        <p>
          Bu çerezler, platformun nasıl kullanıldığını anlamamıza yardımcı olur.
          Toplanan veriler anonim veya takma adlı olup bireysel kullanıcıları tanımlamaz.
        </p>
        <ul>
          <li>Ziyaret edilen sayfa istatistikleri</li>
          <li>Oturum süreleri ve hata oranları</li>
        </ul>

        <h3 className="mt-4 font-semibold text-stone-800">2.3 İşlevsel Çerezler (İsteğe Bağlı)</h3>
        <p>
          Dil tercihi, konum filtreleri ve kullanıcı arayüzü ayarları gibi tercihlerinizi
          saklamak amacıyla kullanılır.
        </p>
      </Section>

      <Section title="3. Üçüncü Taraf Çerezleri">
        <p>
          Ödeme altyapısı sağlayıcımız <strong>iyzico</strong>, ödeme sayfasında kendi
          güvenlik çerezlerini kullanabilir. Bu çerezler iyzico&apos;nun gizlilik politikasına
          tabidir.
        </p>
      </Section>

      <Section title="4. Çerezleri Nasıl Yönetebilirsiniz?">
        <p>
          Tarayıcı ayarlarınızdan çerezleri yönetebilir, engelleyebilir veya silebilirsiniz.
          Ancak zorunlu çerezlerin engellenmesi durumunda platforma giriş yapmak
          veya sipariş vermek mümkün olmayabilir.
        </p>
        <p>Popüler tarayıcılar için çerez yönetim bağlantıları:</p>
        <ul>
          <li>Google Chrome: Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
          <li>Mozilla Firefox: Seçenekler → Gizlilik ve Güvenlik</li>
          <li>Safari: Tercihler → Gizlilik</li>
          <li>Microsoft Edge: Ayarlar → Çerezler ve Site İzinleri</li>
        </ul>
      </Section>

      <Section title="5. Onay ve Tercih Değişikliği">
        <p>
          Platformu ilk ziyaretinizde çerez tercihlerinizi belirlemenizi isteyen bir bildirim
          görüntülenmektedir. <strong>"Kabul Et"</strong> seçeneği tüm çerezlere,
          <strong>"Sadece Gerekli Çerezler"</strong> seçeneği ise yalnızca zorunlu çerezlere
          onay verir.
        </p>
        <p>
          Tercihlerinizi değiştirmek için tarayıcı çerezlerini temizleyerek sayfayı yeniden
          ziyaret edebilirsiniz.
        </p>
      </Section>

      <Section title="6. İletişim">
        <p>
          Çerez politikamıza ilişkin sorularınız için{" "}
          <strong>kvkk@foodrescue.com.tr</strong> adresine e-posta gönderebilirsiniz.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-bold text-stone-800">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-stone-700">{children}</div>
    </section>
  );
}
