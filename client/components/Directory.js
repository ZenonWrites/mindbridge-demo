'use client';
import { useState } from 'react';
import { BadgeCheck, Lock, X } from 'lucide-react';
import { API } from '../lib/socket';

const NAME = { 1: 'Tier 1: Wellness Coach', 2: 'Tier 2: Counsellor', 3: 'Tier 3: RCI Clinical Psychologist' };
const COLOR = { 1: 'bg-sage-soft', 2: 'bg-teal-soft', 3: 'bg-ink text-white' };
const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toDateString().slice(0, 10); };
const SLOTS = ['10:00', '12:00', '16:00', '18:30'];

export default function Directory({ providers, routed, discount, onBooked }) {
  const [q, setQ] = useState(''), [sel, setSel] = useState(null);
  const list = providers.filter((p) => (p.name + p.title).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="max-w-3xl mx-auto">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or qualification" className="w-full rounded-xl border border-sage px-3 py-2 mb-3" />
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((p) => {
          const locked = p.tier < routed, price = p.tier === 3 ? Math.max(p.price - discount, 0) : p.price;
          return (
            <div key={p.id} className={`card ${locked ? 'opacity-50' : ''}`}>
              <span className={`tag ${COLOR[p.tier]}`}>{NAME[p.tier]}</span>
              <h3 className="font-display text-xl mt-2">{p.name}</h3>
              <p className="text-sm">{p.title}</p>
              {p.rci && <p className="text-sm flex items-center gap-1 text-teal font-semibold"><BadgeCheck size={16} />{p.rci}</p>}
              <p className="text-sm text-ink/70">{p.bio} · {p.langs}</p>
              <p className="font-semibold mt-1">₹{price}{discount > 0 && p.tier === 3 && <span className="text-xs font-normal"> (voucher applied)</span>}</p>
              <button className="btn-p mt-2 w-full flex justify-center gap-2" disabled={locked} onClick={() => setSel(p)}>{locked ? <><Lock size={16} />Not suitable for your screening</> : 'Pick a slot'}</button>
            </div>
          );
        })}
      </div>
      {sel && <Booking p={sel} price={sel.tier === 3 ? Math.max(sel.price - discount, 0) : sel.price} onClose={() => setSel(null)} onBooked={onBooked} />}
    </div>
  );
}

function Booking({ p, price, onClose, onBooked }) {
  const [d, setD] = useState(0), [t, setT] = useState(null), [pay, setPay] = useState(false), [upi, setUpi] = useState(''), [busy, setBusy] = useState(false);
  const confirm = async () => {
    setBusy(true); await new Promise((r) => setTimeout(r, 1200)); // simulated Razorpay sandbox
    const body = { providerId: p.id, provider: p.name, tier: p.tier, date: day(d), slot: t, price, client: 'Aarav (22)' };
    let b = { ...body, id: 'local' }; try { b = await (await fetch(`${API}/api/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json(); } catch {}
    onBooked(b);
  };
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 grid place-items-center bg-ink/50 p-3">
      <div className="card w-full max-w-md">
        <div className="flex justify-between"><h3 className="font-display text-xl">Book {p.name}</h3><button onClick={onClose} aria-label="Close"><X /></button></div>
        {!pay ? <>
          <div className="flex gap-2 my-3">{[0, 1, 2].map((n) => <button key={n} onClick={() => setD(n)} className={`btn-s flex-1 text-sm ${d === n ? '!bg-teal-soft !border-teal' : ''}`}>{day(n)}</button>)}</div>
          <div className="grid grid-cols-4 gap-2">{SLOTS.map((s) => <button key={s} onClick={() => setT(s)} className={`btn-s text-sm ${t === s ? '!bg-teal-soft !border-teal' : ''}`}>{s}</button>)}</div>
          <button className="btn-p w-full mt-4" disabled={!t} onClick={() => setPay(true)}>Continue to pay ₹{price}</button>
        </> : <>
          <div className="mt-3 rounded-xl border border-sage p-3 bg-mist">
            <p className="text-xs">Razorpay Sandbox (simulated, no real payment)</p>
            <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="yourname@upi" className="w-full rounded-lg border border-sage px-3 py-2 my-2" />
            <button className="btn-p w-full" disabled={!upi.includes('@') || busy} onClick={confirm}>{busy ? 'Processing…' : `Pay ₹${price}`}</button>
          </div>
        </>}
      </div>
    </div>
  );
}
