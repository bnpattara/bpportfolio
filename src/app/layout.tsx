import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
// import MaintenanceNotice from '@/components/MaintenanceNotice'; // uncomment to enable maintenance mode

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export const metadata: Metadata = {
  metadataBase: new URL('https://bennpattara.com'),
  title: 'Benn Pattara · Brand & Product Strategist',
  description:
    'Brand & Product Strategist. From cultural insight to shipped product specs across digital products, physical spaces, and everything in between. VCU Brandcenter M.S. 2026.',
  openGraph: {
    title: 'Benn Pattara · Brand & Product Strategist',
    description:
      'Brand & Product Strategist. From cultural insight to shipped product specs across digital products, physical spaces, and everything in between. VCU Brandcenter M.S. 2026.',
    images: [{ url: 'https://bennpattara.com/og/home.png', width: 1200, height: 628 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en">
      <body>
        {gaMeasurementId ? (<>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>) : null}
        {/* <MaintenanceNotice /> · uncomment to enable maintenance mode */}
        {children}
      </body>
    </html>);
}
