#!/bin/bash
# QM PANEL — TEK TIKLA YAYINLA
# Bu dosyaya cift tikla, index.html GitHub'a gider.

cd "$(dirname "$0")" || exit 1

echo "=============================="
echo "  QM PANEL — YAYINLAMA"
echo "=============================="
echo ""

# Git deposu degilse kendisi kursun
if [ ! -d .git ]; then
  echo "Ilk calistirma — GitHub baglantisi kuruluyor..."
  echo ""
  TMP="../qm-panel-kurulum-$$"
  rm -rf "$TMP"
  if git clone --quiet https://github.com/ejderusa-sketch/qm-panel.git "$TMP"; then
    mv "$TMP/.git" ./.git
    rm -rf "$TMP"
    git reset --quiet
    echo "✅ Baglanti kuruldu."
    echo ""
  else
    rm -rf "$TMP"
    echo "❌ Baglanti kurulamadi."
    echo "Internet baglantini kontrol et ve tekrar dene."
    echo ""
    read -p "Kapatmak icin Enter'a bas..."
    exit 1
  fi
fi

# Surum numarasini oku
SURUM=$(grep -o 'QM[0-9]\{3\} ☁️' index.html | head -1 | grep -o 'QM[0-9]\{3\}')
[ -z "$SURUM" ] && SURUM="guncelleme"

echo "Surum: $SURUM"
echo "Gonderiliyor..."
echo ""

git add index.html QM-NOTLAR.md 2>/dev/null

if git diff --cached --quiet; then
  echo "ℹ️  Yeni degisiklik yok — bekleyen gonderim kontrol ediliyor..."
else
  git commit -q -m "$SURUM"
  echo "Commit atildi: $SURUM"
fi
echo ""

# Gonderilecek bir sey var mi?
if [ -z "$(git log origin/main..HEAD --oneline 2>/dev/null)" ]; then
  echo "✅ Zaten guncel — GitHub'da her sey yerinde."
  echo ""
  read -p "Kapatmak icin Enter'a bas..."
  exit 0
fi

if git push; then
  echo ""
  echo "✅ YAYINLANDI — $SURUM"
  echo ""
  echo "Paneli su adresle ac:"
  echo "https://ejderusa-sketch.github.io/qm-panel/?v=$(echo $SURUM | tr 'A-Z' 'a-z')"
  echo ""
  echo "(GitHub Pages'in yayina almasi 1-2 dakika surebilir.)"
else
  echo ""
  echo "❌ Gonderilemedi."
  echo "Muhtemelen GitHub girisi gerekiyor. Ekranda cikan"
  echo "pencereden GitHub hesabinla giris yap ve tekrar dene."
fi

echo ""
read -p "Kapatmak icin Enter'a bas..."
