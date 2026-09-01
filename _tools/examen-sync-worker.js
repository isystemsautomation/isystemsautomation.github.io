/**
 * Cloudflare Worker — stocarea stării examenului.
 * Un singur utilizator, o singură cheie. Temporar, până la examen.
 *
 * Instalare:
 *   1. dash.cloudflare.com → Workers & Pages → Create → Worker
 *   2. Lipește acest fișier, Deploy
 *   3. Settings → Bindings → Add → KV namespace
 *        Variable name: EXAM   (exact așa)
 *        KV namespace:  creează unul nou, orice nume
 *   4. Settings → Variables → Add → Secret
 *        Name: TOKEN   Value: un șir lung ales de tine
 *   5. Copiază adresa workerului și pune-o în SYNC_URL din examen/index.html,
 *      adăugând ?t=TOKEN la final.
 */
const KEY = 'state';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': 'https://www.isystemsautomation.com',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    if (url.searchParams.get('t') !== env.TOKEN) {
      return new Response('nope', { status: 403, headers: cors });
    }

    if (request.method === 'GET') {
      const v = await env.EXAM.get(KEY);
      return new Response(v || '{}', {
        headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    if (request.method === 'PUT') {
      const body = await request.text();
      if (body.length > 200000) return new Response('too big', { status: 413, headers: cors });
      try { JSON.parse(body); } catch { return new Response('bad json', { status: 400, headers: cors }); }
      await env.EXAM.put(KEY, body);
      return new Response('ok', { headers: cors });
    }

    return new Response('method not allowed', { status: 405, headers: cors });
  },
};
