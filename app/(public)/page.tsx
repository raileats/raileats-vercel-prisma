'use client';
import { useEffect, useState } from 'react';

type Station = { id: string; name: string; code: string; city: string; state?: string | null; };
type MenuItem = { id: string; name: string; pricePaise: number; };
type Restaurant = { id: string; name: string; ratingAvg: number; ratingCount: number; cuisines: string[]; items: MenuItem[]; };

export default function Home() {
  const [q, setQ] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState<Station | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q) { setStations([]); return; }
      try {
        const res = await fetch(`/api/stations?query=${encodeURIComponent(q)}`, { credentials: 'include' });
        setStations(await res.json());
      } catch (e) { console.error(e); }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    (async () => {
      if (!selected) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/restaurants?stationId=${selected.id}`);
        setRestaurants(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, [selected]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium">Search station or city</label>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="e.g. NDLS, Delhi, Pune"
          className="mt-1 w-full rounded border p-2"
        />
        {stations.length > 0 && (
          <ul className="mt-2 divide-y rounded border">
            {stations.map(s => (
              <li key={s.id} className="cursor-pointer p-2 hover:bg-gray-50" onClick={() => setSelected(s)}>
                <div className="font-medium">{s.name} ({s.code})</div>
                <div className="text-xs text-gray-600">{s.city}{s.state ? `, ${s.state}` : ''}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Restaurants at {selected.name}</h2>
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {restaurants.map(r => (
              <article key={r.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{r.name}</h3>
                  <span className="text-sm">⭐ {r.ratingAvg.toFixed(1)} ({r.ratingCount})</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">{r.cuisines.join(', ')}</div>
                <ul className="mt-3 space-y-2">
                  {r.items.slice(0, 5).map((it) => (
                    <li key={it.id} className="flex items-center justify-between">
                      <span>{it.name}</span>
                      <span>₹ {(it.pricePaise/100).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
