import './globals.css';
import type { Metadata } from 'next';
// import MaintenanceNotice from '@/components/MaintenanceNotice'; // uncomment to enable maintenance mode

export const metadata: Metadata = {
  title: 'Benn Pattara — Brand Experience Strategist & Systems Designer',
  description: 'I design the systems, experiences, and narratives that move people from passive awareness to active brand citizenship.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <MaintenanceNotice /> — uncomment to enable maintenance mode */}
        {children}
      </body>
    </html>
  );
}
