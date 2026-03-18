import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi — FoodRescue",
};

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <article className="prose prose-stone max-w-none">
      <h1 className="text-2xl font-extrabold text-stone-900">
        Mesafeli Satış Sözleşmesi
      </h1>
      <p className="text-sm text-stone-500">
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
        kapsamında hazırlanmıştır. Son güncelleme: 16 Mart 2026
      </p>

      <Section title="Madde 1 — Taraflar">
        <p>
          <strong>SATICI / ARACILIK HİZMET SAĞLAYICISI</strong>
        </p>
        <ul>
          <li>Unvan: FoodRescue Teknoloji A.Ş.</li>
          <li>Adres: İstanbul, Türkiye</li>
          <li>E-posta: destek@foodrescue.com.tr</li>
          <li>Platform: foodrescue.com.tr</li>
        </ul>
        <p className="mt-3">
          <strong>ALICI / TÜKETİCİ</strong>
        </p>
        <p>
          Platforma kayıtlı kullanıcı hesabında kayıtlı ad, soyad ve iletişim bilgilerine
          sahip kişidir.
        </p>
      </Section>

      <Section title="Madde 2 — Sözleşmenin Konusu">
        <p>
          Bu sözleşme, Alıcı&apos;nın Platform üzerinden satın aldığı <strong>Sürpriz Kutu</strong>
          ürününe ilişkin tarafların hak ve yükümlülüklerini düzenlemektedir. Sürpriz Kutu, gıda
          işletmelerinin günün sonunda artan ürünlerini kapsayan ve içeriği önceden belirlenmemiş
          bir gıda paketidir.
        </p>
      </Section>

      <Section title="Madde 3 — Ürün Bilgileri">
        <ul>
          <li><strong>Ürün:</strong> Sürpriz Kutu (içerik her gün değişiklik gösterir)</li>
          <li><strong>Miktar:</strong> Sipariş anında seçilen adet</li>
          <li><strong>Birim Fiyat:</strong> Platform sipariş ekranında görüntülenen indirimli fiyat (KDV dahil)</li>
          <li><strong>Ödeme Yöntemi:</strong> Kredi/banka kartı (iyzico altyapısı)</li>
          <li><strong>Teslim Yöntemi:</strong> GEL-AL — Alıcı, belirtilen teslim alma penceresi içinde işletmeden bizzat teslim alır.</li>
        </ul>
      </Section>

      <Section title="Madde 4 — Ödeme">
        <p>
          Ödeme, sipariş onayı anında tahsil edilir. Kart bilgileri yalnızca iyzico güvenli
          ödeme altyapısı üzerinden işlenir; FoodRescue sunucularında kart bilgisi saklanmaz.
        </p>
        <p>
          Satış Fiyatı = İndirimli Kutu Fiyatı × Adet olarak hesaplanır ve sipariş özetinde
          gösterilir.
        </p>
      </Section>

      <Section title="Madde 5 — Teslim (Gel-Al) Koşulları">
        <ul>
          <li>
            Her sipariş için Platform üzerinde bir <strong>Teslim Alma Penceresi</strong>
            belirtilmektedir (örn. 17:00 – 19:00).
          </li>
          <li>
            Alıcı, bu pencere içinde işletme adresine giderek teslim alma kodunu
            göstermek suretiyle ürünü teslim alır.
          </li>
          <li>
            Teslim alma penceresi dolduktan sonra ürün teslim alınamazsa Alıcı herhangi
            bir iade talebinde bulunamaz.
          </li>
          <li>
            Platform teslimat (kargo veya kurye) hizmeti sunmamaktadır.
          </li>
        </ul>
      </Section>

      <Section title="Madde 6 — Cayma Hakkı">
        <p>
          6502 sayılı Kanun&apos;un 48. maddesi ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin
          15/1-c bendi uyarınca; hızla bozulma tehlikesi olan ya da son kullanma tarihi
          geçme ihtimali bulunan mallar cayma hakkı kapsamı dışındadır.
        </p>
        <p>
          Sürpriz Kutular gıda ürünü niteliği taşıdığından Alıcı, 14 günlük yasal cayma
          hakkını bu sözleşme kapsamında kullanamaz.
        </p>
        <p>
          Ancak aşağıdaki durumlarda Alıcı tam iade hakkına sahiptir:
        </p>
        <ul>
          <li>Teslim alma penceresi sona ermeden önce siparişini iptal etmesi (kutu teslim alınmamışsa)</li>
          <li>İşletmenin ürünleri tükenmiş olması veya olağanüstü bir sebeple hizmet verememesi</li>
        </ul>
      </Section>

      <Section title="Madde 7 — Şikâyet ve Uyuşmazlık">
        <p>
          Şikâyetleriniz için <strong>destek@foodrescue.com.tr</strong> adresine
          başvurabilirsiniz. Uyuşmazlıklar öncelikle FoodRescue müşteri hizmetleri kanalıyla
          çözülmeye çalışılır.
        </p>
        <p>
          Bu sözleşmeden doğan uyuşmazlıklarda 6502 sayılı Kanun kapsamında Tüketici Hakem
          Heyetleri ve Tüketici Mahkemeleri yetkilidir. Yasal başvuru sınırının altında kalan
          uyuşmazlıklarda Tüketici Hakem Heyetine başvuru zorunludur.
        </p>
      </Section>

      <Section title="Madde 8 — Yürürlük">
        <p>
          Bu sözleşme, Alıcı&apos;nın sipariş tamamlama ekranında <em>"Mesafeli Satış
          Sözleşmesi&apos;ni okudum ve kabul ediyorum"</em> onay kutucuğunu işaretlemesiyle
          karşılıklı rıza ile kurulmuş ve yürürlüğe girmiş sayılır.
        </p>
        <p>
          Uygulanacak hukuk: <strong>Türk Hukuku</strong>. Yetkili yargı yeri:
          <strong> İstanbul Tüketici Mahkemeleri</strong>.
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
