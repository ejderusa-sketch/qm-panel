# QM PANEL — OTURUM BAŞLANGIÇ TALİMATI

**HER OTURUMDA İLK İŞ:** Bu klasördeki `QM-NOTLAR.md` dosyasını oku. Projenin tüm kuralları, sürüm geçmişi ve mimarisi oradadır. Kullanıcı ayrıca söylemese bile, bu klasörde çalışmaya başlamadan önce `QM-NOTLAR.md`'yi oku.

## Özet (detay QM-NOTLAR.md'de)
- Proje: Etsy mağaza yönetim paneli. Tek dosya: `index.html` (CDN'den React + Babel).
- Yayın: `ejderusa-sketch/qm-panel` → https://ejderusa-sketch.github.io/qm-panel/
- Sahibi: EJDER — ejderusa@gmail.com

## ZORUNLU KURALLAR
1. **HER İŞ BİTİNCE COMMIT AT:** iş tamamlanınca kendin `git add -A && git commit -m "QM4xx"` yap. EJDER'in commit atmasını bekleme.
2. **SÜRÜM +1:** her değişiklikte sürüm numarası artar; 4 yerde güncellenir (üst yorum, footer rozeti, `var CURRENT=`, `version.txt`) + QM-NOTLAR.md sürüm geçmişine satır.
3. **BABEL DOĞRULA:** değişiklikten sonra JSX'i Babel ile derleyip sözdizimi hatası olmadığını kontrol et.
4. Push (yayına alma) public içerik olduğu için EJDER `YAYINLA.command`'a çift tıklar ya da onay verir.
