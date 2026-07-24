# QM PANEL — PROJE NOTLARI

> Bu dosya, Claude'un her yeni oturumda projeyi hatırlaması içindir.
> Yeni sohbete başlarken sadece şunu yaz: **"qm-panel klasöründeki QM-NOTLAR.md'yi oku"**

---

## PROJE NEDİR

Etsy mağaza yönetim paneli. Tek dosyalık React uygulaması (CDN'den React + Babel).
Ayrı JS/CSS dosyası yok — her şey `index.html` içinde.

**Çalışma dosyası:** `~/Documents/qm-panel/index.html`
**Yayın:** GitHub repo `ejderusa-sketch/qm-panel` → https://ejderusa-sketch.github.io/qm-panel/
**Sahibi:** EJDER — ejderusa@gmail.com

## YETKİLENDİRME (8.1) — KURALLAR & YAPILACAKLAR

Amaç: İçeri giren kişiye (üye/manager) **modül modül** farklı yetkiler vermek. Owner (ejderusa) her şeyi görür.

1. **Yetki kartı DEFAULT AÇIK kalmalı** — ekran/kart kapanmasın (P'ye basınca açılıyor; açık kalsın).
2. **Modül başlıkları ana NAV başlıklarıyla SENKRON olmalı.** Nav başlıkları değişince (0 DASHBOARD, 1 CSV, 2 ETSY API, 2A SHIPSTATION, 3 FINANCE, 4 TRADEMARK, 5 SHOP MANAGER, 6 KİMLİK, 7 EKİP, 9 ETSY …) yetki grid'i de **aynı** başlık/numaralara dönmeli. **ŞU AN SENKRON DEĞİL** — grid eski başlıkları (1·MARKETING, 4·GÖRÜNÜRLÜK vb.) gösteriyor. Tek kaynak: nav yapısı; PERMS listesi nav ile eşleştirilecek. (Dikkat: `can()`/`TAB_PERM` anahtarları değişince gating bozulmasın — anahtarlar sabit, sadece etiket/numara/grup nav'a uydurulur; yeni tab'lar için yeni perm eklenir.)
3. Her modülün alt başlıkları (0.1, 1.1, 1.2 …) Aç/Kapalı olarak verilir; **her yerle senkron** çalışır.
4. **QM mağaza listesi (MAĞAZALAR chips) ŞİMDİLİK yetkilendirmeden KALDIRILDI** — ileride mağaza-bazlı yetki eklenecek.
5. **NOVA AGENT yetkilendirmenin DIŞINDA** — sadece owner'a ait; hiçbir üye görmez, yetki listesinde çıkmaz. (Zaten `currentRole==="admin"` ile korunuyor, PERMS'te yok.)
6. **İÇERİ GİREN, OWNER ÇIKARANA KADAR İÇERDE KALIR (ZORUNLU).** Onaylanmış üye/arkadaş **asla otomatik silinmez/çıkarılmaz** — sadece owner elle "erişimi kaldır" derse çıkar. Üye listesi (`settings.mgrList`) + erişim (`shared_state.accessList` + `members` tablosu) **boş okuma/hata durumunda ASLA ezilmez** (QM452 koruması). Bir üye kaybolduysa DB krizinden olmuştur; erişim genelde `accessList`/`members`'ta durur → owner verisi düzgün yüklenince geri gelir.

## TRADEMARK / COPYRIGHT / POLİTİKA AYRIMI (02 Dashboard)

Gelen Etsy IP/ihlal e-postaları `fetchStoreTrademark` içinde **otomatik** sınıflanır (`c.type`). Ayrımı e-postanın konu+gövdesindeki anahtar kelimelerden yapar:
- **Trademark** → marka, **®**, **™**, "registration number / reg no", "brand" geçiyorsa.
- **Copyright** → **DMCA**, "copyright infringement/complaint/claim", **counter-notice**, "telif", "artwork" geçiyorsa.
- **Politika** → Etsy politika ihlali: "**don't follow our policy**", "trust & safety", "prohibited items", "we removed … policy".
- **Belirsizse → varsayılan `trademark`** (bu yüzden bazen copyright olması gereken kayıt trademark'a düşebilir, örn. QM32).

Dashboard sütunları buna göre: **02.1 Trademark · 02.2 Copyright · 02.3 Politika** (hepsi `typeOf(c)` → `c.type`).

**YANLIŞ SINIFLANIRSA — elle düzeltme (QM449):** Trademark (4) sekmesinde her kaydın altındaki **"Tür: Trademark / Copyright / Politika"** düğmesine bas (`upC(c.id,"type",...)`). Değişince Dashboard'da doğru sütuna geçer, e-posta/form akışı da (copyright → Etsy Formu, trademark → Email Gönder) türe göre değişir.

## VERİ GÜVENLİĞİ & PERFORMANS (KRİTİK — 23 Tem 2026)

**Yaşanan sorun:** Sayfadan ayrılıp dönünce sol menüdeki QM mağazaları boş görünüyordu ("bağlı mağaza yok"). Web/veri büyüdükçe artıyordu; açılış çok yavaştı ("Hesap hazırlanıyor" takılıyordu).

**Kök sebep:** Supabase veritabanı en küçük **Nano** compute'ta (0.5 GB RAM, paylaşımlı CPU) idi → sorgular yetişemeyip **asılıyordu** (8-12 sn timeout). Veri KAYBOLMUYORDU (yalnızca ~0.03 GB, diskte güvende), sadece **çekilemiyordu**.

**Çözümler:**
1. **Compute: Nano → Micro** (1 GB RAM, 2 çekirdek CPU). Pro planında Micro **zaten ödendiği için EK ÜCRET YOK** (+$0.00). Supabase → Settings → Compute and Disk. DB Nano'ya düşerse tekrar Micro'ya çek.
2. **Kod kilitleri (QM448) — DATA KAYBI ÖNLEME:**
   - Boş/başarısız bulut okuması sol menüyü **BOŞALTMAZ** (`if(am.length){setAccounts(am)...}` — yoksa önbellek/mevcut kalır).
   - Buluta **ASLA boş mağaza listesi yazılmaz** (`if(!accounts.length)return;` — store.set atlanır). → panel mağazaları silemez, önbellekten kendini onarır.
3. **Hesaba özel önbellek (QM447):** `qm_accts::email` / `qm_settings::email` — başka hesabın (novainnc) boş verisi ejderusa'ya geçince görünmez.
4. **Açılış hızlandırma (QM445-446):** veri cihazda önbellekte (localStorage), açılışta **anında** gösterilir; bulut yüklemesi arka planda + paralel (Promise.all); "Hesap hazırlanıyor" da `qm_boot` önbelleğiyle anında geçilir.

**VERİ KAYBI GARANTİSİ (3 katman):**
1. Kod kilitleri → panel asla boş yazıp silmez, önbellekten onarır.
2. Cihaz önbelleği (`qm_accts::email`) → son iyi hâl hep elde.
3. **Supabase Pro günlük yedek (7 gün saklanır)** → en kötü ihtimalde bile geri yüklenebilir (Dashboard → Database → Backups).

**ZORUNLU KURAL (yeni kod):** Bulut okuma/yazma eklerken: **boş/başarısız okumada mevcut veriyi EZME; boş listeyi buluta YAZMA.** Compute Nano'ya düşerse Micro'ya çek (ücretsiz).

## CSV'LER (ÇOK ÖNEMLİ — KARIŞTIRMA)

İki ayrı CSV türü var, **asla karıştırma**. E-postadan çekerken **dosya adına** göre ayırt edilir:

**1) CSV — LISTING MARKETING** (sekme: 1 · LISTING MARKETING)
- Ürün (listing) bazında: Listing adı, Views, Clicks, Spend, Orders, Revenue.
- Kaynağı: **biz** Etsy ekran görüntülerini alıp yapay zekâ ile CSV yapıyoruz.
- Dosya adında "stats" **geçmez**.
- **TANIMA İPUCU: içinde "Listing" sütunu/kelimesi geçer.** "Listing" varsa → kesin LISTING MARKETING.
- Kod: `parseCSV` / `handleCSV` / `fetchStoreCSV`. Veri `dm[act|YYYY-MM]`.

**2) CSV — MARKETING ROAS** (sekme: 1A · MARKETING ROAS)
- Günlük özet: Date, Views, Clicks, Orders, Revenue, Spend, ROAS, Click rate, Ending budget.
- Kaynağı: **Etsy hazır verir** (indirilen dosya). Dosya adında **"stats" geçer** (örn. `etsy_ads_stats_2026-06-01_2026-06-30.csv`).
- Kod: `parseRoasCSV` / `isRoasCSV` / `fetchRoasCSV`. Veri `dm[act|R|YYYY-MM]`.

