# QM PANEL — PROJE NOTLARI

> Bu dosya, Claude'un her yeni oturumda projeyi hatırlaması içindir.
> Yeni sohbete başlarken sadece şunu yaz: **"qm-panel klasöründeki QM-NOTLAR.md'yi oku"**

---

## 24 TEMMUZ 2026 OTURUM ÖZETİ (QM487 → QM512)

Bu oturumda yapılanlar (detay: aşağıdaki SÜRÜM GEÇMİŞİ):

- **Görünüm/pill:** Nav + Dashboard + CSV/Listing Marketing + Ayarlar (8.x) + 06 Etsy alt sekmeleri hep aynı **kırmızı hap + yeşil aktif** formatına getirildi. Pill CSS'i `.tabs.pill`'de (QM511 ile geri eklendi — silme). CSV pilleri inceltildi/küçültüldü (QM501).
- **Numara/sekme düzeni:** 06 pill = ETSY (06.1 Canlı Kaynak / 06.2 E-postalar / 06.3 Trend); 05↔06 ve 1.1.2↔1.1.5 yer değişimleri; 05 CSV tablo başlıkları 1–4. adım; 2 = SHIPSTATION (2A iptal, Etsy API kaldırıldı); 6 Identity nav kaldırıldı; Legal&Tax 10'arlı grid.
- **Mağaza numaraları 01'den** başlar (00 denemesi geri alındı, QM508). Sidebar'a tıklanınca mağaza ekleyen boş **"00" hanesi** (QM510/512).
- **Veri kalıcılığı:** `dm` localStorage cache + bulutla **merge** (geri gitmez, QM492/494); sekme seçimleri (dashView/csvView/ssView/pv) kalıcı (QM509). **Otomatik 30dk senkron kaldırıldı** (QM493) — senkron yalnız elle.
- **Yeni özellikler:** 06.3 **TREND** (yapay zekâ Etsy trend radarı, kalıcı — QM506); ShipStation **2.4 Müşteriler** (tekrarsız email+adres+sayı — QM507).
- **Yetkilendirme kaldırıldı** (QM488): onaylı üye Nova hariç tüm yetkiler + başkasını içeri alabilir. Giriş donma koruması (timeout+retry, QM489).
- **Altyapı:** ShipStation **edge function Supabase'e deploy edildi** (orderStatus=any hatası giderildi) → 2.3/2.4 çalışır. **Kural: edge function değişince Supabase → Edge Functions → shipstation → Code → Deploy updates.**
- **İş akışı kuralı:** her iş bitince Claude kendisi `git commit` atar; her oturum başında bu MD okunur (kök `CLAUDE.md`).

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
2. **Modül başlıkları ana NAV başlıklarıyla SENKRON olmalı.** ✅ **YAPILDI (QM454).** Grid artık nav ile birebir: 0 DASHBOARD · 1 CSV · 2 ETSY API · 2A SHIPSTATION · 3 FINANCE · 4 TRADEMARK · 5 SHOP MANAGER · 6 KİMLİK · 7 EKİP · 9 ETSY + GENEL (mağaza ekle / Gmail / ayarlar — nav'da sekmesi olmayan aksiyonlar). Yeni izin key'leri: `viewEtsyApi`, `viewShipstation`, `viewEtsy`. CSV/Etsy API/ShipStation/Etsy sekmeleri artık `can()` ile kapılı; `TAB_PERM`'e eklendi. **Key'ler sabit tutuldu → gating bozulmadı**; sadece etiket/numara/grup nav'a uyduruldu. Nav ileride değişirse: PERMS `group`/`code`'ları + gerekiyorsa yeni key + o sekmenin `can()` kapısı + `TAB_PERM` güncellenir.
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

**ÇEKİLEN VERİ KALICI OLMALI — ASLA HER SAYFADA YENİDEN ÇEKİLMEZ (ZORUNLU, QM492):** Bir kez çekilen veri (CSV/Ads/ROAS/Görünürlük = `dm`, mağazalar, ayarlar) **sitenin her yerinde durur**; sayfa/sekme değişince ya da tarayıcı yenilenince **kaybolmaz, yeniden çekilmez**. Mekanizma: `dm` artık **localStorage'a** da cache'lenir (`qm_dm::email`) — açılışta anında oradan gösterilir, bulut (Supabase `q:d`) arka planda gelince güncellenir. **Bulut boş/yavaş dönerse mevcut dm EZİLMEZ** (`setDm(prev=> mig varsa mig, yoksa prev)`). Yeni bir veri türü eklerken de aynı kural: önce localStorage cache → sonra bulut; boş okuma mevcut veriyi silmez. Kullanıcı "Veri Çek"e sadece **yeni** veri için basar, gördüğünü tekrar çekmek için değil.

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
4. **HER İŞ BİTİNCE CLAUDE COMMIT ATAR (ZORUNLU).** İş tamamlandığında Claude kendisi `git add -A && git commit -m "QM4xx"` yapar — EJDER'in ayrıca commit atmasını beklemez. Böylece her adım repoda kayıtlı kalır ve geri alınabilir. (Push/yayına alma: EJDER `YAYINLA.command`'a çift tıklar ya da Claude'a "yayınla" der; push public içerik olduğu için Claude her seferinde onay ister.)
5. Commit mesajı = sürüm numarası (örn. `QM487`).
6. EJDER paneli `?v=qm4xx` ile açıp doğrular (tarayıcı önbelleğini atlatmak için).

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
| QM516 | 24 Tem 2026 | NOVA AGENT: **"TÜMÜ/ALL" sekmesi → "BOX"**. A1/A2/A3/A4 sekmeleri artık **sadece BOX aktifken** görünür (`{isAll&&<Fragment>…}`); BOX'a basınca açılır, tekil kutudayken gizli. CONNECTED INBOXES + Scan All zaten BOX'a bağlıydı. Gezinme: BOX → alt kutular |
| QM515 | 24 Tem 2026 | **Mağaza numaraları 0-tabanlı** (ilk mağaza 00, NEWCUSTOMTEE 01…): `i+1 → i`. Fazladan statik "00" yer tutucu kaldırıldı (ilk gerçek mağaza zaten 00). Not: QM504→508 arası gidip gelmişti; nihai karar **00'dan başla** |
| QM514 | 24 Tem 2026 | NOVA AGENT sekmeleri (TÜMÜ · A1 · A2 · A3/A4) **dashboard kırmızı/yeşil pill** formatına çevrildi (eskiden mavi/ink + opacity dimleme). Inbox pill'lerindeki "· Gelen Kutusu/Inbox" eki kaldırıldı → yalnız e-posta görünüyor |
| QM513 | 24 Tem 2026 | ShipStation çekme **12 ay sınırı kaldırıldı → tüm geçmiş**. `ssFetchCounts`'tan `orderDateStart` çıkarıldı (tarih filtresi yok = tüm siparişler), sayfa limiti 80→200. Buton "Tüm Siparişleri Çek". 2.3 Adetler + 2.4 Müşteriler artık tüm zamanların verisini alır (sayfa 500'den az dönünce durur) |
| QM512 | 24 Tem 2026 | Sidebar **"00" hanesi tıklanabilir**: basınca `addAcct` (yeni boş mağaza eklenir, isim/email yazıp Google ile bağlanır); etiket "+ Email / Mağaza Bağla". **Ayrıca: shipstation edge function Supabase'e DEPLOY edildi** (tarayıcıdan, orderStatus=any hatası giderildi) → 2.3 Sipariş Adetleri / 2.4 Müşteriler artık çalışır. **Kural: edge function güncellenince Supabase → Edge Functions → shipstation → Code → Deploy updates** |
| QM511 | 24 Tem 2026 | **DÜZELTME:** `.tabs.pill` CSS'i (bir "geri al"da yanlışlıkla silinmişti) geri eklendi. Ayarlar alt sekmeleri (8.1–8.6, 9) QM500'de `pill` class'ı almıştı ama CSS yoktu → kutu kalıyordu; artık dashboard pill formatında (kırmızı hap + numara rozeti, aktif=yeşil). **Not:** pill haplarının CSS'i `.tabs.pill`'de; silme |
| QM510 | 24 Tem 2026 | Sidebar STORES en üstüne boş **"00" hanesi** eklendi (görsel yer tutucu, kesik çizgili, "(boş hane)"). Gerçek mağazalar 01'den devam. İleride BYDREAM için doldurulabilir |
| QM509 | 24 Tem 2026 | **Sekme seçimi kalıcı**: dashView (dashboard alt sekmesi), ssView (2 ShipStation), csvView (1 CSV), pv (06 Etsy alt sekmesi) artık localStorage'a yazılıyor (`qm_dashview`/`qm_ssview`/`qm_csvview`/`qm_policyview`). Ayrılınca/yenileyince son seçili sekme korunuyor (ana `tab` zaten `qm_tab` ile kalıcıydı) |
| QM508 | 24 Tem 2026 | **Mağaza numaralandırması geri alındı** (QM504 iptal): mağazalar tekrar **01'den** başlıyor (NEWCUSTOMTEE=01), rakamlar kaymıyor. `i → i+1` (sidebar, Legal&Tax, ROAS/Viz, Etsy API dropdown, hero rozeti) |
| QM507 | 24 Tem 2026 | **SHIPSTATION 2.4 MÜŞTERİLER**: çekilen tüm siparişlerden (ssCounts+ssOrders) **tekrarsız müşteri** (e-postaya göre dedup) e-posta+isim+adres tablosu + toplam sayı. Adres shipTo'dan, e-posta `customerEmail` (yoksa @'li `customerUsername`). "Son 12 Ay Siparişlerini Çek" ile beslenir |
| QM506 | 24 Tem 2026 | **06.3 TREND (Etsy Trend Radarı)** eklendi (06 ETSY altına). Yapay zekâ (Anthropic API, `settings.apiKey`) ile güncel ABD Etsy tasarım trendleri (t-shirt/canvas/apron) kaynaklara göre gruplu (Google/moda/Etsy forum/mevsimsel). "Yenile" üretir; sonuç `settings.trendReport`'ta **kalıcı** (bulut+localStorage), `marked` ile render. PolicyTab `pv="trends"`. İleride zamanlı görev ile otomatik yenilenebilir |
| QM505 | 24 Tem 2026 | **2 ETSY API iptal** (nav butonu silindi); **SHIPSTATION artık "2"** (eskiden 2A). Alt sekmeler 2A.1/2A.2/2A.3 → 2.1/2.2/2.3, hero başlığı 2A → 2. Etsy API içerik/izin kodu duruyor ama nav'dan erişilmiyor |
| QM504 | 24 Tem 2026 | **Mağaza numaraları 00'dan başlıyor** (ilk mağaza QM00, eskiden QM01). Tüm basım yerleri `i+1 → i`: sidebar, Legal & Tax, ROAS/Viz tabloları, Etsy API dropdown, hero aktif mağaza rozeti. Veri store ID'ye bağlı → bozulmaz |
| QM503 | 24 Tem 2026 | LEGAL & TAX mağaza listesi **10'arlı grid** (asker gibi dizildi): flex-wrap yerine `grid repeat(10,minmax(0,1fr))`, satır satır sırayla (QM01–10 · 11–20 …). Uzun isimler ellipsis + tooltip; font 11.5→11 |
| QM502 | 24 Tem 2026 | **6 IDENTITY / KİMLİK** nav sekmesi kaldırıldı (buton çıkarıldı; `zidentity` içerik/izin kodu duruyor ama nav'dan erişilmiyor) |
| QM501 | 24 Tem 2026 | CSV/LISTING MARKETING pilleri **daha ince + küçük**: gövde font 14→12 / mkSub 13→11, padding küçültüldü, çerçeve 2px→1.5px; numara rozeti minWidth 20→16, font 13→10.5 |
| QM500 | 24 Tem 2026 | AYARLAR alt sekmeleri (8.1–8.6, 9) **dashboard pill formatına** çevrildi (`.tabs` → `.tabs.pill`): kırmızı çerçeveli hap + kırmızı numara rozeti, aktif=yeşil. Artık tüm sekme/alt sekme haplarının standardı aynı |
| QM499 | 24 Tem 2026 | CSV / LISTING MARKETING pilleri **mavi → kırmızı/yeşil** (dashboard formatı): `csvView` (1.1–1.4), `_mk` (1.1.1), `_grpBtn` (1.1.2–1.1.5), `_mkSub` alt sekmeler. Pasif=kırmızı çerçeve/yazı, aktif=yeşil dolgu beyaz yazı; numara rozeti kırmızı. **Not:** panelde alt sekme haplarının yeni standart rengi artık kırmızı/yeşil (mavi/azure değil) |
| QM498 | 24 Tem 2026 | LISTING MARKETING (1.1) alt pilleri **1.1.2 ↔ 1.1.5 yer değiştirdi**: artık 1.1.2 ROAS · 1.1.5 Reklam Payı (Ad Share). Numaralar sıralı kaldı, içerik + alt sekme numaraları (1.1.2.x / 1.1.5.x) takas edildi. Key'ler (a3/roas) sabit → veri/gating bozulmadı |
| QM497 | 24 Tem 2026 | 05 CSV KAYNAĞI tablosu başlıkları **adım numaralandı**: KAYNAK=1.ADIM · KATEGORİ=2.ADIM · RAPOR=3.ADIM · TÜR=4.ADIM (süreç adımları gibi). TÜR 2/YÖNTEM/NOT aynı kaldı |
| QM496 | 24 Tem 2026 | 06 ETSY içindeki **06.1 / 06.2 artık yan yana pill (toggle)**: hangisine basılırsa onun içeriği altta görünür, diğeri gizli. PolicyTab'a `pv` state ("live"/"emails"); azure hap + kırmızı numara rozeti; kartlar `display` ile açılır/gizlenir |
| QM495 | 24 Tem 2026 | **"DEVAMLI SENKRON" HİSSİ DÜZELTİLDİ.** (1) Senkron noktası artık **yalnız gerçekten senkron olurken** yanıp söner (eskiden `qmpulse 1s infinite` hep çalışıyordu → hep senkronize sanılıyordu; artık `animation:syncing?...:"none"`). (2) Owner erişim-kontrol interval'i **20sn → 60sn**. **KURAL:** Otomatik/sürekli senkron YOK — ağır çekmeler yalnız kullanıcı Senkron/Pull butonuna basınca. Canlıda hâlâ sürüyorsa fix'ler **push edilmemiştir** (YAYINLA gerekir) |
| QM494 | 24 Tem 2026 | **VERİ GERİ GİTMEZ.** Açılışta yerel (localStorage) + bulut `dm` **birleştiriliyor** (her anahtarda daha dolu/uzun olan tutulur). Bulut eski/az veri dönerse yereldeki güncel veriyi artık EZMEZ; hiçbir kayıt geri gitmez/kaybolmaz. Birleşmiş dm hemen localStorage'a yazılır, save effect ile buluta da yansır (bulut kendini onarır). Kural: veri okumaları **replace değil MERGE** (dolu olanı koru) |
| QM493 | 24 Tem 2026 | **OTOMATİK 30dk SENKRON KALDIRILDI.** Eskiden her 30dk'da tüm mağazaları (57×5 çekme) otomatik senkronluyordu → "sürekli senkron / bilgi akıyor / durmuyor" hissine sebep oluyordu. Artık senkron **yalnız elle** (Senkron butonu). Veri zaten kalıcı (QM492 localStorage cache) olduğu için otomatik çekmeye gerek yok. Kural: ağır toplu çekme işlemleri (syncAll/pullAllCSV) **otomatik interval'a bağlanmaz**, yalnız kullanıcı tetikler |
| QM492 | 24 Tem 2026 | **ÇEKİLEN VERİ ARTIK KALICI.** `dm` (CSV/Ads/ROAS/Görünürlük verisi) localStorage'a da cache'lenir (`qm_dm::email`) → sayfa/sekme değişince ya da tarayıcı yenilenince veri kaybolmaz, yeniden çekilmez; açılışta anında görünür, bulut arka planda günceller. Bulut boş/yavaş dönerse mevcut dm **ezilmez** (`setDm(prev=>mig varsa mig, yoksa prev)`). Kural MD'ye yazıldı (VERİ GÜVENLİĞİ bölümü) |
| QM491 | 24 Tem 2026 | DASHBOARD 06 pill adı **"NEW ETSY POLICY" → "ETSY"**. İç bölümler 6'nın altına alındı: 03.1/03.2 → **06.1 (Etsy Policy — Canlı Kaynak)** / **06.2 (Etsy Policy — E-postalar)** |
| QM490 | 24 Tem 2026 | DASHBOARD pilleri **05 ↔ 06 yer değiştirdi**: 05 CSV KAYNAĞI (`csvsrc`) · 06 NEW ETSY POLICY (`policy`). Numaralar sıralı kaldı, içerik takas edildi |
| QM489 | 24 Tem 2026 | **GİRİŞ DONMA KORUMASI.** Gate (yetki kontrol) Supabase sorgularına **7sn zaman aşımı + 3 kez tekrar** eklendi (`wt()` = Promise.race timeout; `accessGet`, `members`, `accessAddPending` sarıldı). DB asılırsa artık sonsuz "Yetki kontrol ediliyor" ekranında donmuyor; **"Bağlantı yavaş — Yeniden Dene"** ekranı çıkıyor (`gate==="retry"`, `gateTry` sayacı butona basınca kontrolü yeniden tetikler). NOT: kök sebep genelde Supabase compute (Nano→Micro) veya proje uykuda — bunu Supabase panelinden düzelt |
| QM488 | 24 Tem 2026 | **YETKİLENDİRME KALDIRILDI.** Linkle içeri giren onaylı her üye **NOVA AGENT hariç TÜM yetkilere** sahip (bootstrap'ta `currentPermissions=null`). Nova zaten `currentRole==="admin"` ile korunur → üye göremez. `manageTeam` de açık olduğundan **üye başkasını onaylayıp içeri alabilir**. 8.1'deki granüler modül seçimi (P/all) işlevsiz kaldı; açıklama notu güncellendi. Owner (ejderusa) her zaman admin=tüm yetki + Nova |
| QM487 | 24 Tem 2026 | **DASHBOARD → 07 NOTLAR (MD)** alt sekmesi. Panel kendi `QM-NOTLAR.md`'sini `fetch("QM-NOTLAR.md?t=…")` ile çekip **marked.js** (CDN) ile render eder — başlık/tablo/kod biçimli (`.mdbox` CSS). "Yenile" butonu var; MD her push'ta panelde otomatik güncel görünür. `NotlarMD` bileşeni, `dashView==="notlar"`. Ayrıca kök klasöre **`CLAUDE.md`** eklendi → her oturumda QM-NOTLAR.md otomatik okunur; **"her iş bitince commit"** kuralı yazıldı |
| QM486 | 24 Tem 2026 | CSV Kaynagi tablosu # sutunu hiyerarsik: 1.1 Listing · 1.2 ROAS · 1.3 Revenue · 1.4 Statement (CSV alt sekmeleriyle eslesir) |
| QM485 | 24 Tem 2026 | LISTING MARKETING pillerinden (CSV 1)/(CSV 2) parantezleri kaldirildi (1.1.1 etsy ads, 1.1.5 roas) |
| QM484 | 24 Tem 2026 | CSV alt sekmesine 1.3 REVENUE ve 1.4 STATEMENT pilleri eklendi (placeholder icerik: Dashboard/Stats/Revenue ve Finances/Activity Summary). CSV turleri artik: 1.1 Listing · 1.2 ROAS · 1.3 Revenue · 1.4 Statement |
| QM483 | 24 Tem 2026 | CSV kaynak tablosuna TUR 2 (TYPE 2) sutunu eklendi: Listing->LISTING, ROAS->ROAS, View All->REVENUE, Activity Summary->STATEMENT (turuncu) |
| QM482 | 24 Tem 2026 | CSV 1.2 pill etiketi "MARKETING ROAS" -> "ROAS" |
| QM481 | 24 Tem 2026 | CSV kaynak tablosunda 1 ile 2 nolu satir yer degistirdi (1=Listing/Screenshot, 2=ROAS). Tutarlilik icin pill etiketleri de guncellendi: 1.1.1 Etsy Ads (CSV 1), 1.1.5 ROAS (CSV 2) |
| QM480 | 24 Tem 2026 | LISTING MARKETING 1.1.1 Etsy Ads pill'i "Etsy Ads (CSV 2)" oldu (CSV kaynak tablosu 2 nolu satir referansi) |
| QM479 | 24 Tem 2026 | 06 CSV Kaynagi kartindaki "Veri Cek" butonu kaldirildi (ROAS/Visibility'dekiler kaldi). LISTING MARKETING 1.1.5 ROAS pill'i "ROAS (CSV 1)" oldu (CSV kaynak tablosundaki 1 nolu satira referans) |
| QM478 | 24 Tem 2026 | GORSEL TEMIZLIK: (1) TUM webden emoji/ikonlar kaldirildi (siralama oklari ve geometrik isaretler korundu). (2) Dash pilleri: 02 sadece "trademark"; 03 ile 05 yer degisti (03 visibility, 05 new etsy policy); pill+badge kenarlari SOLUK kirmizi (rgba .38/.4), yazilar buyudu (13.5px) ve kirmizi |
| QM477 | 24 Tem 2026 | 06 CSV KAYNAGI icine kaynak tablosu eklendi (No·Kaynak·Kategori·Rapor·Tur·Yontem·Not — Etsy Ads/ROAS, Etsy Ads/Listing/Screenshot, Dashboard/Stats/View All, Finances/Activity Summary). Dash pilleri 01-05 kucultuldu (12px), 06 buyuk kaldi (14px, one cikiyor) |
| QM476 | 24 Tem 2026 | DASHBOARD'a 06 CSV KAYNAGI pill'i eklendi (01-05 aynen duruyor, nesting YOK). Icerik: CSV Kaynagi karti + "Veri Cek" butonu (pullAllCSV — tum bagli magazalarin Etsy Ads CSV'sini toplu ceker). ROAS/Gorunurluk bu veriden beslenir |
| QM475 | 24 Tem 2026 | GERI ALINDI: QM474'teki "06 CSV KAYNAGI" gruplamasi iptal edildi. Dash pilleri tekrar 01 alarming · 02 trademark · 03 new policy · 04 roas · 05 visibility (QM473 duzeni). csvsrc + 06.1/06.2 alt satiri kaldirildi |
| QM474 | 24 Tem 2026 | (iptal edildi) DASHBOARD: 06 CSV KAYNAGI gruplamasi |
| QM473 | 24 Tem 2026 | Aktif dash pill YESIL (aktif=yesil temasi) — pasifler kirmizi kenar/yazi |
| QM472 | 24 Tem 2026 | Dash 01-05 pill etiketlerinden "ALL" onu kaldirildi; 05 ingilizce "VISIBILITY"; yazilar KIRMIZI (kenar+metin red, aktif kirmizi zemin beyaz) ve buyudu (14px) |
| QM471 | 24 Tem 2026 | Pill rozet numaralari (yuvarlak icindekiler) daha da buyudu: dash 13, CSV/LISTING 13, mkSub 12, nav .tl 13 — daha belirgin |
| QM470 | 24 Tem 2026 | 2A SHIPSTATION'a 2A.3 "Sipariş Adetleri" alt sekmesi: magaza bazli, dönem sutunlari Son 7 Gün + Son 1-12 Ay (birikimli) sipariş adetleri. ssFetchCounts son 12 ayin tüm siparişlerini sayfalayarak (pageSize 500, status:any, orderDateStart) çeker, advancedOptions.storeId + orderDate'e göre gruplar. TOPLAM satiri. NOT: shipstation edge function GUNCELLENDI (orderDateStart/End + status any/all) → yeniden deploy gerekli |
| QM469 | 24 Tem 2026 | DASHBOARD pill'i tekrar BUYUK HARF (lowercase kaldirildi); tum pill rozet numaralari (yuvarlak icindekiler) font buyudu (dash 7.5→10.5, CSV/LISTING 9→11, mkSub 8.5→10) |
| QM468 | 24 Tem 2026 | Aktif magaza pill'i (hero'daki QM# + isim) de YESIL (yesil kenar + acik yesil zemin + yesil rozet) — aktif basliklarla uyumlu |
| QM467 | 24 Tem 2026 | Aktif (tiklanan) ana baslik + hero .mk artik YESIL. Pill etiketleri kucuk harf (textTransform:lowercase): DASHBOARD + 01-05 dash pilleri, CSV/LISTING/ROAS pilleri, _mk/_mkSub/_grpBtn |
| QM466 | 23 Tem 2026 | GORSEL: ana nav basliklari buyudu (.tabs button 10→12.5px, maxW 84→130); .rules/.rh/.hero/.mk kartlari inceltildi (yer acildi); DASHBOARD hero basligi kucuk+YESIL; DASHBOARD 01-05 pill'leri kucultuldu; CSV/LISTING pill yuvarlaklari (badge) kucuk + yazilari buyuk (14px) |
| QM465 | 23 Tem 2026 | Nav 2 SATIR oldu: UST satir = 0 DASHBOARD + (dash acikken) 01-05 alt sekmeleri (ALARMING/TRADEMARK/POLICY/ROAS/GORUNURLUK) YAN YANA; ALT satir = diger ana basliklar (A NOVA · 1 CSV · 2 · 2A · 3 · 4 · 5 · 6 · 7 · 9). Alt sekmeler artik icerikte degil ustte, dashboard'in yaninda; araliklar acildi (gap 18) |
| QM464 | 23 Tem 2026 | (1) 05 GORUNURLUK Embroidery/Apron BUG DUZELTILDI: categorize() DIZI donduruyor (.category/.views), obje gibi (cm.embroidery.totalViews) okunuyordu → hep %0/Diger cikiyordu. Artik label'a gore (regex embroidery/apron) toplaniyor. (2) 04 ROAS + 05 GORUNURLUK'e "Veri Cek" butonu (tum bagli magazalarin Etsy Ads CSV'sini Gmail'den ceker — fetchStoreCSV dongusu). (3) QM ve MAGAZA sutun basliklari da tiklanabilir siralanir (idx / isim localeCompare) |
| QM463 | 23 Tem 2026 | Yetkilendirme (8.1) MODUL IZINLERI grid'i derli toplu: sabit 4-sutun grid yerine cok-sutun (masonry) paketleme (columns:4 190px, breakInside:avoid) — moduller yan yana bosluksuz, DASHBOARD/SHOP MANAGER gibi tek satirlik gruplar bosluk birakmiyor |
| QM462 | 23 Tem 2026 | DASHBOARD'a 04 ALL ROAS yanina 05 ALL GORUNURLUK eklendi (renderAllViz): 1.3.1 Gorunurluk Dagilimi formatinin TUM MAGAZALAR hali — soldan magazalar, yaninda Views + Embroidery / Apron / Diger gorüntülenme payi (categorize/CATS). Ayni donem secici + istatistik seridi (Views + Embroidery/Apron/Diger %), sutun basliklari tiklanabilir siralanir (vizSort). ROAS bos mesaji da Etsy Ads/1.1'e guncellendi |
| QM461 | 23 Tem 2026 | ALL ROAS SADECE Etsy Ads CSV'sinden (dm[id/ay], mağaza toplamı Revenue÷Spend). Gunluk ROAS CSV (/R/) ikincil kaynagi ve R/L rozeti kaldirildi — LISTING MARKETING ile karistirilmiyor. Ust sayac (X/57) kac magazada Etsy Ads verisi oldugunu gosterir; Son 6 Ay secilince aylar toplanir |
| QM460 | 23 Tem 2026 | LISTING MARKETING (1.1) alt pilleri HIYERARSIK numaralandi: 1.1.1 Etsy Reklamlar · 1.1.2 Reklam Payi (1.1.2.1/1.1.2.2) · 1.1.3 CTR (1.1.3.1/1.1.3.2) · 1.1.4 Gorunurluk (1.1.4.1/1.1.4.2) · 1.1.5 ROAS (1.1.5.1/1.1.5.2). Eski 1.0/1.1/1.2/1.3/1.4 (ust pillerle cakisiyordu) kaldirildi |
| QM459 | 23 Tem 2026 | ALL ROAS artik iki kaynaktan: bir magazada gunluk ROAS CSV (/R/) yoksa LISTING MARKETING (/ay) verisinden ROAS hesaplaniyor (impressions→views). Boylece herhangi bir CSV yuklu HER magaza gorunuyor. Satirda kaynak rozeti: R = gunluk ROAS · L = listing. Aciklama guncellendi |
| QM458 | 23 Tem 2026 | CSV altindaki "1.2A ALL ROAS" alt sekmesi kaldirildi (DASHBOARD 04'te zaten var). renderAllRoas() fonksiyonu duruyor, sadece DASHBOARD'da kullaniliyor |
| QM457 | 23 Tem 2026 | ALL ROAS tablosunda her sayi sutunu (Views/Clicks/Orders/Revenue/Spend/ROAS) basligina TIKLANIP azdan coga / coktan aza siralanabiliyor (▼/▲/⇅ gostergesi, allSort state). Tek ROAS toggle butonu kaldirildi; TOPLAM satiri en ustte sabit |
| QM456 | 23 Tem 2026 | ALL ROAS artik Marketing ROAS (1.2) TARZINDA: ayni donem secici (ay dropdown + Son 1-6 Ay), ayni istatistik seridi (Views/Clicks/Orders/Revenue/Spend/ROAS), GERCEK ROAS CSV verisinden (dm[storeId/R/ay], onceden yanlis anahtar okuyordu). Ortak `renderAllRoas()` fonksiyonuna cikarildi → hem DASHBOARD 04'te hem CSV altinda "1.2A ALL ROAS" alt sekmesinde (Marketing ROAS'in yaninda) gosteriliyor. Tum magazalar alt alta, en iyiden kotuye siralanabilir |
| QM455 | 23 Tem 2026 | 04 ALL ROAS artik BOS DURUMDA BILE tum magazalari alt alta listeliyor (QM1..QMn), saginda ROAS/karar; verisi olmayan satirlar soluk (opacity .5) ve "—" gosterir; veri gelince sirasi degisir. Bos ekran mesaji kaldirildi, yerine tek satir not |
| QM454 | 23 Tem 2026 | **YETKİ ↔ NAV SENKRON (8.1).** Yetki modül başlıkları/numaraları artık üst nav ile birebir aynı (0 DASHBOARD · 1 CSV · 2 ETSY API · 2A SHIPSTATION · 3 FINANCE · 4 TRADEMARK · 5 SHOP MANAGER · 6 KİMLİK · 7 EKİP · 9 ETSY + GENEL). Yeni izinler `viewEtsyApi`/`viewShipstation`/`viewEtsy`; CSV/Etsy API/ShipStation/Etsy sekmeleri `can()` ile kapatıldı, `TAB_PERM` güncellendi. Key'ler sabit → gating bozulmadı, owner=admin hepsini görür |
| QM453 | 23 Tem 2026 | **DASHBOARD → 04 ALL ROAS** alt sekmesi. Tüm QM mağazalarının ROAS'ı tek tabloda; **en iyiden kötüye / kötüden en iyiye** sıralanabilir (▼/▲). Dönem seçici (1ay/3ay/6ay/1yıl, `dm[storeId+"|"+period]` verisinden `revenue/spend`). Renk + karar rozeti (BÜYÜT ≥ hedef ROAS · İZLE ≥ alt ROAS · KAPAT). TOPLAM/ORTALAMA satırı; verisi olmayan mağazalar altta ayrı listelenir. ShipStation'la ilgisi yok — DASHBOARD altında |
| QM452 | 23 Tem 2026 | UYE KORUMASI: onaylanmis uye/arkadas listesi (mgrList) artik bos yazilip SILINEMEZ (_mgrGuardLen — gorulen en yuksek uye sayisindan sonra bos yazma bloklanir). DB krizi/bos okuma uyeleri silmez. Kural: iceri giren owner cikarana kadar kalir |
| QM451 | 23 Tem 2026 | Yetkilendirme (8.1): QM magaza listesi karttan kaldirildi (magaza-bazli yetki simdilik kapali → onayli herkes tum magazalari gorur, bootstrap currentStores="ALL"). Yeni yetki karti ACIK gelir. NOVA AGENT zaten owner'a ozel/yetki listesinde yok. (Modul basliklarini nav ile tam senkronlama ayri is — MD'de spec) |
| QM450 | 23 Tem 2026 | Gorunurluk Dagilimi (1.3.1) tepesine "Apron / Onluk" ayri karti (turuncu, ayri yuzde) — CATS'e apron kategorisi eklendi (\bapron), Embroidery + Apron + Other uc kart |
| QM449 | 23 Tem 2026 | Trademark (4) sekmesinde her kaydin altina "Tur: Trademark/Copyright/Politika" degistirme dugmesi (upC type) — yanlis siniflanan (or QM32) tek tikla duzeltilir, Dashboard'da dogru sutuna gecer |
| QM448 | 23 Tem 2026 | VERI GUVENLIGI: (1) bos/basarisiz bulut okumasi sol menuyu BOSALTMAZ (am.length yoksa mevcut/onbellek kalir), (2) buluta ASLA bos magaza listesi yazilmaz (accounts bos ise store.set atlanir). Boylece DB yavas/bos yanit verse bile magazalar silinemez, onbellekten kendini onarir |
| QM447 | 23 Tem 2026 | Onbellek artik HESABA OZEL (qm_accts::email / qm_settings::email) — baska hesabin (or novainnc) bos verisi yanlislikla gorunmuyordu; ejderusa'ya gecince kendi 78 magazasi gelir |
| QM446 | 23 Tem 2026 | HIZ 2: "Hesap hazirlaniyor" ekrani da artik aninda geciliyor — oturum/rol bilgisi onbellege alinip (qm_boot) acilista ANINDA ready oluyor, dogrulama (bootstrap) arka planda. Birakilan sekmeye (qm_tab) aninda donuluyor |
| QM445 | 23 Tem 2026 | HIZ: magaza+ayar cihazda onbellege alinip (localStorage qm_accts/qm_settings) acilista ANINDA gosteriliyor, bulut yuklemesi arka planda + paralel (Promise.all). Ikinci acilistan itibaren panel aninda acilir. + Login ekranina "Sifremi unuttum" butonu (resetPasswordForEmail -> e-postaya sifirlama linki) |
| QM444 | 23 Tem 2026 | 2A SHIPSTATION siparis gorunumu ShipStation ekrani gibi iki panelli: solda magaza listesi (sipiris sayilariyla, tiklaninca filtre) + sagda siparis tablosu (Yas·Magaza·Alici·Siparis#·Tarih·Urun·SKU·Servis·Adet·Tutar). Cek butonu magazalari da otomatik getirir. Varsayilan gorunum orders |
| QM443 | 23 Tem 2026 | DASHBOARD pill numara rozetleri daha da kucultuldu (minWidth 13, fontSize 8, ince cerceve), sayilar siyah |
| QM442 | 23 Tem 2026 | DASHBOARD alt sekme etiketleri "ALL ..." + pill numara rozetleri kucultuldu (sayi siyah). Sol menu magaza numara kutulari cerceve KIRMIZI, sayilar kucuk+bold |
| QM441 | 23 Tem 2026 | NEW POLICY (03) artik gosterirken de ihlal/uyari e-postalarini gizliyor (eski taranmis veri dahil) — "we removed", "follow our IP policy to stay active" vb. 03'ten kalkti (bunlar 02.3'te). NEG kivrik apostrof (') destegi. trEtsy "we removed" sablonu da kivrik apostrofu ceviriyor |
| QM440 | 23 Tem 2026 | CSV sekmesi artik "1" numarali; LISTING MARKETING ve MARKETING ROAS onun ALTINA alt sekme oldu (1.1 / 1.2, mavi pill+kirmizi rozet). Eski ust sekmeler kaldirildi; varsayilan tab csv, eski qm_tab (marketing/roasmkt) otomatik gecis |
| QM439 | 23 Tem 2026 | DASHBOARD'dan sonra yeni ust sekme: "0A CSV" (CSV Merkezi) — iki CSV turu (1 LISTING MARKETING / 1A MARKETING ROAS) referans karti + genisletilecek. Icerik bekliyor |
| QM438 | 23 Tem 2026 | Legal 3-madde ozetleri OTOMATIK cikiyor (liste gelince, apiKey varsa) ve KALICI (settings.policyBullets, buluta kaydedilir). Kart iki sutunlu: sag boslukta ozet 1/2/3 numarali, BOLD, MAVI. Manuel "3 Maddede Ozetle" butonu sadece ozet yoksa gorunur (apiKey yoksa yedek) |
| QM437 | 23 Tem 2026 | Numaralandirma: DASHBOARD rozeti "0"; ALARMING bolumu 01.1; TRADEMARK DASHBOARD pill/basliklari 02.1/02.2/02.3 + baslik "02 · Tumu"; NEW POLICY ic bolumleri 03.1 (Canli Kaynak) / 03.2 (E-postalar). Legal satirlarina "3 Maddede Ozetle" (aiBullets) butonu |
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
