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
import CustomHead from "@/app/head";

export const metadata = {
    metadataBase: new URL('https://kin-booking.vercel.app'),
    title: 'KIN',
    description: 'KIN 공연 예매 사이트입니다.',
    robots: 'index, follow',
    openGraph: {
        siteName: 'KIN',
        type: 'website',
        url: '/',
        images: [{
            url: '/images/logo_normal.png',
            width: 1200,
            height: 630,
            alt: 'KIN 공연 예매',
        }],
    },
};
export const viewport = 'width=device-width, initial-scale=1';


const RootLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <html lang="ko">
        <CustomHead />
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