'use client';
import { useEffect, useState } from 'react';

type Order = {
  id: string;
  status: string;
  totalPaise: number;
  trainNo: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { credentials: 'include' });
      if (res.status === 401) {
        setErr('Please login to see your orders.');
        setOrders([]);
      } else if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Failed to fetch orders');
      } else {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <button onClick={logout} className="rounded border px-3 py-1 text-sm">Logout</button>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {err && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <div className="grid grid-cols-1 gap-4">
        {orders.map(o => (
          <article key={o.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order #{o.id.slice(0,8)}</div>
              <div className="text-sm">{o.status}</div>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              Train: {o.trainNo} • Total: ₹ {(o.totalPaise/100).toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">Placed {new Date(o.createdAt).toLocaleString()}</div>
          </article>
        ))}
        {!loading && orders.length === 0 && !err && (
          <div className="text-sm text-gray-600">No orders yet.</div>
        )}
      </div>
    </div>
  );
}
