# EJDER — 100 MADDE ANA İSTEKLER (geriye dönük tüm yazışmalardan)

> **BU DOSYA HER OTURUMDA OKUNACAK. EJDER'İN İSTEKLERİ VE TEKRARLANAN HATALAR BURADA. AYNI HATAYI BİR DAHA YAPMA.**

---

## ⛔ 0 — HİÇ BOZULMAYACAK KURALLAR (EN KRİTİK — HER ŞEYDEN ÖNCE)

### **1. VERİ ASLA KAYBOLMAYACAK. Çekilen/senkronlanan/indirilen hiçbir bilgi geri silinmez, sıfırlanmaz.**
### **2. YENİSİ ÜSTÜNE EKLENİR — boş okuma mevcut veriyi EZMEZ (0-kural).**
### **3. GÜNCELLENEN BİLGİ TEKRAR ÇEKİLMEZ — bir kez indi mi kalıcıdır (localStorage + IndexedDB + bulut).**
### **4. SAYFADAN AYRILIP DÖNÜNCE AYNI EKRANA/SEKMEYE DÖNÜLÜR.**
### **5. MD'YE YAZ. Kuralları MD'ye yaz, aynı hatayı tekrar etme. MD'yi UNUTMA.**
### **6. KURNAZLIK YOK, YALAN YOK. Bilmiyorsan "bilmiyorum" de; uydurma, "hallettim" deme.**
### **7. HER İŞ BİTİNCE: commit + sürüm +1 (5 yer) + Babel doğrula. EJDER beklemesin.**
### **8. SHIPSTATION'A DOKUNMA — o ayrı sistem.**
### **9. SOL PANELDEKİ (NOVA) MAĞAZA LİSTESİ ÖLÇÜDÜR — tüm tablolar ona birebir uyar, mağaza hiç kaybolmaz.**
### **10. GÜNCELLEME ARTIMLIDIR — "son 1 hafta" dediysem sadece onu çek, hepsini baştan sona çekme.**

---

## 🔴 A — VERİ KALICILIĞI / KAYBOLMA (en çok tekrarlanan şikâyet)

11. **Güncellediğimiz bilgiler kayboluyor — kaybolmasın.**
12. **Senkronize olmuş bilgi neden geri siliniyor? Kalsın, kaybolmasın.**
13. Yenisi varsa üstüne eklensin (append), eskiyi silme.
14. Güncellenen bilgi yeniden yüklenmesine gerek kalmasın (MD'ye yazdım dedin, unutuyorsun).
15. "Yine yine bilgiler silindi, bıktım."
16. Revenue 16+ mağazada güncellemiyor — kök sebep localStorage dolu; çekilen kaydedilemiyor.
17. New Era (16. mağaza) revenue.csv Gmail'de VAR ama inmiyor — "yalan söyleme", çekilmiyor.
18. Mağazalar sol panelden düşüyor / "Henüz mağaza yok" görünüyor — hiç kaybolmasın.
19. Download olmuş bilgiler neden siliniyor?
20. Her yenilemede tekrar login yapmak zorunda kalıyorum — çözülsün (localStorage dolu sebebiydi).

## 🟠 B — GÜNCELLE (UPDATE) BUTONU + TIME (ZAMAN) PİLLERİ

21. **BÜTÜN başlıklara/tablolara GÜNCELLE butonu koy — her yerde olsun.**
22. **Her GÜNCELLE'nin yanında TIME (1G/1H/1AY/1YIL/ALL) pilleri olsun.**
23. **Tüm GÜNCELLE'ler AYNEN legal/trademark'taki gibi olsun — sağ tarafta GÜNCELLE + time.**
24. GÜNCELLE'yi sağ tarafa al.
25. GÜNCELLE'yi time'ın üstüne ortaya al.
26. UPDATE bütün aylara bakmasın — sadece seçili aralığı çeksin.
27. Güncellerken o tarihe gitsin, hepsini baştan çekmesin (artımlı).
28. CSV'deki bütün güncellemeleri böyle (time'lı) yap.
29. D-2 Activity Summary ve D-3 Depozito'ya da GÜNCELLE + time koy.
30. Güncelleme anında insin ve sütuna eklensin.

