import React from 'react';
import './globals.css';
import '@/css/layout.css';
import AppProviders from '@/providers/AppProviders';
import TogglePanel from "@/components/panel/TogglePanel";
import DynamicVhSetter from "@/components/utils/DynamicVhSetter";
import PathnameWrapper from "@/wrapper/PathnameWrapper";
import Toast from "@/components/alert/Toast";
import ClientAuthWrapper from "@/wrapper/ClientAuthWrapper";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// export const metadata = {
//     metadataBase: new URL('https://kin-booking.vercel.app'),
//     title: 'KIN',
//     description: 'KIN 공연 예매 사이트입니다.',
//     robots: 'index, follow',
//     openGraph: {
//         siteName: 'KIN',
//         type: 'website',
//         url: '/',
//         images: [{
//             url: '/images/logo_normal.png',
//             width: 1200,
//             height: 630,
//             alt: 'KIN 공연 예매',
//         }],
//     },
// };
// export const viewport = 'width=device-width, initial-scale=1';

const RootLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <html lang="ko">
        <head>
            <title>KIN</title>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta name="description" content="KIN 공연 예매 사이트입니다."/>
            <meta name="robots" content="index, follow"/>

            {/* Open Graph */}
            <meta property="og:title" content="KIN"/>
            <meta property="og:description" content="KIN 공연 예매 사이트입니다."/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content="https://kin-booking.vercel.app/"/>
            <meta property="og:site_name" content="KIN"/>
            <meta property="og:image" content="https://kin-booking.vercel.app/images/logo_normal.png"/>
            <meta property="og:image:width" content="1200"/>
            <meta property="og:image:height" content="630"/>
            <meta property="og:image:alt" content="KIN 공연 예매"/>

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="KIN"/>
            <meta name="twitter:description" content="KIN 공연 예매 사이트입니다."/>
            <meta name="twitter:image" content="https://kin-booking.vercel.app/images/logo_normal.png"/>
        </head>
        <body>
        <AppProviders>
            <DynamicVhSetter/>
            <ClientAuthWrapper>
                <PathnameWrapper>
                    {children}
                    <TogglePanel/>
                </PathnameWrapper>
            </ClientAuthWrapper>
            <Toast/>
        </AppProviders>
        <Analytics/>
        <SpeedInsights/>
        </body>
        </html>
    );
};

export default RootLayout;