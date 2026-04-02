import type { Metadata } from 'next';
import { Bebas_Neue, DM_Mono } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: '13 / Mirrorball, Find Your Song | Benn Pattara',
  description: 'Tell me how you feel. Match your feeling to a Taylor Swift song.',
};

export default function ThirteenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<div className={`${bebasNeue.variable} ${dmMono.variable}`} style={{ background: '#fff', minHeight: '100vh' }}>
      {children}
    </div>);
}
