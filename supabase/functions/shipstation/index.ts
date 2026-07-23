// ShipStation proxy — Supabase Edge Function
// Deploy:  supabase functions deploy shipstation --no-verify-jwt
// Secrets: supabase secrets set SS_API_KEY=xxxx SS_API_SECRET=yyyy
//
// Panel bunu SB_URL/functions/v1/shipstation adresinden POST ile cagirir.
// Body: { action:"orders", status:"awaiting_shipment", page:1, pageSize:100 }
// ShipStation V1 auth = HTTP Basic (API Key : API Secret).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const KEY = Deno.env.get("SS_API_KEY") || "";
    const SECRET = Deno.env.get("SS_API_SECRET") || "";
    if (!KEY || !SECRET) {
      return json({ error: "SS_API_KEY / SS_API_SECRET tanimli degil (supabase secrets set)" }, 500);
    }
    const auth = "Basic " + btoa(KEY + ":" + SECRET);
    const body = await req.json().catch(() => ({}));
    const action = body.action || "orders";
    const base = "https://ssapi.shipstation.com";

    let url = "";
    if (action === "orders") {
      const p = new URLSearchParams();
      p.set("orderStatus", body.status || "awaiting_shipment");
      p.set("page", String(body.page || 1));
      p.set("pageSize", String(body.pageSize || 100));
      if (body.storeId) p.set("storeId", String(body.storeId));
      if (body.sortBy) p.set("sortBy", String(body.sortBy));
      url = base + "/orders?" + p.toString();
    } else if (action === "stores") {
      url = base + "/stores";
    } else if (action === "customers") {
      const p = new URLSearchParams();
      p.set("page", String(body.page || 1));
      p.set("pageSize", String(body.pageSize || 100));
      url = base + "/customers?" + p.toString();
    } else {
      return json({ error: "bilinmeyen action: " + action }, 400);
    }

    const r = await fetch(url, { headers: { Authorization: auth, "Content-Type": "application/json" } });
    const text = await r.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return json({ ok: r.ok, status: r.status, data }, r.ok ? 200 : r.status);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
