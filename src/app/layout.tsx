import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
// import MaintenanceNotice from '@/components/MaintenanceNotice'; // uncomment to enable maintenance mode

/** Bump when replacing `public/og/home.png` so social crawlers refetch (LinkedIn caches aggressively). */
const OG_HOME_VERSION = '7';

/** GA4 stream “Benn Portfolio” — public ID; override with NEXT_PUBLIC_GA_MEASUREMENT_ID. */
const DEFAULT_GA_MEASUREMENT_ID = 'G-1S5D7FGYE8';

const gaEnvId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const gaMeasurementId =
  process.env.NODE_ENV === 'production'
    ? gaEnvId || DEFAULT_GA_MEASUREMENT_ID
    : gaEnvId;

export const metadata: Metadata = {
  metadataBase: new URL('https://bennpattara.com'),
  title: 'Benn Pattara · Product Design & Brand Strategy',
  description:
    'Product Design & Brand Strategy. From cultural insight to shipped product specs across digital products, physical spaces, and everything in between. VCU Brandcenter M.S. 2026.',
  openGraph: {
    title: 'Benn Pattara · Product Design & Brand Strategy',
    description:
      'Product Design & Brand Strategy. From cultural insight to shipped product specs across digital products, physical spaces, and everything in between. VCU Brandcenter M.S. 2026.',
    images: [
      {
        url: `https://bennpattara.com/og/home.png?v=${OG_HOME_VERSION}`,
        width: 2400,
        height: 1256,
      },
    ],
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
