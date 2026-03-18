import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — FoodRescue",
};

export default function KvkkPage() {
  return (
    <article className="prose prose-stone max-w-none">
      <h1 className="text-2xl font-extrabold text-stone-900">
        Kişisel Verilerin Korunması Kanunu (KVKK) Kapsamında Aydınlatma Metni
      </h1>
      <p className="text-sm text-stone-500">Son güncelleme: 16 Mart 2026</p>

      <Section title="1. Veri Sorumlusu">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca kişisel verileriniz;
          veri sorumlusu sıfatıyla <strong>FoodRescue Teknoloji A.Ş.</strong> ("Şirket") tarafından
          aşağıda açıklanan kapsamda işlenmektedir.
        </p>
        <ul>
          <li><strong>Ticaret Unvanı:</strong> FoodRescue Teknoloji A.Ş.</li>
          <li><strong>Adres:</strong> İstanbul, Türkiye</li>
          <li><strong>E-posta:</strong> kvkk@foodrescue.com.tr</li>
        </ul>
      </Section>

      <Section title="2. İşlenen Kişisel Veriler">
        <p>Platformumuzu kullanmanız sürecinde aşağıdaki kişisel verileriniz işlenmektedir:</p>
        <ul>
          <li><strong>Kimlik Verileri:</strong> Ad, soyad</li>
          <li><strong>İletişim Verileri:</strong> E-posta adresi, telefon numarası</li>
          <li><strong>Konum Verileri:</strong> Yakındaki işletmeleri listelemek için tarayıcı konum izni (kullanıcı onayı ile)</li>
          <li><strong>İşlem Verileri:</strong> Sipariş bilgileri, ödeme kayıtları (kart bilgileri doğrudan Şirket tarafından saklanmamakta; iyzico altyapısı aracılığıyla işlenmektedir)</li>
          <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, erişim günlükleri</li>
          <li><strong>Kullanım Verileri:</strong> Platform içi gezinme, sipariş geçmişi</li>
        </ul>
      </Section>

      <Section title="3. Kişisel Verilerin İşlenme Amaçları">
        <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
        <ul>
          <li>Hesap oluşturma ve kullanıcı kimliğinin doğrulanması</li>
          <li>Sipariş süreçlerinin yönetilmesi ve ödeme işlemlerinin gerçekleştirilmesi</li>
          <li>Yakındaki sürpriz kutuların listelenmesi (konum tabanlı hizmet)</li>
          <li>İşletme kayıt ve onay süreçlerinin yönetilmesi</li>
          <li>Sipariş onayı, teslim hatırlatması ve iptal bildirimi e-postalarının gönderilmesi</li>
          <li>Müşteri desteği ve şikâyet yönetimi</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, e-ticaret mevzuatı vb.)</li>
          <li>Platform güvenliğinin sağlanması ve dolandırıcılığın önlenmesi</li>
        </ul>
      </Section>

      <Section title="4. Kişisel Verilerin İşlenme Hukuki Dayanağı">
        <p>Kişisel verileriniz KVKK&apos;nın 5. maddesi kapsamında şu hukuki dayanaklar çerçevesinde işlenmektedir:</p>
        <ul>
          <li><strong>Sözleşmenin kurulması ve ifası:</strong> Sipariş ve ödeme işlemleri</li>
          <li><strong>Meşru menfaat:</strong> Platform güvenliği, dolandırıcılık tespiti</li>
          <li><strong>Hukuki yükümlülük:</strong> Vergi ve e-ticaret mevzuatı gereklilikleri</li>
          <li><strong>Açık rıza:</strong> Konum verisi işleme ve pazarlama iletişimleri</li>
        </ul>
      </Section>

      <Section title="5. Kişisel Verilerin Aktarımı">
        <p>Kişisel verileriniz aşağıdaki üçüncü taraflarla paylaşılabilir:</p>
        <ul>
          <li><strong>iyzico Ödeme Hizmetleri A.Ş.:</strong> Ödeme işlemlerinin gerçekleştirilmesi amacıyla</li>
          <li><strong>E-posta Servis Sağlayıcıları:</strong> Bildirim e-postalarının iletilmesi amacıyla</li>
          <li><strong>Altyapı Sağlayıcıları:</strong> Barındırma ve veritabanı hizmetleri</li>
          <li><strong>Yasal Merciler:</strong> Yetkili kamu kuruluşlarının talepleri doğrultusunda</li>
        </ul>
        <p>
          Kişisel verileriniz yurt dışına aktarılması söz konusu olduğunda KVKK&apos;nın 9. maddesi
          kapsamındaki şartlara uyulacaktır.
        </p>
      </Section>

      <Section title="6. Kişisel Verilerin Saklanma Süresi">
        <ul>
          <li>Hesap verileri: Hesap silinme tarihinden itibaren 1 yıl</li>
          <li>Sipariş ve ödeme kayıtları: İlgili işlem tarihinden itibaren 10 yıl (vergi mevzuatı gereği)</li>
          <li>Konum verileri: Oturum süresince (kalıcı olarak saklanmaz)</li>
          <li>Erişim günlükleri: 90 gün</li>
        </ul>
      </Section>

      <Section title="7. İlgili Kişi Hakları">
        <p>KVKK&apos;nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
          <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini isteme</li>
          <li>Aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
          <li>Kanuna aykırı işlenmesi nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
        </ul>
      </Section>

      <Section title="8. Başvuru Yöntemi">
        <p>
          Haklarınızı kullanmak için{" "}
          <strong>kvkk@foodrescue.com.tr</strong> adresine e-posta gönderebilir
          ya da yazılı başvuru formunu doldurarak Şirket adresine iletebilirsiniz.
          Başvurularınız 30 gün içinde sonuçlandırılacaktır.
        </p>
        <p>
          Başvurunuzun reddedilmesi, verilen cevabın yetersiz bulunması veya süresinde
          yanıt verilmemesi hâlinde Kişisel Verileri Koruma Kurulu&apos;na şikâyette
          bulunma hakkınız saklıdır.
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
