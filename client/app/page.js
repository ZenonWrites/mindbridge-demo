import Link from 'next/link';
import Banner from '../components/Banner';
export default function Home() {
  return (<main className="min-h-screen"><Banner />
    <div className="max-w-3xl mx-auto p-4 grid sm:grid-cols-2 gap-4">
      <Link target="_blank" href="/user" className="card hover:bg-teal-soft"><h2 className="font-display text-2xl">User window</h2><p className="text-sm">Screening, booking, chat. / Seva lene wale ke liye.</p></Link>
      <Link target="_blank" href="/provider" className="card hover:bg-teal-soft"><h2 className="font-display text-2xl">Provider window</h2><p className="text-sm">Appointments, notes, live session. / Therapist ke liye.</p></Link>
      <p className="sm:col-span-2 text-sm">Open each in its own browser window, side by side. Book as the user first; the appointment then appears live in the provider window.</p>
    </div></main>);
}
