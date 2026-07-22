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
