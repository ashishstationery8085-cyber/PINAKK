import '../styles/globals.css';
import type { Metadata } from 'next';
import type React from 'react';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'PINAKK Marketplace - Shop Smart, Live Better',
    template: '%s | PINAKK Marketplace'
  },
  description: 'PINAKK is your one-stop shop for stationery, office supplies, gifts, perfumes, accessories and general items. Best prices, fast delivery, and secure payments.',
  keywords: ['stationery', 'office supplies', 'gifts', 'perfumes', 'accessories', 'online shopping', 'marketplace', 'e-commerce', 'PINAKK', 'Ashish Stationary'],
  authors: [{ name: 'PINAKK Team', url: 'https://pinakk.com' }],
  creator: 'PINAKK',
  publisher: 'PINAKK',
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'PINAKK Marketplace',
    description: 'Premium online marketplace with smart search, deals, and fast delivery.',
    url: 'https://pinakk.com',
    siteName: 'PINAKK Marketplace',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 192,
        height: 192,
        alt: 'PINAKK Logo',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-slate-900">
        <TopNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
