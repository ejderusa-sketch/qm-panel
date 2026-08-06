// Customers store — Supabase Edge Function
// Müşteri listesini tarayıcı (localStorage 5MB) yerine gerçek DB tablosuna yazar.
//
// KURULUM:
// 1) Supabase SQL editor'de customers_table.sql'i çalıştır (tablo + index).
// 2) Deploy:  supabase functions deploy customers --no-verify-jwt
//    (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY otomatik gelir, ayrıca secret gerekmez.)
//
// Panel POST eder: SB_URL/functions/v1/customers
//   { action:"upsert", rows:[{ckey,name,email,addr,state},...] }  -> toplu upsert (500'lük parça)
//   { action:"count" }                                            -> { ok, count }
//   { action:"list", q?:"arama" }                                 -> { ok, rows:[...] } (q varsa filtreli, yoksa hepsi)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const url = Deno.env.get("SUPABASE_URL") || "";
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!url || !key) return json({ ok: false, error: "SUPABASE_URL / SERVICE_ROLE_KEY yok" }, 500);
    const sb = createClient(url, key, { auth: { persistSession: false } });

    const body = await req.json().catch(() => ({} as any));
    const action = body.action || "list";

    if (action === "upsert") {
      const rows = Array.isArray(body.rows) ? body.rows : [];
      let up = 0;
      for (let i = 0; i < rows.length; i += 500) {
        const chunk = rows.slice(i, i + 500).map((r: any) => ({
          ckey: String(r.ckey || "").slice(0, 400),
          name: (r.name || "") + "",
          email: (r.email || "") + "",
          addr: (r.addr || "") + "",
          state: (r.state || "") + "",
          source: (r.source || "") + "",
        })).filter((r: any) => r.ckey);
        if (!chunk.length) continue;
        const { error } = await sb.from("customers").upsert(chunk, { onConflict: "ckey" });
        if (error) return json({ ok: false, error: error.message, upserted: up }, 500);
        up += chunk.length;
      }
      return json({ ok: true, upserted: up });
    }

    if (action === "count") {
      let cq = sb.from("customers").select("*", { count: "exact", head: true });
      if (body.source) cq = cq.eq("source", (body.source || "") + "");
      const { count, error } = await cq;
      if (error) return json({ ok: false, error: error.message }, 500);
      return json({ ok: true, count: count || 0 });
    }

    // list
    const q = ((body.q || "") + "").trim();
    const src = (body.source || "") + "";
    if (q) {
      const like = "%" + q.replace(/[%,]/g, " ") + "%";
      let sq = sb.from("customers")
        .select("ckey,name,email,addr,state,source")
        .or(`name.ilike.${like},email.ilike.${like},addr.ilike.${like}`);
      if (src) sq = sq.eq("source", src);
      const { data, error } = await sq.order("name", { ascending: true }).range(0, 4999);
      if (error) return json({ ok: false, error: error.message }, 500);
      return json({ ok: true, rows: data || [] });
    }
    // hepsi (1000'lik sayfalarla topla)
    let all: any[] = [];
    let from = 0;
    const step = 1000;
    while (true) {
      let lq = sb.from("customers")
        .select("ckey,name,email,addr,state,source");
      if (src) lq = lq.eq("source", src);
      const { data, error } = await lq
        .order("name", { ascending: true })
        .range(from, from + step - 1);
      if (error) return json({ ok: false, error: error.message }, 500);
      all = all.concat(data || []);
      if (!data || data.length < step) break;
      from += step;
      if (from > 300000) break;
    }
    return json({ ok: true, rows: all });
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
