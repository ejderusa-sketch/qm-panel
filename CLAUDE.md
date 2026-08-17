# QM PANEL — OTURUM BAŞLANGIÇ TALİMATI

**HER OTURUMDA İLK İŞ:** Bu klasördeki `QM-NOTLAR.md` VE `EJDER-100-ISTEK.md` dosyalarını oku. Projenin tüm kuralları, sürüm geçmişi ve mimarisi oradadır. Kullanıcı ayrıca söylemese bile, bu klasörde çalışmaya başlamadan önce `QM-NOTLAR.md`'yi oku.

**AYRICA:** `EJDER-100-ISTEK.md` = EJDER'in geriye dönük 100 ana isteği + hiç bozulmayacak kurallar. Her oturum oku, aynı hatayı yapma.

## Özet (detay QM-NOTLAR.md'de)
- Proje: Etsy mağaza yönetim paneli. Tek dosya: `index.html` (CDN'den React + Babel).
- Yayın: `ejderusa-sketch/qm-panel` → https://ejderusa-sketch.github.io/qm-panel/
- Sahibi: EJDER — ejderusa@gmail.com

## ZORUNLU KURALLAR
1. **HER İŞ BİTİNCE COMMIT AT:** iş tamamlanınca kendin `git add -A && git commit -m "QM4xx"` yap. EJDER'in commit atmasını bekleme.
2. **SÜRÜM +1:** her değişiklikte sürüm numarası artar; **5 yerde** güncellenir: (1) üst yorum, (2) footer rozeti `<b>GITHUBxxx</b>`, (3) **hero/üst köşe rozeti `(GITHUBxxx)` — hero span, ~satır 2462, KOLAY UNUTULUR**, (4) `var CURRENT=`, (5) `version.txt` + QM-NOTLAR.md sürüm geçmişine satır. NOT: kullanıcının ekranda gördüğü sürüm ÜST köşedeki `(GITHUBxxx)` rozetidir — bunu güncellemezsen kullanıcı sürümü hep eski sanır.
3. **BABEL DOĞRULA:** değişiklikten sonra JSX'i Babel ile derleyip sözdizimi hatası olmadığını kontrol et.
4. Push (yayına alma) public içerik olduğu için EJDER `YAYINLA.command`'a çift tıklar ya da onay verir.
5. **VERİ KALICILIĞI (0 numaralı kural):** çekilen/senkronlanan/indirilen HİÇBİR veri geri gitmez/sıfırlanmaz — tüm QM + NOVA için `localStorage` + bulut, boş okuma mevcut veriyi EZMEZ. Detay QM-NOTLAR.md'nin en üstünde.


**SKILL:** Bu kurallar artik Cowork skilli olarak da kayitli: `github-panel` (cekirdek 17 kural) + `github-panel-100` (100 madde, sira no ile). Her oturum otomatik devreye girer; degisiklik olursa save_skill ile guncelle.
