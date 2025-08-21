import React from 'react';
import AppProviders from '@/providers/AppProviders';
import TogglePanel from "@/components/panel/TogglePanel";
import DynamicVhSetter from "@/wrapper/DynamicVhSetter";
import PathnameWrapper from "@/wrapper/PathnameWrapper";
import Toast from "@/components/alert/Toast";
import ClientAuthWrapper from "@/wrapper/ClientAuthWrapper";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CustomHead from '@/components/layout/CustomHead';
// CSS import를 마지막에 배치하여 최적화
import './globals.css';
import '@/css/layout.css';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="ko">
            <CustomHead />
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