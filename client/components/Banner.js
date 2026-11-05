import Link from 'next/link';
export default function Banner({ here }) {
  return (<>
    <div className="bg-amber-100 text-xs text-center py-1.5 px-2">Prototype for Demo Purposes Only — Not a Licensed Clinical Diagnostic Tool.</div>
    <header className="flex items-center justify-between max-w-3xl mx-auto p-4">
      <Link href="/" className="font-display text-2xl">MindBridge</Link>
      <span className="text-sm">{here === 'user' ? <>User window · <Link className="underline" href="/provider" target="_blank">open Provider</Link></> : <>Provider window · <Link className="underline" href="/user" target="_blank">open User</Link></>}</span>
    </header></>);
}
