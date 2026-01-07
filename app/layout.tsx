import "./globals.css";
import { Outfit } from 'next/font/google';
import { SocketProvider } from '@/context/SocketContext';

const outfit = Outfit({ subsets: ['latin'] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'Start the Year',
  description: 'Collaborative Button for New Year',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <SocketProvider>
          <div className="mesh-bg" />
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
