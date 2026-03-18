import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '13 / Mirrorball — Find Your Song | Benn Pattara',
  description: 'Tell me how you feel. Match your feeling to a Taylor Swift song.',
};

export default function ThirteenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-13-root" style={{ background: 'var(--doc-bg)', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