**Ayırt etme kuralı — HER TÜR KESİN İŞARETLE TANINIR, VARSAYILAN YOK:**

Bundan sonra farklı CSV'ler de gelecek. Bu yüzden "diğer her şey → LISTING" gibi bir catch-all **YOK**. Tanınmayan CSV hiçbir yere zorla konmaz (atlanır). Yeni tür gelince buraya yeni kesin işaret eklenir.

1. **MARKETING ROAS** (1A) — pozitif işaret: dosya adında **"stats"** VEYA içerik **Date + ROAS/Budget** sütunlu (ürün adı YOK). Fonksiyon: `isRoasCSV`.
2. **LISTING MARKETING** (1) — pozitif işaret: içinde **"Listing"** (ya da title/product) sütunu + sayı sütunu VAR. Fonksiyon: `isListingCSV`.
3. **Hiçbirine uymuyorsa** → dokunma, atla (yeni tür olabilir; önce buraya kural eklenmeli).

`fetchStoreCSV` yalnız `isListingCSV` olanları alır (stats/ROAS'ı atlar). `fetchRoasCSV` yalnız ROAS olanları alır.

## MAĞAZA LİSTELERİ — ASLA KARIŞTIRMA (ZORUNLU)

**İki ayrı mağaza listesi var, birbirine karıştırma / eşleştirme:**
1. **Sol menü mağazaları** = panelin kendi hesapları (`accounts` dizisi, Gmail OAuth ile bağlı, QM1/QM2… numaralı). CSV/e-posta/trademark/policy hep buradan çekilir.
2. **ShipStation mağazaları** = ShipStation API'sinden gelen mağazalar (`ssStores`, 2A.1 sekmesi, ~85 tane). Sadece ShipStation sipariş/adres/e-posta içindir.

Bunlar **farklı sistemler**. Otomatik birbirine bağlama, isim/numara eşleştirme yapma, birini diğerinin yerine kullanma. Sol menü mağazası ≠ ShipStation mağazası. (İleride eşleştirme istenirse EJDER açıkça söyleyecek.)

## ALT BAŞLIK / SUB-TAB STANDARDI (ZORUNLU — HER YERDE AYNI)

**Tüm alt başlıklar ve alt sekmeler bu formatta olacak** (referans: Trademark 4.1/4.2/4.3/4.4 mavi hapları). Yeni bir alt başlık/sekme eklerken KESİNLİKLE bu stili kullan:

**Hap (buton) — dış kısım:**
- `border:2.5px solid var(--azure)` · `borderRadius:999` · `fontFamily:'Space Grotesk'` · `fontWeight:800`
- Pasif: `background:#fff`, `color:var(--azure)`
- Aktif: `background:var(--azure)`, `color:#fff`

**Numara rozeti (içteki küçük yuvarlak):**
- `background:#fff` · `color:var(--red)` · `border:2px solid var(--red)` · `borderRadius:999`
- `fontFamily:'JetBrains Mono'` · `fontWeight:800` · sol tarafta

Yani: **beyaz/mavi hap + içinde kırmızı numara rozeti**. Section header'lar (`.rules > .rh`) da numara taşıyorsa aynı kırmızı rozet kullanılır. Marketing (1.0–1.4) ve Trademark (4.1–4.4) bu standarttadır; **yeni her şey de öyle olacak.**

**HİYERARŞİK / AÇILIR ALT SEKME KURALI (ZORUNLU — HER YERDE):**
Bir üst sekmeye/alt sekmeye basınca **kendi alt sekmeleri (bir alt kademe) açılır/görünür.** Yani sekmeler ağaç gibi kademelidir ve her tıklama bir sonraki kademeyi gösterir:
- 0 DASHBOARD → basınca 01/02/03 açılır → 02'ye basınca 02.1/02.2/02.3 açılır.
- 1 CSV → basınca 1.1 LISTING MARKETING / 1.2 MARKETING ROAS açılır → 1.1'e basınca kendi iç pill'leri (Etsy Reklamlar, Reklam Payı, CTR, Görünürlük, ROAS) açılır.
Bu davranış **istisnasız her sekmeye** uygulanır. Yeni bir üst sekme eklerken alt sekmeleri de bu açılır mantıkla (parent seçili → children render) kur. Numara rozetleri kademeye göre gider (0 → 01 → 02.1 gibi).

## DİL / ÇEVİRİ KURALI (ZORUNLU)

**Dil değişince A'dan Z'ye HER ŞEY o dile dönecek — istisnasız.** Türkçe seçilince ekranda İngilizce hiçbir metin kalmamalı: sabit arayüz metinleri, dinamik içerik (e-posta KONU'ları, gövde/içerik), tablo başlıkları, rozetler, tür etiketleri, özetler — **iç, dış, rakam, segment, ne varsa.** Yarı Türkçe yarı İngilizce **KESİNLİKLE olmaz** (kelime-kelime yamalama yapma; tam cümle çevir).

Mekanizma (`index.html`):
- **Sabit metinler:** `TT(tr,en,ur)` fonksiyonu (`uiLang`'e göre). Yeni her metni TT ile yaz.
- **Etsy e-posta konuları (şablon):** `trEtsy(s)` — `_ETSY_FULL` içinde **tam-cümle şablon eşleşmesi** (regex → komple Türkçe cümle). Yeni Etsy şablonu görülürse buraya ekle. Politika adları `_POL_TR` sözlüğünde, aylar `_MO_TR`.
- **Serbest metin (e-posta gövdesi):** `aiTR(text,apiKey)` — Anthropic API ile tam çeviri. Modal açılınca TR + API anahtarı varsa otomatik çevrilir (`showMail`).
- **Politika özeti (3 madde):** `aiBullets(title,ctx,apiKey)`.

Yeni bir tablo/modal/liste eklerken: dinamik konu → `trEtsy(...)`, gövde → `showMail`/`aiTR`, sabitler → `TT`. **Test: TR'ye geçince tek bir İngilizce kelime kalmamalı.**

## SÜRÜM KURALI

Her değişiklikte numara **+1** artar (QM377 → QM378...). Numara **DÖRT yerde** güncellenmeli:

1. En üstteki HTML yorum bloğu (yeni satır eklenir)
2. Alt bilgideki `QM3xx ☁️` rozeti
3. Sürüm-takip scriptindeki `var CURRENT=3xx;`
4. `version.txt` dosyasının içi (sadece sayı, örn. `378`)

Ayrıca bu dosyanın "SÜRÜM GEÇMİŞİ" tablosuna satır eklenir.

**Neden version.txt önemli:** Açık duran paneller her 2 dakikada bir `version.txt`'yi kontrol eder. İçindeki sayı `CURRENT`'tan büyükse "Yeni sürüm — Yenile" şeridi çıkar. Yani version.txt push edilmezse dünyadaki manager'lar güncelleme uyarısı almaz.

## İŞ AKIŞI

1. Claude `~/Documents/qm-panel/index.html` dosyasını doğrudan düzenler.
2. Sürüm numarasını artırır, geçmişe not düşer.
3. Değişiklikten sonra JSX'i Babel ile derleyip sözdizimi hatası olmadığını doğrular.
4. EJDER dosyayı GitHub'da `index.html` üzerine yükleyip commit eder.
5. Paneli `?v=qm3xx` ile açar (tarayıcı önbelleğini atlatmak için).

## KOD YAPISI — ÖNEMLİ YERLER

| Ne | Nerede |
|---|---|
| Sekmeler (NOVA AGENT, DASHBOARD, MARKETING, ETSY API...) | `TAB_PERM` ve ana `App` bileşeni |
| NOVA AGENT ekranı | `function NovaAgent(...)` |
| A1 / A2 / A3 alt sekmeleri | `NovaAgent` içinde `view` state'i (`"a1"`, `"a2"`, `"a3"`) |
| Mağaza listesi | `accounts` dizisi — her kaydın `email` ve `gmailConnected` alanı var |
| Gmail okuma | `onInbox`, `onRead`, `onMarkRead` prop'ları |
| Dil metinleri | `TT("türkçe","english")` yardımcısı |
| Kalıcı depolama | `store.get` / `store.set` (Supabase + localStorage) |

### NOVA AGENT alt sekmeleri

- **A1** — kullanıcının kendi gelen kutusu (`userEmail` ile eşleşen hesap)
- **A2** — ⭐ ile işaretlenen önemli e-postalar (ortak havuz)
- **A3, A4, …** — `EXTRA_INBOXES` listesindeki ek gelen kutuları

### Yeni e-posta kutusu eklemek

`EXTRA_INBOXES` dizisine tek satır ekle, başka hiçbir yere dokunma:

```js
const EXTRA_INBOXES=[
 {key:"a3",email:"novainnc@gmail.com"},
 {key:"a4",email:"ejderug@gmail.com"},
 {key:"a5",email:"yeni@gmail.com"}   // <— böyle
];
```

Sekme düğmesi, tarama, teşhis mesajları ve tablolar kendiliğinden oluşur.
Şart: o e-posta mağaza listesinde kayıtlı ve Gmail'e bağlı olmalı.

A1 kendi state'ini tutar (`items`); ek kutular ortak bir sözlükte tutulur (`xItems`, anahtar = `key`).
Aktif hesap `curAcc`, aktif liste güncelleyici `curSet` ile seçilir. `findAcc(email)` esnek eşleştirme yapar.
Bölümler: Okul/Skyward · Acil/Önemli · Diğer · Reklam-Junk.

## SÜRÜM GEÇMİŞİ

| Sürüm | Tarih | Değişiklik |
|---|---|---|
| QM436 | 23 Tem 2026 | **TAM CÜMLE çeviri** (`trEtsy`: şablon eşleşme, karışık dil YOK) + modal e-posta gövdesi **API ile Türkçe** (`aiTR`, `showMail`). **NEW POLICY = sadece haber** (kaldırma/ihlal e-postaları dışlandı); **policy ihlalleri → Trademark Dashboard**; Trademark Dashboard'a **"E-postaları Tara"** butonu; `fetchStoreTrademark` IP-policy/ihlal uyarılarını da yakalıyor. Legal satırlarına **"📋 3 Maddede Özetle"** (`aiBullets`) butonu. DİL/ÇEVİRİ KURALI eklendi |
| QM435 | 23 Tem 2026 | TR seçiliyken Etsy e-posta KONU'ları Türkçe (ilk sürüm — sonra QM436'da tam-cümleye çevrildi) |
| QM434 | 23 Tem 2026 | `legal` edge function Supabase'e **deploy edildi**. Etsy veri-merkezi IP'lerini **bot koruması (JS-challenge)** ile blokladığı için canlı scraping çalışmıyor → fonksiyon canlıyı dener, bloklanınca **küratör resmi liste (37 politika, gerçek etsy.com/legal verisi)** döndürür (`source:"curated"`). Tarihli politikalar (yürürlük) üstte. Web-item'a **"↗ Etsy'de Aç"** butonu eklendi (metin sunucudan çekilemediği için link kullanıcının tarayıcısında açılır). SEED listesi değişince güncellenmeli |
| QM433 | 23 Tem 2026 | **03 NEW ETSY POLICY**'ye 2. kaynak: **"Etsy Legal — Canlı Kaynak"** (etsy.com/legal). Yeni **`legal` edge function** (`supabase/functions/legal/index.ts`) Etsy'nin resmi politika listesini (sellers/buyers/third-party bölümleri) çekip parse eder. Her satır istenen düzende: **🔗 link · tarih · tek cümle özet · 📖 Oku**. Oku → o politikanın metnini modalda gösterir. **Gizli anahtar GEREKMEZ** (Etsy legal public). Deploy: `legal` fonksiyonunu Supabase'e kur |
| QM432 | 23 Tem 2026 | DASHBOARD altına 3. alt sekme: **📜 03 NEW ETSY POLICY**. Etsy'nin yeni/güncellenen politika duyurularını (policy / terms of use / house rules / seller handbook) tüm mağazaların e-postasından çeker (`fetchStorePolicy`, Senkron'a bağlı). Askı/kimlik/vergi e-postaları hariç tutulur (ALARMING'e ait). **Yürürlük tarihi (effective date)** parse edilip ayrı **YÜRÜRLÜK** sütununda gösterilir. `PolicyTab` bileşeni, veri `settings.policyNews` |
| QM431 | 23 Tem 2026 | ALARMING arama kapsamı genişledi: artık **suspend / deactivate / terminate / closure / "due date" / deadline / "final notice"** geçen Etsy e-postaları da çekiliyor. Yeni **"suspension" türü** = **ASKI/KAPATMA** (kırmızı). E-posta içinden **vade / son tarih (due date)** parse edilip yeni **VADE** sütununda gösterilir (tarih formatları: "Jul 30, 2026", "07/30/2026", "within N days") |
| QM430 | 23 Tem 2026 | NOVA AGENT yanına tek **"📊 DASHBOARD"** üst sekmesi. Altında iki alt sekme (mavi pill + kırmızı numara rozeti): **01 ALARMING** + **02 TRADEMARK DASHBOARD**. Ayrı ALARMING ve 4A TRADEMARK DASHBOARD üst sekmeleri kaldırıldı, tek çatı altında toplandı (`dashView` state) |
| QM429 | 23 Tem 2026 | Sol menü mağaza numara kutuları (01, 02...) **beyaz zemin + siyah yazı**, kenar mağaza renginde çerçeve (eskiden renkli dolgu, beyaz yazı). Kapalı/A1 kutular kırmızı çerçeve |
| QM428 | 23 Tem 2026 | ALARMING sekmesine **"🔄 Tüm Mağazaları Tara"** butonu eklendi (tüm bağlı mağazalarda `fetchStoreAlarming` döner, toplu). Tablo **trademark dashboard gibi**: yıla göre gruplu (yıl başlıkları), grid düzen — Mağaza rozeti · # · Tarih · Konu · Tür · Kimden · Oku |
| QM427 | 23 Tem 2026 | ALARMING dashboard alt sekmesinden çıkıp **üst nav sekmesine** taşındı — **A NOVA AGENT ile 1 LISTING MARKETING arasında** (badge 🚨). Ayrı `AlarmingTab` bileşeni (kendi readMail modalı). Overview'daki ALARMING pili/tablosu kaldırıldı. Veri/scanner (`fetchStoreAlarming`, `settings.alarming`, Senkron) aynı |
| QM426 | 23 Tem 2026 | **0 · ALARMING** eklendi (4A TRADEMARK DASHBOARD içinde, 0.1 Trademark'ın önünde, kırmızı hap). Etsy'nin **spesifik** taleplerini e-postalardan çekiyor: seller ID/kimlik doğrulama, hesap askı/uyarı, ödeme/vergi doğrulama (genel support değil — gürültü). `fetchStoreAlarming(acc)` scanner (from:etsy.com + belirli konu/keyword), veri `settings.alarming`, **Senkron**'a bağlı. Tablo: Mağaza · Tarih · Tür · Konu · Kimden · Oku. Hangi hesaptan geldiği rozetle gösteriliyor |
| QM425 | 22 Tem 2026 | 2A ShipStation ikiye bölündü: **2A.1 Mağazalar** (ShipStation store listesi — kaç tane varsa, Mağaza Adı/Marketplace/Store ID/Aktif) + **2A.2 Siparişler** (müşteri/adres/email tablosu). `ssView` toggle, `ssFetchStores` (`action:"stores"`). Orders bloğu temiz yeniden yazıldı |
| QM424 | 22 Tem 2026 | **2A ShipStation entegrasyonu (ön yüz).** Sipariş tablosu: Sipariş # · Tarih · Müşteri · **E-posta** · **Adres** · Durum. Durum filtresi (awaiting/shipped/on_hold/cancelled) + "ShipStation'dan Çek" butonu. `ssFn` → `SB_URL/functions/v1/shipstation`. **Arka uç:** `supabase/functions/shipstation/index.ts` (ShipStation V1 proxy, Basic auth, CORS). Kurulum: `supabase functions deploy shipstation` + `supabase secrets set SS_API_KEY / SS_API_SECRET`. Kurulmadan tablo boş/uyarı gösterir |
| QM423 | 22 Tem 2026 | **ALT BAŞLIK STANDARDI** MD'ye kalıcı yazıldı (mavi hap + kırmızı numara rozeti — Trademark 4.x referans). ROAS başlığındaki "1A" düz metinden **kırmızı numara rozetine** çevrildi. Bundan sonra tüm yeni alt başlık/sekmeler bu formatta |
| QM422 | 22 Tem 2026 | 1A MARKETING ROAS özet kartı (Views/Clicks/Orders/Revenue/Spend/ROAS) **veri olmasa da her zaman görünüyor** — standart tablo bu. Boşken 0 gösterir; altında veri varsa günlük tablo, yoksa CSV çek/yükle ipucu |
| QM421 | 22 Tem 2026 | Ayarlar hero başlığından "8 —" numarası kaldırıldı — sadece SETTINGS/AYARLAR (nav 8 sekmesi zaten yok) |
| QM420 | 22 Tem 2026 | Nav sekmeleri arası boşluk eşitlendi/açıldı (gap 8→20). **4A TRADEMARK DASHBOARD**, 4 TRADEMARK'ın hemen arkasına taşındı. Nav'daki **8 SETTINGS sekmesi kaldırıldı** (üstteki Settings butonu zaten var) |
| QM419 | 22 Tem 2026 | **Tüm nav sekme etiketleri** küçültüldü ve iki-kelimeliler alt alta kırılıyor. `.tabs button` CSS: `font-size:10px`, `white-space:normal`, `max-width:84px`, `text-align:left`, `line-height:1.08`. LISTING MARKETING'in özel span'i kaldırıldı (CSS artık hepsini yönetiyor) |
| QM418 | 22 Tem 2026 | (QM419 ile birleşti) "1 LISTING MARKETING" nav etiketi iki satır — genel CSS'e taşındı |
| QM417 | 22 Tem 2026 | "0 DASHBOARD" (overview tab) → **"4A TRADEMARK DASHBOARD"** olarak yeniden adlandırıldı (nav butonu badge "4A" + hero başlık). Tab anahtarı hâlâ `overview` |
| QM416 | 22 Tem 2026 | 1A ROAS tablo başlıkları **tıklanınca sıralanıyor** (büyükten küçüğe / küçükten büyüğe, ▼▲⇅ göstergeli — `roasSort` state, tüm sütunlar). Ayrıca Ayarlar/Profil/Çıkış başlık butonları **siyah çerçeve + siyah yazı** yapıldı (eskiden kırmızı) |
| QM415 | 22 Tem 2026 | 1A MARKETING ROAS'ın tepesine **Etsy tarzı büyük özet kartı** eklendi: Views (K formatı) · Clicks · Orders · Revenue · Spend · ROAS — Etsy'nin "Your ad stats for" kartıyla birebir aynı. Altında günlük tablo. CSV toplamı Etsy özetiyle tam tutuyor (test: 108.870 view, 1.69 ROAS) |
| QM414 | 22 Tem 2026 | CSV **pozitif tanıma**: LISTING (`isListingCSV` — "Listing" sütunu) ve ROAS (`isRoasCSV` — stats/Date+ROAS) kesin işaretle tanınır. **Catch-all fallback kaldırıldı** — tanınmayan yeni CSV hiçbir yere zorlanmaz, atlanır. `fetchStoreCSV` artık sadece `isListingCSV` olanları alıyor |
| QM413 | 22 Tem 2026 | 1A MARKETING ROAS tablosu CSV'ye birebir uyduruldu — **Click rate** (%) ve **Budget** (Ending budget) sütunları eklendi. Tam sütun sırası: Date · Views · Clicks · Orders · Revenue · Spend · ROAS · Click rate · Budget |
| QM412 | 22 Tem 2026 | CSV yönlendirme **dosya adıyla** da ayırt ediyor: adında **"stats"** geçen → MARKETING ROAS (1A), diğeri → LISTING MARKETING (1). `fetchStoreCSV` "stats" dosyalarını atlar. Kurallar QM-NOTLAR.md'de "CSV'LER" başlığında |
| QM411 | 22 Tem 2026 | **YENİ 1A · MARKETING ROAS sekmesi.** Günlük Etsy Ads ROAS CSV'sini okuyor (sütunlar: Date, Views, Clicks, Orders, Revenue, Spend, ROAS, Click rate, Ending budget). `parseRoasCSV` + `isRoasCSV` (Listing CSV'den ayırt eder). Veri `dm[act\|R\|YYYY-MM]` altında ay ay saklanır. Tab içeriği: dönem seçici (ay + Son N Ay), günlük tablo + TOPLAM satırı + genel ROAS. `fetchRoasCSV` e-postadan çeker; **Senkron** da çağırıyor. `fetchStoreCSV` ROAS CSV'lerini atlıyor (yanlış parse etmesin). Nav: 1 LISTING MARKETING · **1A MARKETING ROAS** |
| QM410 | 21 Tem 2026 | `addAcct` artık yeni mağazayı listenin **en başına** ekliyor (prepend). Ayrıca **1 MARKETING → 1 LISTING MARKETING** olarak yeniden adlandırıldı (nav `tabMkt` + hero başlık). Not: numaralar konuma göre olduğu için yeni mağaza QM01 olur, diğerleri +1 kayar (veri store ID'ye bağlı olduğu için bozulmaz) |
| QM409 | 21 Tem 2026 | Başlık butonları (Ayarlar/Profil/Çıkış) beyaz zemin + kırmızı çerçeve + kırmızı **extra bold** (fontWeight 900). Header'daki **$ USD para seçici kaldırıldı** (para birimi mevcut değerinde sabit kalır) |
| QM408 | 21 Tem 2026 | Aralık (Son N Ay / YTD) seçiliyken dağılım grafiklerinin tepesine **ay ay döküm şeridi** eklendi — her ayın toplam değeri ayrı kart+mini bar olarak (örn. Son 3 → Nisan, Mayıs, Haziran). Ortak `monthStrip(field,color)` yardımcısı; Görünürlük (impressions), CTR (clicks), ROAS (revenue), Ad Share (spend) görünümlerinde. Tek ay seçiliyken görünmez |
| QM407 | 21 Tem 2026 | Tüm sayfa başlıkları (`.mk`) beyaz kutu + kırmızı çerçeve + kırmızı yazı yapıldı, biraz küçültüldü (font 19), gradyan kaldırıldı |
| QM406 | 21 Tem 2026 | Parantezde **yalnız shopName** (dükkan adı) gösteriliyor. legalEntity/fullName fallback'i kaldırıldı — artık şirket adı (LLC) yazmıyor; dükkan adı yoksa kırmızı "(eksik)" |
| QM405 | 21 Tem 2026 | Legal okuma (`readStoreLegal`) artık **gerçek Etsy dükkan adını** (`shopName`) da çekiyor — legal ekranının sol alt köşesindeki "Sales channels · Etsy · <ad>" (örn. newcustomtee). Mağaza düğmelerinde parantezde önce shopName, yoksa legalEntity/fullName; **hiç yoksa kırmızı "(eksik)"**. Legal formuna "Shop name" alanı eklendi. Mevcut kayıtlarda görünmesi için o mağazada tekrar "📷 E-postadan oku" gerekir |
| QM404 | 21 Tem 2026 | Legal & Tax mağaza düğmelerinde manuel ismin yanına gerçek isim parantez içinde küçük gösterilmeye başlandı (QM405 ile shopName eklendi) |
| QM403 | 21 Tem 2026 | CSV Yap artık **net onay** soruyor: görüntüleri işlemeden önce "MAĞAZA: X · AY: Y — doğru mu?" diye gösteriyor. Mağaza seçili değilse uyarıyor; üstte aralık (Son N Ay) seçiliyse hangi aya ait olduğunu soruyor. `handleImage(file, targetMonth)` parametreli hâle geldi (doğru `act\|YYYY-MM` anahtarına yazıyor), işlem sonrası o aya geçiyor |
| QM402 | 21 Tem 2026 | Senkron ve CSV Yap butonları **beyaz zemin + kırmızı yazı** yapıldı (içi kırmızı değil); "A·B·C·D modülleri" yazısı kaldırıldı; butonlar küçültülüp `flexWrap` ile sığacak hâle getirildi (kenardan taşmıyor) |
| QM401 | 21 Tem 2026 | Senkron butonu **kırmızı zemin + beyaz kalın yazı** yapıldı, yanına aynı görünümde **📷 CSV Yap** butonu eklendi. Ekran görüntülerini (çoklu seçilebilir) mevcut `handleImage` motoruyla yapay zekâya okutup **CSV satırlarına** çeviriyor (aktif mağaza + seçili ay). Motor: API anahtarı varsa Claude (isabetli), yoksa cihazda OCR. Doğrudan taze görüntü verildiği için e-posta ekindeki sıkıştırılmış görüntülerden daha iyi sonuç. Gizli input `#shotInput` |
| QM400 | 21 Tem 2026 | **Senkron butonu artık HER ŞEYİ günceller.** Eskiden yalnız Marketing (CSV) + Trademark çekiyordu; artık NOVA gelen kutularını (A1/A3/A4/TÜMÜ) da tazeliyor. `syncAll` bir `syncTick` sayacını artırıyor, `NovaAgent` bu prop'u izleyip scan/scanX/scanAll çağırıyor. Tek basış = tüm mağazalar, tüm veri, tüm e-postalar |
| QM399 | 21 Tem 2026 | 1.2 ile 1.3 grupları yer değiştirdi: **1.2 CTR**, **1.3 Görünürlük** (alt numaralar da: CTR 1.2.1/1.2.2, Görünürlük 1.3.1/1.3.2). Yeni **1.4 ROAS** grubu eklendi: 1.4.1 ROAS (kategori, gelir÷harcama, yüksek üstte) ve 1.4.2 ROAS Listing (listing bazında, ROAS≥1 yeşil, <1 kırmızı bar) |
| QM398 | 21 Tem 2026 | CTR görünümlerinde (1.3.1 ve 1.3.2) karışık "tıklama/görüntülenme" kesirleri (959/37.090 gibi) kaldırıldı; sadece sade yüzde kaldı (1 ondalık) |
| QM397 | 21 Tem 2026 | **1.3 CTR grubu.** 1.6/1.7 üst satırdan kaldırılıp 1.3 butonuna toplandı; basınca 1.3.1 CTR (ctr) ve 1.3.2 CTR Listing (ctrl) açılıyor. Marketing alt sekmeleri artık üç grup: 1.1 Reklam Payı · 1.2 Görünürlük · 1.3 CTR |
| QM396 | 21 Tem 2026 | Görünürlük Dağılımı (1.2.1) görünümünün tepesine, Reklam Yüzdeliği'ndeki gibi **Embroidery / Diğer** iki kartı eklendi (görüntülenme bazında %). Embroidery kategorisi `CATS` içinden bulunuyor |
| QM395 | 21 Tem 2026 | **1.2 Görünürlük grubu.** 1.4/1.5 üst satırdan kaldırılıp 1.2 butonuna toplandı; basınca 1.2.1 Görünürlük (viz) ve 1.2.2 Görünürlük Listing (vizl) açılıyor. Grup butonları ortak `_grpBtn` yardımcısıyla üretiliyor (1.1 ve 1.2). mSub anahtarları değişmedi |
| QM394 | 21 Tem 2026 | 1.1.1/1.1.2 alt sekmeleri varsayılan **gizli**. Üst satıra **1.1 Reklam Payı** butonu (▸/▾) eklendi; basınca alt satır açılıp 1.1.1 seçiliyor, tekrar/başka sekmeye basınca kapanıyor. `_grpOn = mSub==="a3"||"spl"` |
| QM393 | 21 Tem 2026 | Marketing alt sekmeleri arası boşluk artırıldı (üst satır gap 16, alt satır 14) |
| QM392 | 21 Tem 2026 | Alt sekmeler yeniden adlandırıldı: 1.1.1 **Reklam Yüzdeliği**, 1.1.2 **Listing Reklam Yüzdeliği**. Küçültüldü (font 11, dar padding) ki 1.1'in altına sağa kaymadan sığsın; aktifken koyu mavi yerine **hafif mavi** (`#dbe9fb`). Ayrıca **Son N Ay** butonlarının yanında "Toplanan: aylar · kaçında veri var" göstergesi (butonların çalıştığını görmek için) |
| QM391 | 21 Tem 2026 | Marketing alt sekmeleri iki satıra bölündü: üst satır 1.0 Etsy Reklamlar · 1.4 · 1.5 · 1.6 · 1.7. Alt satır girintili (↳): Dağılım analizleri yeniden numaralandı — **1.1.1 Dağılım**, **1.1.2 Dağılım Listing** (eski 1.2/1.3). mSub anahtarları a3/spl aynı |
| QM390 | 21 Tem 2026 | **ASIL CSV sorunu bulundu.** Etsy CSV'sinin ilk satırında "Month: Haziran 2026" gibi bir bilgi satırı var; `parseCSV` ilk satırı sütun başlığı sanıyor, Views/Clicks/Spend'i bulamıyor → **tüm rakamlar 0** geliyordu, "Month:" listing gibi görünüyordu. Artık ilk 15 satır içinden **gerçek başlık satırı** (listing + view/click/spend geçen) otomatik bulunuyor; preamble ve Total/Month/Date satırları eleniyor. Gerçek Etsy formatıyla test edildi: 6714 view, 90.07 spend vb. doğru okundu |
| QM389 | 21 Tem 2026 | Marketing alt sekmeleri (1.0–1.7) Trademark stiline getirildi: mavi 2.5px çerçeve, yuvarlak (999), pasifte mavi yazı-beyaz zemin, aktifte mavi dolgu; numara yuvarlağı kırmızı |
| QM388 | 21 Tem 2026 | **CSV ay tespiti tamamen yeniden yazıldı** (`detectMonth` + `_monthFrom`). Eskiden yalnız "Jul 1, 2026 - Jul 31, 2026" tam aralığını tanıyordu; başlıkta sadece "Temmuz 2026" / "July 2026" / "2026-07" yazıyorsa "tarih yok" diyordu. Artık TR+EN ay adları (tam/kısa), sayısal biçimler, tarih aralığı — hepsi tanınıyor, önce başlık (ilk 6 satır) taranıyor. E-postadan çekme (`fetchStoreCSV`) de aynı `detectMonth`'u fallback kullanıyor. Tüm hesaplar/e-postalar/gelecek CSV'ler için geçerli. 11 biçim test edildi, hepsi doğru |
| QM387 | 21 Tem 2026 | **CSV "okumuyor" sorunu.** Aslında veri kaybolmuyordu — her CSV bir aya kaydediliyor, tablo seçili ayı gösteriyor; CSV farklı aya gidince boş görünüyordu (örn. veri Ocak'ta, ekran Temmuz'da). Artık `handleCSV` başarılı içe aktarımdan sonra **otomatik o aya (`setPeriod`) ve o mağazaya (`setAct`) geçiyor**, veri hemen görünüyor |
| QM386 | 21 Tem 2026 | **Her satıra 🚫 Engelle butonu** eklendi (row fonksiyonu — tüm bölümlerde: Acil/Önemli, Diğer, Reklam...). Basınca onay ister, gönderici `novaBlocked`'a eklenir, o mailler hem TÜMÜ hem aktif listeden kalkar ve sonraki taramalarda gelmez (`_bl` filtresi). Engeli Ayarlar'dan geri açabilirsin |
| QM385 | 21 Tem 2026 | Hero başlığı yanındaki aktif mağaza etiketi (Marketing/Finance/Trademark/Görünürlük/Kimlik): dış kısım **beyaz zemin + siyah yazı** (eskiden mavi/beyaz), numara yuvarlağı beyaz/kırmızı kaldı |
| QM384 | 21 Tem 2026 | **Okundu / Önemli durumu sekmeler arası senkron.** Eskiden TÜMÜ'deki mailin id'sinde `A1:` öneki vardı, tek sekmede yoktu → eşleşmiyordu. Artık seen/important için **ortak ham Gmail message id** (`_gid`) kullanılıyor. TÜMÜ'de okunan mail A1/A3/A4'te de okundu; ⭐ Önemli de senkron |
| QM383 | 21 Tem 2026 | Birikim + kalıcılık **A1, A3, A4** sekmelerine de uygulandı. Her kutu ayrı localStorage anahtarında (`qm:nova:a1`, `qm:nova:x`). Hepsi ilk açılışta bir kez tarıyor, sonra 3 dk'de bir sessiz yeniliyor; sekme/sayfa değişince liste duruyor, yeniler üste ekleniyor |
| QM382 | 21 Tem 2026 | TÜMÜ artık her sekme girişinde yeniden taramıyor — yalnız ilk açılışta (liste boşsa) tarıyor, sonra 3 dakikada bir arka planda sessizce yenileri ekliyor. Gereksiz yeniden indirme kalktı |
| QM381 | 21 Tem 2026 | TÜMÜ sekmesindeki sayaç artık **okunmamış (ekranda görünen)** e-posta sayısını gösteriyor, birikmiş toplamı değil. `allItems.length` yerine `_visA.length` |
| QM380 | 21 Tem 2026 | **Sıfırlanma hatası düzeltildi.** `scanAll` bağlı kutu bulamayınca listeyi `[]` yapıp siliyordu; sekme değiştirip dönünce token'lar bir an geç yüklendiği için liste boşalıyordu. Artık boşaltmıyor, kayıtlı listeyi koruyor. Tarama sadece en az bir kutu bağlıyken çalışıyor (`_liveCount`) |
| QM379 | 21 Tem 2026 | Kaynak rozetleri kaynağa göre renklendirildi (`SRC_TEXT`): ejderusa/A1 **siyah**, novainnc/A3 **kırmızı**, ejderug/A4 **mavi**. Hem satır rozetleri hem üst künye |
| QM378 | 21 Tem 2026 | **Otomatik sürüm takibi.** Açık paneller `version.txt`'yi 2 dakikada bir kontrol ediyor; yeni sürüm çıkınca alta mavi "🔄 Yeni sürüm — Yenile" şeridi düşüyor. Dünyadaki tüm shop manager'lar push'tan sonra en geç 2 dk içinde uyarı alıp güncelleyebiliyor. `version.txt` her sürümde push edilmeli |
| QM377 | 21 Tem 2026 | TÜMÜ listesi **tarayıcıya kaydediliyor** (`localStorage`, anahtar `qm:nova:all`, en yeni 800 kayıt). Sayfa yenilense veya tarayıcı kapatılıp açılsa da liste duruyor; tarama sadece yeni gelenleri ekliyor |
| QM376 | 21 Tem 2026 | TÜMÜ listesi artık **birikiyor**. Önceki taramalar silinmiyor, yeni gelenler üste ekleniyor (id ile tekrar kontrolü). Liste `novaCacheAll`'da tutuluyor, sekme değiştirip dönünce duruyor. Güncelleme sırasında liste ekranda kalıyor, üstte "arka planda güncelleniyor" notu çıkıyor |
| QM375 | 21 Tem 2026 | NOVA AGENT açılışta doğrudan **TÜMÜ** sekmesinde başlıyor |
| QM374 | 21 Tem 2026 | NOVA AGENT altındaki "Şirket Kurma" kutusu kaldırıldı |
| QM373 | 21 Tem 2026 | TÜMÜ listesindeki kaynak rozeti yeniden tasarlandı: içi boş (beyaz), **kırmızı çerceve + kırmızı yazı**, büyütüldü ve içine **tam e-posta adresi** yazılıyor (A1/A3 kısaltması yerine). Üstteki "BAĞLI GELEN KUTULARI" künyesi de aynı stile getirildi |
| QM372 | 21 Tem 2026 | **★ TÜMÜ sekmesi.** Bağlı tüm gelen kutuları (A1 + EXTRA_INBOXES) tek taramada çekilip tarihe göre birleşik listede gösteriliyor. Her satırın solunda renkli kaynak rozeti (A1/A3/A4) + hesap adı. Üstte "BAĞLI GELEN KUTULARI" künyesi. Oku/Okundu/Cevapla işlemleri satırın kendi hesabına gidiyor (`_accId`, `_gid`, `_srcEmail`) |
| QM371 | 21 Tem 2026 | QM370'teki koruma çalışmıyordu — uyarı `#root` içine yazılıyor, sonra React render edip üstüne yazıyordu. `document.open()/write()/close()` ile tüm belge değiştirilerek React'in hiç yüklenmemesi sağlandı |
| QM370 | 21 Tem 2026 | **`file://` koruması.** Panel yerel dosyadan açılırsa çalışmayı reddedip "Canlı panele git" butonu olan bir uyarı gösteriyor. Sebep: Google OAuth `file://` adreslerini kabul etmiyor, "Access blocked / invalid_request" hatası veriyordu |
| QM369 | 21 Tem 2026 | Sol mağaza listesindeki e-posta satırlarına **A1 / A3 / A4 rozetleri** eklendi — hangi e-postanın NOVA AGENT'ta sekmesi olduğu tek bakışta görünüyor. Rozet `EXTRA_INBOXES` listesinden otomatik üretiliyor |
| QM368 | 21 Tem 2026 | Ek gelen kutuları tek tek yazılmak yerine **`EXTRA_INBOXES` listesine** taşındı. **A4 = ejderug@gmail.com** eklendi. Yeni e-posta eklemek artık listeye tek satır yazmak demek — state, tarama, teşhis, tablolar hepsi otomatik geliyor |
| QM367 | 21 Tem 2026 | **Erişim hatası düzeltildi:** `accessAddPending` erişim listesini okuyamadığında boş sanıp üzerine yazıyordu — onaylanmış herkes siliniyordu. Artık okuyamazsa hiçbir şey yazmıyor. Ayrıca kişi `members` tablosunda kayıtlıysa girişte doğrudan içeri alınıyor, onay kuyruğuna düşmüyor. Onay verildiğinde `addMember` de çağrılıyor. Erişim ✕ ile kaldırılınca `members` kaydı da siliniyor (yoksa yetki kapatılamıyordu). Önbellek kapatma meta etiketleri eklendi (`?v=` gerekmesin diye) |
| QM366 | 21 Tem 2026 | Tarama aralığı seçilebilir yapıldı — tarama butonunun yanına **3g / 7g / 30g** düğmeleri; `fetchInbox(acc, days)` parametreli hâle getirildi (30 günde `maxResults` 200'e çıkıyor) |
| QM365 | 21 Tem 2026 | A3 boş gelince sebebini yazan teşhis kutusu eklendi; hesap eşleştirme esnetildi (tam eşleşme → kullanıcı adı → içinde geçen) |
| QM364 | 21 Tem 2026 | NOVA AGENT'a **A3** sekmesi eklendi — `novainnc@gmail.com` gelen kutusu, A1 ile birebir aynı tablo yapısı |
| QM363 | — | Önceki sürüm (A1 + A2) |
