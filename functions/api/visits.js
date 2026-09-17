// Cloudflare Pages Function: 全站訪客計數 (總數 + 今日)
// KV 綁定變數名稱: VISITS_KV
// 前端呼叫: GET /api/visits?inc=1 (今日首次) 或 GET /api/visits (重複瀏覽不累加)
// 回傳: { total, today, date }

function taiwanDate() {
  // Asia/Taipei (UTC+8) 的 YYYY-MM-DD
  var now = new Date(Date.now() + 8 * 3600 * 1000);
  return now.toISOString().slice(0, 10);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    },
  });
}

export async function onRequest(context) {
  var url = new URL(context.request.url);
  var inc = url.searchParams.get('inc') === '1';
  var kv = context.env && context.env.VISITS_KV;

  // 本機預覽 / 尚未綁定 KV 時：讓前端改用 localStorage 備援計數
  if (!kv) {
    return json({ error: 'KV_NOT_BOUND', total: null, today: null }, 501);
  }

  var date = taiwanDate();
  var totalKey = 'total';
  var dailyKey = 'daily:' + date;

  try {
    var totalRaw = await kv.get(totalKey);
    var dailyRaw = await kv.get(dailyKey);
    var total = parseInt(totalRaw || '0', 10) || 0;
    var today = parseInt(dailyRaw || '0', 10) || 0;

    if (inc) {
      total += 1;
      today += 1;
      await Promise.all([
        kv.put(totalKey, String(total)),
        // 每日 key 保留 32 天,避免無限累積
        kv.put(dailyKey, String(today), { expirationTtl: 86400 * 32 }),
      ]);
    }

    return json({ total: total, today: today, date: date });
  } catch (e) {
    return json({ error: 'KV_ERROR', total: null, today: null }, 500);
  }
}