## 🟡 C — BAŞLIKLARI CANLI (SIRALANABİLİR) YAP

31. **Bütün başlıkları CANLI yap — tıklayınca sıralansın (githubdaki TÜM tablolar).**
32. Başlığa tekrar basınca sıralama yönü değişsin (▲/▼).
33. # (sıra) başlığı da canlı olsun, sıralayabileyim.
34. NO başlığı çalışmıyor — düzelt, sayısal sıralasın (1→56).
35. Store NO tutmuyor — NOVA panelini ölçü al, birebir yap, hep öyle olsun.
36. MAĞAZA / E-POSTA / SPEND / REVENUE / FEES / % başlıkları hepsi sıralanabilir.
37. GENEL (toplam) satırı sıralamada hep en üstte kalsın.
38. Tablolardaki başlıklar dashboard ile aynı olsun.
39. Görünürlük/CTR/ROAS tablolarında da başlıklar canlı.
40. Sıralama sonrası # sabit 1,2,3… saysın (mağaza NO ayrı sütun).

## 🟢 D — TABLO DÜZENİ / GÖRÜNÜM

41. Excel gibi yap — rakamlar dans etmesin, hanelerin içine otursun (grid, sabit kolon).
42. GENEL toplam satır başında, çerçeve içinde, sarı fon/siyah yazı, kalın.
43. Boşluklar çok — yarıya indir, yaklaştır.
44. Başlıkları yan yana al — alt satıra kaymasın (tek satır, sığmazsa yatay kaydır).
45. Bunları kibarca yan yana koy.
46. Tablolar tam ekranı kaplasın.
47. Tabloların ebadı/formatı hepsi yan yana aynı boyutta olsun.
48. Bu kısımları kırmızı yap (giderler kırmızı).
49. Yıl sütunları yeşil/kırmızı olsun; 2024→2025→2026 sırayla.
50. Mağaza numarasını toplamın yanında kare içinde kırmızı yaz.

## 🔵 E — DASHBOARD YAPISI / NAVİGASYON (A/B/C/D)

51. **Dashboard'u grupla: A ALARMING · B MARKETING · C DASHBOARD · D FINANCE.**
52. A dashboard'unkiler A'nın ALTINA (yan tarafta değil, alt satırda).
53. A-01 / A-02 / A-03 diye numaralandır (ALARMING/TRADEMARK/ETSY).
54. B-01…B-06 diye numaralandır (CSV/M.ROAS/GÖRÜNÜRLÜK/REVENUE/CTR/SPEND-REV%).
55. Etsy Legal'i C grubuna al; 08 içerde izinliler C'ye.
56. FINANCE'i büyük başlık D yap; C ile D yer değiştir.
57. Piller ekranda görünür olsun, sola çek.
58. Pilleri küçült, küçük harf, yuvarlak az yer kaplasın.
59. Nav sabit (sticky) olsun.
60. Her pill bağımsız yansın (aktif olan dolu renk).

## 🟣 F — CSV / E-POSTA OKUMA (APISIZ ama OTOMATİK)

61. **CSV'leri e-postalardan OTOMATİK çek (her zaman yaptığın gibi) — dışarıdan/elle değil.**
62. API rozetini (API·ON/OFF) kaldır — ama ShipStation'a dokunma, e-posta çekimi kalsın.
63. Revenue.csv Etsy Shop Stats formatını tanı (Visits/Orders/Conversion/Revenue).
64. Etsy Legal (3.7) bilgilerini AI/API'den değil CSV'den oku.
65. Guncellerken CSV'ler neyse okuyunca yerleştir — ay ay uğraştırma.
66. Gmail hız-limiti (429) olunca backoff ile tekrar dene — mağazalar boş kalmasın.
67. Hedefli Gmail sorgusu (revenue/statement/ads) — doğru CSV 40 limitine takılmasın.
68. Copyright "Etsy Formu" butonu boş/yanlış sayfa açıyor — doğru counter formunu aç.
69. 41 no'lu mağaza CSV'sinde "month 6" okunamadı — ay ayrıştırmayı düzelt.
70. CSV kaynağı tablosu Excel'e birebir uysun (CSV NO / 2-3-4.ADIM / TARİH / YÖNTEM / MAKE).

