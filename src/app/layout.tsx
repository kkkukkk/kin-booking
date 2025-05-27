import React from 'react';
import './globals.css';
import '@/css/layout.css';
import AppProviders from '@/providers/AppProviders';
import TogglePanel from "@/components/panel/TogglePanel";
import DynamicVhSetter from "@/components/utils/DynamicVhSetter";
import PathnameWrapper from "@/components/wrapper/PathnameWrapper";
import Alert from "@/components/alert/Alert";

export const metadata = {
    title: 'KIN',
    description: 'KIN 공연 예매 사이트입니다.',
    robots: 'index, follow',
    openGraph: {
        siteName: 'KIN',
        type: 'website',
        url: 'https://kin-booking.vercel.app/',
        images: [''],
    },
};
export const viewport = 'width=device-width, initial-scale=1';

const RootLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <html lang="ko">
        <body>
            <AppProviders>
                <DynamicVhSetter />
                <PathnameWrapper>
                    {children}
                    <TogglePanel/>
                    <Alert />
                </PathnameWrapper>
            </AppProviders>
            </body>
        </html>
    );
};

export default RootLayout;