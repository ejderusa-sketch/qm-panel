// Etsy Legal proxy — Supabase Edge Function
// Etsy'nin resmi politika listesini dondurur. GIZLI ANAHTAR GEREKMEZ.
// Deploy:  supabase functions deploy legal --no-verify-jwt
//
// NOT: Etsy, veri merkezi IP'lerinden gelen istekleri JS-challenge (bot korumasi)
// ile blokluyor. Bu yuzden fonksiyon once CANLI cekmeyi dener; bloklanirsa
// asagidaki KURATOR listesini (gercek etsy.com/legal verisi) dondurur.
// Panel: SB_URL/functions/v1/legal  { action:"list" } | { action:"read", url }

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const HDRS = {
  "User-Agent": UA,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function json(o: unknown, s = 200) {
  return new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
}
function strip(h: string) {
  return h
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/&rsquo;/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ").trim();
}
const dateOf = (t: string) => {
  const m = t.match(/effective\s+(?:starting|until|from|through)?\s*([A-Z][a-z]+\.?\s+\d{1,2},?\s*\d{4})/i)
    || t.match(/\(effective[^)]*?([A-Z][a-z]+\s+\d{1,2},?\s*\d{4})\)/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
};

// ---- KURATOR LISTE (etsy.com/legal — 2026-07) : degisebilir, gerektiginde guncelle ----
const SEED: Array<Record<string, string>> = [
  { title: "Animal Products Policy", url: "https://www.etsy.com/legal/policy/animal-products-policy-effective/1476192396849", date: "August 11, 2026", summary: "Etsy'de izin verilen/kısıtlanan hayvansal ürünler.", section: "sellers" },
  { title: "Prohibited Items Policy (yeni)", url: "https://www.etsy.com/legal/policy/prohibited-items-policy-effective/1475031537022", date: "August 11, 2026", summary: "Items that are prohibited or restricted in our marketplace", section: "sellers" },
  { title: "Prohibited Items Policy (mevcut)", url: "https://www.etsy.com/legal/prohibited/", date: "August 11, 2026", summary: "Items that are prohibited or restricted in our marketplace", section: "sellers" },
  { title: "Endangered, Threatened, or At-Risk Wildlife Products", url: "https://www.etsy.com/legal/policy/endangered-threatened-or-at-risk/239374829600", date: "August 11, 2026", summary: "Nesli tehlikede türlerden ürünlere ilişkin kurallar.", section: "sellers" },
  { title: "Lifesaving & Personal Protective Equipment", url: "https://www.etsy.com/legal/policy/lifesaving-personal-protective-equipment/1384310636345", date: "July 21, 2025", summary: "Items designed to save lives or to minimize exposure to occupational and/or workplace hazards", section: "sellers" },
  { title: "Sell on Etsy App Policy", url: "https://www.etsy.com/legal/sell-on-etsy/", date: "December 1, 2022", summary: "Managing your Etsy shop through the Sell on Etsy mobile app", section: "sellers" },
  { title: "Seller Policy", url: "https://www.etsy.com/legal/sellers/", date: "", summary: "Your rights and obligations as an Etsy seller", section: "sellers" },
  { title: "Etsy Payments Policy", url: "https://www.etsy.com/legal/etsy-payments/", date: "", summary: "Our agreement with you about your use of our payments services.", section: "sellers" },
  { title: "Fees & Payments Policy", url: "https://www.etsy.com/legal/fees/", date: "", summary: "Seller fees, taxes, and how to pay them", section: "sellers" },
  { title: "Intellectual Property Policy", url: "https://www.etsy.com/legal/ip/", date: "", summary: "Intellectual property and issues with infringement", section: "sellers" },
  { title: "Prohibited Items — Children and Baby Products Policy", url: "https://www.etsy.com/legal/policy/children-and-baby-products-policy/239344787532", date: "", summary: "İzin verilmeyen çocuk/bebek ürünleri ve güvenlik kuralları.", section: "sellers" },
  { title: "Advertising & Marketing Policy", url: "https://www.etsy.com/legal/advertising/", date: "", summary: "Terms for Etsy sellers who take advantage of our advertising or marketing services", section: "sellers" },
  { title: "Shipping Policy", url: "https://www.etsy.com/legal/shipping/", date: "", summary: "Understanding your shipping obligations and your rights and responsibilities when using Etsy's shipping labels services", section: "sellers" },
  { title: "Pattern Policy", url: "https://www.etsy.com/legal/pattern/", date: "", summary: "Your rights and responsibilities when using Pattern by Etsy", section: "sellers" },
  { title: "Etsy's Creativity Standards", url: "https://www.etsy.com/legal/creativity/", date: "", summary: "What may be sold on Etsy", section: "sellers" },
  { title: "Purchase Protection Program for Sellers", url: "https://www.etsy.com/legal/policy/purchase-protection-program-for-sellers/34509585385", date: "", summary: "Requirements for Purchase Protection program eligibility", section: "sellers" },
  { title: "Sanctions Policy", url: "https://www.etsy.com/legal/policy/sanctions-policy/122383404929", date: "", summary: "Your responsibilities regarding sanctions and trade restrictions", section: "sellers" },
  { title: "Adult Nudity and Sexual Content", url: "https://www.etsy.com/legal/policy/adult-nudity-and-sexual-content/1269612959532", date: "", summary: "Content containing nudity and adult content that is prohibited, restricted, or allowed", section: "sellers" },
  { title: "Harassment Policy", url: "https://www.etsy.com/legal/policy/harassment-policy/1395642333448", date: "", summary: "Behavior we prohibit on Etsy", section: "sellers" },
  { title: "Discrimination and Hateful Content Policy", url: "https://www.etsy.com/legal/policy/discrimination-and-hateful-content/123551108902", date: "", summary: "Behavior we prohibit on Etsy", section: "sellers" },
  { title: "Content Moderation at Etsy", url: "https://www.etsy.com/legal/policy/content-moderation-at-etsy/1232687465431", date: "", summary: "İçerik denetimi ve kaldırma süreçleri.", section: "sellers" },
  { title: "Community Policy", url: "https://www.etsy.com/legal/community/", date: "", summary: "Requirements for participating in community spaces", section: "sellers" },
  { title: "Listing Image Requirements", url: "https://www.etsy.com/legal/policy/listing-image-requirements/253962679005", date: "", summary: "Listing görsel gereklilikleri.", section: "sellers" },
  { title: "Listing Mature Content Correctly", url: "https://www.etsy.com/legal/policy/listing-mature-content-correctly/242665462117", date: "", summary: "Yetişkin içeriğin doğru etiketlenmesi.", section: "sellers" },
  { title: "Off-Platform Transactions", url: "https://www.etsy.com/legal/policy/off-platform-transactions/1254654515806", date: "", summary: "Buy and sell items safely and securely on Etsy.", section: "sellers" },
  { title: "Seller Referrals Policy", url: "https://www.etsy.com/legal/referrals-sellers/", date: "", summary: "Earning credits by referring your friends to sell on Etsy", section: "sellers" },
  { title: "Etsy's Share & Save Terms (Program Terms)", url: "https://www.etsy.com/legal/policy/etsys-share-save-terms-program-terms/1162874007996", date: "", summary: "Share & Save program şartları.", section: "sellers" },
  { title: "Terms of Use", url: "https://www.etsy.com/legal/terms-of-use", date: "", summary: "Etsy'yi kullanımına ilişkin genel kullanım şartları.", section: "general" },
  { title: "Privacy Policy", url: "https://www.etsy.com/legal/privacy", date: "", summary: "Kişisel verilerin işlenmesine ilişkin gizlilik politikası.", section: "general" },
  { title: "United States Regional Privacy Policy", url: "https://www.etsy.com/legal/policy/united-states-regional-privacy-policy/1146293244010", date: "", summary: "ABD eyalet gizlilik hakları.", section: "general" },
  { title: "Buyer Policy", url: "https://www.etsy.com/legal/buyers/", date: "", summary: "Your rights and obligations as a buyer on Etsy", section: "buyers" },
  { title: "Cases Policy", url: "https://www.etsy.com/legal/policy/cases-policy/243306189901", date: "", summary: "Açılan vakalar (case) süreçleri.", section: "buyers" },
  { title: "Purchase Reward Terms", url: "https://www.etsy.com/legal/policy/purchase-reward-terms/1409390353970", date: "", summary: "Alışveriş ödül şartları.", section: "buyers" },
  { title: "API Terms of Use", url: "https://www.etsy.com/legal/api/", date: "", summary: "Terms governing Etsy's API for developers", section: "third-party" },
  { title: "Affiliates Policy", url: "https://www.etsy.com/legal/affiliates/", date: "", summary: "Requirements for earning commissions through Etsy's Affiliates Program", section: "third-party" },
  { title: "EU Digital Services Act", url: "https://www.etsy.com/legal/policy/eu-digital-services-act/1119915664620", date: "", summary: "AB Dijital Hizmetler Yasası uyumu.", section: "third-party" },
  { title: "Requests for Information Policy", url: "https://www.etsy.com/legal/requests-for-information/", date: "", summary: "Process for requesting any information on Etsy Members", section: "third-party" },
];

async function scrapeLive() {
  const sections = ["sellers", "buyers", "third-party"];
  const seen = new Set<string>();
  const items: Array<Record<string, string>> = [];
  for (const sec of sections) {
    let html = "";
    try {
      const r = await fetch("https://www.etsy.com/legal/section/" + sec, { headers: HDRS });
      html = await r.text();
    } catch (_) { continue; }
    if (/Please enable JS|enable JavaScript/i.test(html) && !/ref=list/.test(html)) continue;
    const re = /href="((?:https:\/\/www\.etsy\.com)?\/legal\/[^"]*?\?ref=list)"[^>]*>([\s\S]*?)<\/a>/g;
    const found: Array<{ url: string; title: string; end: number; idx: number }> = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      let url = m[1];
      if (url.startsWith("/")) url = "https://www.etsy.com" + url;
      url = url.replace(/\?ref=list/, "");
      const title = strip(m[2]);
      if (!title) continue;
      found.push({ url, title, end: re.lastIndex, idx: m.index });
    }
    for (let i = 0; i < found.length; i++) {
      const f = found[i];
      if (seen.has(f.url)) continue;
      seen.add(f.url);
      const nextIdx = i + 1 < found.length ? found[i + 1].idx : Math.min(f.end + 600, html.length);
      let desc = strip(html.slice(f.end, nextIdx)).replace(/\s*<.*$/, "").trim();
      if (desc.length > 220) desc = desc.slice(0, 220).replace(/\s+\S*$/, "") + "…";
      const date = dateOf(f.title);
      const cleanTitle = f.title.replace(/\s*[–-]\s*effective[\s\S]*$/i, "").replace(/\s*\(effective[\s\S]*$/i, "").trim();
      items.push({ title: cleanTitle, url: f.url, date, summary: desc, section: sec });
    }
  }
  return items;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "list";

    if (action === "read") {
      const u = String(body.url || "");
      if (!/^https:\/\/www\.etsy\.com\/legal\//.test(u)) return json({ error: "gecersiz url" }, 400);
      const r = await fetch(u, { headers: HDRS });
      let html = await r.text();
      if (/Please enable JS|enable JavaScript/i.test(html) && html.length < 4000) {
        return json({ ok: true, blocked: true, url: u, text: "" });
      }
      const h1 = html.search(/<h1[\s>]/i);
      if (h1 > 0) html = html.slice(h1);
      const ft = html.search(/Etsy is powered by 100% renewable/i);
      if (ft > 0) html = html.slice(0, ft);
      return json({ ok: true, url: u, text: strip(html).slice(0, 9000) });
    }

    // list — try live, fall back to curated SEED
    let items: Array<Record<string, string>> = [];
    try { items = await scrapeLive(); } catch (_) { items = []; }
    let source = "live";
    if (items.length < 5) { items = SEED; source = "curated"; }
    return json({ ok: true, source, count: items.length, items });
  } catch (e) {
    return json({ error: String(e), ok: true, source: "curated", count: SEED.length, items: SEED }, 200);
  }
});
