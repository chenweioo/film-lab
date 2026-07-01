// GET /api/stats — read analytics events, return aggregated summary
export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('analytics');

    const raw = await store.get('events', { consistency: 'strong' });
    const events = raw ? JSON.parse(raw) : [];

    // Aggregation
    const total = events.length;
    const byAction = {};
    const byFilter = {};
    const byDate = {};
    const recent = events.slice(-20).reverse();

    events.forEach(e => {
      byAction[e.action] = (byAction[e.action] || 0) + 1;
      const filterName = e.filter || 'unknown';
      byFilter[filterName] = (byFilter[filterName] || 0) + 1;
      const day = e.date || 'unknown';
      byDate[day] = (byDate[day] || 0) + 1;
    });

    return new Response(JSON.stringify({
      total,
      byAction,
      byFilter,
      byDate,
      recent
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    console.error('Stats error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
