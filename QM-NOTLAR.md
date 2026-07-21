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

- Sürüm numarası dosyada **iki yerde**: en üstteki HTML yorumu ve alt bilgideki `QM3xx ☁️` rozeti.
- Her değişiklikte numara **+1** artar (QM364 → QM365 → QM366...).
- Aynı anda en üstteki yorum bloğuna tek satır özet eklenir.
- Bu dosyanın "SÜRÜM GEÇMİŞİ" bölümü de güncellenir.

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
- **A3** — `novainnc@gmail.com` gelen kutusu (mağaza listesindeki 50 numaralı kayıt)

Her gelen kutusu kendi state'ini tutar: A1 → `items`, A3 → `items3`.
Aktif hesap `curAcc`, aktif liste güncelleyici `curSet` ile seçilir.
Bölümler: Okul/Skyward · Acil/Önemli · Diğer · Reklam-Junk.

## SÜRÜM GEÇMİŞİ

| Sürüm | Tarih | Değişiklik |
|---|---|---|
| QM366 | 21 Tem 2026 | Tarama aralığı seçilebilir yapıldı — tarama butonunun yanına **3g / 7g / 30g** düğmeleri; `fetchInbox(acc, days)` parametreli hâle getirildi (30 günde `maxResults` 200'e çıkıyor) |
| QM365 | 21 Tem 2026 | A3 boş gelince sebebini yazan teşhis kutusu eklendi; hesap eşleştirme esnetildi (tam eşleşme → kullanıcı adı → içinde geçen) |
| QM364 | 21 Tem 2026 | NOVA AGENT'a **A3** sekmesi eklendi — `novainnc@gmail.com` gelen kutusu, A1 ile birebir aynı tablo yapısı |
| QM363 | — | Önceki sürüm (A1 + A2) |
