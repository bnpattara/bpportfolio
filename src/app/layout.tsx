import './globals.css';
import type { Metadata } from 'next';
// import MaintenanceNotice from '@/components/MaintenanceNotice'; // uncomment to enable maintenance mode

export const metadata: Metadata = {
  title: 'Benn Pattara (Brand & Product Strategist',
  description: 'Brand & Product Strategist. From cultural insight to shipped product specs) across digital products, physical spaces, and everything in between. VCU Brandcenter M.S. 2026.',
  openGraph: {
    title: 'Benn Pattara (Brand & Product Strategist',
    description: 'Brand & Product Strategist. From cultural insight to shipped product specs) across digital products, physical spaces, and everything in between. VCU Brandcenter M.S. 2026.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en">
      <body>
        {/* <MaintenanceNotice /> · uncomment to enable maintenance mode */}
        {children}
      </body>
    </html>);
}
