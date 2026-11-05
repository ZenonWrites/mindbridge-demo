'use client';
import { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import Banner from '../../components/Banner';
import Triage from '../../components/Triage';
import Directory from '../../components/Directory';
import Chat from '../../components/Chat';
import { CrisisButton, CrisisCard } from '../../components/Crisis';
import { API, sock } from '../../lib/socket';

export default function UserApp() {
  const [stage, setStage] = useState('otp'), [res, setRes] = useState(null), [providers, setProviders] = useState([]);
  const [booking, setBooking] = useState(null), [ref, setRef] = useState(null), [crisis, setCrisis] = useState(false), [otp, setOtp] = useState(false), [phone, setPhone] = useState('');

  useEffect(() => {
    fetch(`${API}/api/providers`).then((r) => r.json()).then(setProviders).catch(() => {});
    const s = sock(), onC = () => setCrisis(true), onR = (r) => setRef(r); // provider escalation / auto self-harm alert / referral
    s.on('crisis', onC); s.on('referral', onR);
    return () => { s.off('crisis', onC); s.off('referral', onR); };
  }, []);

  return (
    <main className="min-h-screen pb-24"><Banner here="user" />
      <div className="px-4">
        {ref && stage !== 'otp' && <div className="max-w-3xl mx-auto card mb-3 flex items-center gap-3 !bg-teal-soft"><Gift /><div className="flex-1 text-sm">Your coach recommends a Tier 3 specialist. Voucher <b>{ref.voucher}</b> takes ₹{ref.amount} off.</div><button className="btn-p" onClick={() => { setRes({ ...res, tier: 3 }); setStage('dir'); }}>View</button></div>}
        {stage === 'otp' && <div className="card max-w-sm mx-auto space-y-3">
          <h2 className="font-display text-2xl">Welcome</h2>
          <p className="text-sm">Verify with your phone number or UPI ID (simulated, any value works).</p>
          <input className="w-full rounded-xl border border-sage px-3 py-2" placeholder="Phone or UPI ID" value={phone} onChange={(e) => setPhone(e.target.value)} />
          {!otp ? <button className="btn-p w-full" disabled={phone.length < 5} onClick={() => setOtp(true)}>Send OTP</button>
            : <button className="btn-p w-full" onClick={() => setStage('triage')}>Verify OTP (demo: 123456)</button>}
        </div>}
        {stage === 'triage' && <Triage onDone={(r) => { setRes(r); setStage('result'); if (r.crisis) setCrisis(true); }} />}
        {stage === 'result' && <div className="card max-w-xl mx-auto text-center">
          <h2 className="font-display text-2xl">We matched you with Tier {res.tier}</h2>
          <p className="my-2 text-sm">Screening score {res.score}/12.{res.crisis ? ' Specialist support is recommended, and Tier 1 and 2 are not available for you right now. Tele-MANAS can help immediately.' : res.tier === 1 ? ' A wellness coach (₹199) is a good start.' : res.tier === 2 ? ' A counsellor (₹500–₹800) is a good fit.' : ' A clinical psychologist (₹1,500+) is recommended.'}</p>
          {res.crisis && <button className="btn bg-alert text-white mr-2" onClick={() => setCrisis(true)}>Open crisis help</button>}
          <button className="btn-p" onClick={() => setStage('dir')}>Browse providers</button>
        </div>}
        {stage === 'dir' && <Directory providers={providers} routed={res.tier} discount={ref?.amount || 0} onBooked={(b) => { setBooking(b); sock().emit('join', { room: b.id, role: 'user' }); setStage('session'); }} />}
        {stage === 'session' && <div className="max-w-3xl mx-auto"><p className="mb-2 text-sm">Booked: <b>{booking.provider}</b>, {booking.date} at {booking.slot}. Now open the Provider window and press Start session.</p><Chat role="user" room={booking.id} /></div>}
      </div>
      <CrisisButton onClick={() => setCrisis(true)} />
      {crisis && <CrisisCard onClose={() => setCrisis(false)} />}
    </main>
  );
}
