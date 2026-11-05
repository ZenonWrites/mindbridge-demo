import './globals.css';
import { Fraunces, Figtree } from 'next/font/google';
const d = Fraunces({ subsets: ['latin'], variable: '--f-display' });
const b = Figtree({ subsets: ['latin'], variable: '--f-body' });
export const metadata = { title: 'MindBridge – Demo' };
export default function Root({ children }) {
  return <html lang="en"><body className={`${d.variable} ${b.variable}`}>{children}</body></html>;
}
