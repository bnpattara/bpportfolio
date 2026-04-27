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
  title: '13 · Chapter & track draw | Benn Pattara',
  description:
    'A book I wrote from Taylor Swift’s discography: draw an album chapter and a track, with optional glitter gel, quill, and fountain filters from the pen system she’s shared with fans.',
};

export default function ThirteenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`page-13-layout ${bebasNeue.variable} ${dmMono.variable}`}
      style={{ background: 'transparent' }}
    >
      {children}
    </div>
  );
}
