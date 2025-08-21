import React from 'react';
import AppProviders from '@/providers/AppProviders';
import TogglePanel from "@/components/panel/TogglePanel";
import DynamicVhSetter from "@/wrapper/DynamicVhSetter";
import PathnameWrapper from "@/wrapper/PathnameWrapper";
import Toast from "@/components/alert/Toast";
import ClientAuthWrapper from "@/wrapper/ClientAuthWrapper";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
// CSS import를 마지막에 배치하여 최적화
import './globals.css';
import '@/css/layout.css';

export const metadata: Metadata = {
  title: 'KIN',
  description: 'KIN 공연 예매 사이트입니다.',
  keywords: ['공연', '예매', '티켓', '이벤트'],
  authors: [{ name: 'KIN Team' }],
  creator: 'KIN Team',
  publisher: 'KIN',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kin-booking.vercel.app'),
  openGraph: {
    title: 'KIN',
    description: 'KIN 공연 예매 사이트입니다.',
    url: 'https://kin-booking.vercel.app',
    siteName: 'KIN',
    images: [
      {
        url: '/images/logo_normal.png',
        width: 1200,
        height: 630,
        alt: 'KIN 공연 예매',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KIN',
    description: 'KIN 공연 예매 사이트입니다.',
    images: ['/images/logo_normal.png'],
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

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="ko">
            <head>
                {/* Favicon & App Icons */}
                <link rel="apple-touch-icon" sizes="57x57" href="/fabicon/apple-icon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/fabicon/apple-icon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/fabicon/apple-icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/fabicon/apple-icon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/fabicon/apple-icon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/fabicon/apple-icon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/fabicon/apple-icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/fabicon/apple-icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/fabicon/apple-icon-180x180.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/fabicon/android-icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/fabicon/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/fabicon/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/fabicon/favicon-16x16.png" />
                <link rel="manifest" href="/fabicon/manifest.json" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content="/fabicon/ms-icon-144x144.png" />
                <meta name="theme-color" content="#ffffff" />
            </head>
            <body>
                <AppProviders>
                    <DynamicVhSetter />
                    <ClientAuthWrapper>
                        <PathnameWrapper>
                            {children}
                            <TogglePanel />
                        </PathnameWrapper>
                    </ClientAuthWrapper>
                    <Toast />
                </AppProviders>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
};

export default RootLayout;