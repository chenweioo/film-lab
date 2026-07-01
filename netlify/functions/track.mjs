// POST /api/track — receive analytics event, store in Netlify Blobs
export default async (req) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { action, filter, timestamp } = body;

    if (!action) {
      return new Response(JSON.stringify({ error: 'missing action' }), { status: 400 });
    }

    // Use Netlify Blobs for persistent storage
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('analytics');

    // Get existing events
    let raw = await store.get('events', { consistency: 'strong' });
    let events = raw ? JSON.parse(raw) : [];

    // Add new event
    events.push({
      action,
      filter: filter || 'unknown',
      timestamp: timestamp || Date.now(),
      ip: req.headers.get('x-nf-client-connection-ip') || 'unknown',
      ua: req.headers.get('user-agent')?.slice(0, 120) || 'unknown',
      date: new Date().toISOString().slice(0, 10)
    });

    // Keep last 10000 events max
    if (events.length > 10000) {
      events = events.slice(-10000);
    }

    // Save back
    await store.set('events', JSON.stringify(events));

    return new Response(JSON.stringify({ ok: true, total: events.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Track error:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
