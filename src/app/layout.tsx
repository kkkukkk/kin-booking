import React from 'react';
import './globals.css';
import '@/css/layout.css';
import AppProviders from '@/providers/AppProviders';
import TogglePanel from "@/components/panel/TogglePanel";
import DynamicVhSetter from "@/components/utils/DynamicVhSetter";
import PathnameWrapper from "@/components/wrapper/PathnameWrapper";
import Toast from "@/components/alert/Toast";
import ClientAuthWrapper from "@/components/wrapper/ClientAuthWrapper";

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
                <ClientAuthWrapper>
                    <PathnameWrapper>
                        {children}
                        <TogglePanel/>
                    </PathnameWrapper>
                </ClientAuthWrapper>
                <Toast />
            </AppProviders>
        </body>
        </html>
    );
};

export default RootLayout;