## 🟤 G — 05.3 M-SPEND ÷ D-REVENUE TABLOSU

71. **SPEND al, REVENUE al, yan yana koy; SPEND'in REVENUE'ye oran %'sini koy.**
72. En üst satırda GENEL (toplam) olsun.
73. Başlığı "(M-SPEND ÷ D-REVENUE)" yap.
74. Sabit SIRA NO (#) sütunu ekle — sıralama ne olursa 1,2,3… saysın.
75. Sol paneldeki TÜM mağazalar hep görünsün (verisi olmasa da $0, kaybolmasın).
76. Bu başlıkları canlı/sıralanabilir yap.
77. **Buraya FEES sütununu ekle — D-2 Activity Summary'deki FEES'in AYNISI, SPEND'in ÖNÜNE koy.**
78. % renk: <25 yeşil, ≥40 kırmızı, arası amber.
79. GÜNCELLE + time pilleri buraya da.
80. SPEND $0 görünenler → marketing CSV inmemiş; çekilince dolsun.

## ⚫ H — FINANCE / STATEMENT / ACTIVITY SUMMARY / DEPOZİTO

81. Revenue yanına FINANCE başlığı; Statement + Activity Summary altına.
82. Activity Summary: mağaza mağaza Net Kâr + Sales/Fees/Marketing/Shipping; başlığa tıkla → detay.
83. SALES/NET yeşil, FEES/MARKETING kırmızı, SHIPPING mavi renk kodu.
84. D-1 STATEMENT · D-2 ACTIVITY SUMMARY · D-3 DEPOZİTO diye ayır.
85. D-3 Depozito: statement'taki deposit satırlarından hangi hesaba ay ay ne kadar para gitmiş — önce confirm et.
86. Zaten tabloda olan iki şeyi kaldır (mükerrer).

## 🔺 I — KÂR HESABI (T-SHIRT) — ShipStation yanı

87. ShipStation yanına T-shirt kâr hesap makinesi koy (adet, maliyet, DTF, işçilik, kargo, reklam, ciro).
88. Her şeyi adet başı yap (ciro ve reklam dahil).
89. Reklamda yüzdelik: ciro 1000, %40 ise 400.
90. Gider kırmızı, ciro mavi, kâr yeşil; ciro−gider=gelir.
91. Kira/ofis ve personel gider kalemi ekle.
92. Negatif/0 adet girilince yanlış çıkmasın (koruma).

## 🔻 J — SHIPSTATION / SATIŞ MATRİSİ (DOKUNMA ama istenenleri yap)

93. Satış adedi = quantity (en sağlam); "2 katı" diye bir şey yok, discount satış değil.
94. 2023'ten 2026 sonuna ay ay order + satış; aylık güncellenecek.
95. ORDERS: order adedi ayrı, satış adedi ayrı — ikisi aynı anda yeşil olmasın.
96. Ürün tipi Canvas/DTF/Embroider; tip belli değilse GILDAN yaz (renk Size/Style'da saklı).
97. Mağaza isimleri toplamın yanında kare içinde, toplam rakamları kırmızı.
98. Canvas: gün gün, her çeşit/ölçü ayrı, otomatik fiyat, aylar yan yana.

## 📌 K — DAVRANIŞ KURALLARI (BANA KARŞI)

99. **Geriye dönük TÜM yazışmaları oku, ders al, hataları düzelt — ne dediysem aynısını yap.**
100. **ACELE ET. Net tek cümle yaz, çok detayla boğma. İş bitince kendin commit + push (YAYINLA gerekiyorsa söyle).**

---

*Not: Bu 100 madde, geriye dönük 324 (EJDER: …) kaydından süzülmüştür. Detaylı sürüm-sürüm geçmiş QM-NOTLAR.md'dedir.*
