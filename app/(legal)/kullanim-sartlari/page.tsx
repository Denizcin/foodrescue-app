import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları — FoodRescue",
};

export default function KullanimSartlariPage() {
  return (
    <article className="prose prose-stone max-w-none">
      <h1 className="text-2xl font-extrabold text-stone-900">Kullanım Şartları</h1>
      <p className="text-sm text-stone-500">Son güncelleme: 16 Mart 2026</p>

      <Section title="1. Taraflar ve Kapsam">
        <p>
          Bu Kullanım Şartları, <strong>FoodRescue Teknoloji A.Ş.</strong> ("FoodRescue" veya "Şirket")
          tarafından işletilen <strong>foodrescue.com.tr</strong> alan adlı platform ile bu platformun
          mobil uygulamalarının ("Platform") kullanımına ilişkin koşulları düzenlemektedir.
        </p>
        <p>
          Platformu kullanarak bu şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan
          etmiş olursunuz. Şartları kabul etmiyorsanız Platformu kullanmayınız.
        </p>
      </Section>

      <Section title="2. Hizmet Tanımı">
        <p>
          FoodRescue, gıda israfını önlemek amacıyla gıda işletmelerinin (fırın, restoran, kafe,
          market vb.) günün sonunda artan ürünlerini indirimli <strong>Sürpriz Kutu</strong> olarak
          tüketicilere sunduğu bir aracı platformdur.
        </p>
        <p>
          FoodRescue, satıcı işletme ile alıcı tüketici arasında aracılık yapar;
          satıcı işletme değildir ve kutuların içeriğinden doğrudan sorumlu tutulamaz.
        </p>
      </Section>

      <Section title="3. Sürpriz Kutu Niteliği">
        <p>
          Tüm kutular <strong>sürpriz</strong> niteliktedir. Kutu içeriği her gün, her işletmenin
          o günün sonunda kalan ürünlerine göre değişiklik gösterir. Satın alma öncesinde veya
          satın alma sırasında belirli bir içerik garanti edilmez.
        </p>
        <p>
          Tüketici, kutunun içeriğinin önceden bilinmediğini ve bilgi ile onay eksiksiz olarak
          kabul ederek satın alma işlemini tamamlar.
        </p>
        <p>
          Ürünlerde herhangi bir alerjen bulunabileceğini ve alerjik reaksiyon yaşayabilecek
          kişilerin satın alma öncesinde işletme ile doğrudan iletişime geçmesi gerektiğini
          hatırlatırız.
        </p>
      </Section>

      <Section title="4. Gel-Al (Teslim) Modeli">
        <p>
          FoodRescue platformunda <strong>teslimat hizmeti bulunmamaktadır</strong>.
          Tüm siparişler, belirlenen teslim alma penceresinde bizzat işletmeden teslim alınır.
        </p>
        <ul>
          <li>Her kutu için bir teslim alma zaman aralığı ("Teslim Alma Penceresi") belirtilmektedir.</li>
          <li>Teslim alma penceresi sona erdikten sonra kutu iptal edilmiş sayılır ve alınamaz.</li>
          <li>İşletme, teslim alma penceresinin dışında ürünleri saklamakla yükümlü değildir.</li>
        </ul>
      </Section>

      <Section title="5. Ödeme Koşulları">
        <ul>
          <li>Tüm ödemeler peşin olarak ve sipariş anında alınır.</li>
          <li>Ödemeler iyzico altyapısı aracılığıyla güvenli şekilde işlenir; kart bilgileri FoodRescue sunucularında saklanmaz.</li>
          <li>Fiyatlar Türk Lirası (₺) cinsindendir ve KDV dahildir.</li>
          <li>FoodRescue, sipariş tutarı üzerinden bir komisyon payı alır; bu oran ödeme ekranında gösterilmez ancak işletme ile sözleşmede belirtilir.</li>
        </ul>
      </Section>

      <Section title="6. İptal ve İade Politikası">
        <ul>
          <li>
            <strong>Tüketici İptali:</strong> Sipariş oluşturulduktan sonra, teslim alma
            penceresi sona ermeden önce iptal edilebilir. İade, ödeme yönteminize bağlı
            olarak 3–14 iş günü içinde gerçekleşir.
          </li>
          <li>
            <strong>Teslim Alınmayan Siparişler:</strong> Teslim alma penceresi dolduktan
            sonra teslim alınmayan siparişler için iade yapılmaz.
          </li>
          <li>
            <strong>İşletme Kaynaklı İptal:</strong> İşletmenin ürünleri tükenmiş veya
            olağanüstü bir durum nedeniyle hizmet veremiyorsa FoodRescue tam iade yapar.
          </li>
          <li>
            <strong>Cayma Hakkı:</strong> Gıda ürünleri niteliği gereği Mesafeli Sözleşmeler
            Yönetmeliği&apos;nin 15/1-c maddesi kapsamında cayma hakkı dışında bırakılmıştır.
          </li>
        </ul>
      </Section>

      <Section title="7. Kullanıcı Yükümlülükleri">
        <ul>
          <li>Platform yalnızca kişisel, ticari olmayan amaçlarla kullanılabilir.</li>
          <li>Sahte hesap oluşturmak, başkasının kimliğine bürünmek yasaktır.</li>
          <li>Platform altyapısını bozmaya, aşırı yük oluşturmaya yönelik işlemler yapılamaz.</li>
          <li>Doğru ve güncel bilgi sağlamak kullanıcının sorumluluğundadır.</li>
        </ul>
      </Section>

      <Section title="8. Sorumluluk Sınırlaması">
        <p>
          FoodRescue, işletmelerin sağladığı ürünlerin kalitesi, tazeliği veya içeriği konusunda
          garanti vermez. Platform bir aracı olarak hareket etmekte olup kural ihlalleri
          tespit edildiğinde hesapları askıya alma veya kaldırma hakkını saklı tutar.
        </p>
        <p>
          Şirket, kullanıcının zarara uğraması hâlinde yalnızca söz konusu siparişin tutarı
          kadar ve ilgili mevzuatın belirlediği sınırlar dahilinde sorumludur.
        </p>
      </Section>

      <Section title="9. Fikri Mülkiyet">
        <p>
          Platform üzerindeki tüm içerik, logo, yazılım ve tasarım FoodRescue&apos;ya aittir.
          İzinsiz kopyalanamaz, dağıtılamaz veya ticari amaçla kullanılamaz.
        </p>
      </Section>

      <Section title="10. Değişiklikler">
        <p>
          FoodRescue bu şartları önceden bildirmeksizin değiştirebilir. Güncel şartlar her zaman
          platform üzerinde yayımlanır. Değişiklik sonrası platformu kullanmaya devam etmeniz
          yeni şartları kabul ettiğiniz anlamına gelir.
        </p>
      </Section>

      <Section title="11. Uygulanacak Hukuk ve Yetki">
        <p>
          Bu şartlar Türk Hukuku&apos;na tabidir. Anlaşmazlıklarda İstanbul (Çağlayan) Mahkemeleri
          ve İcra Daireleri yetkilidir.
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
