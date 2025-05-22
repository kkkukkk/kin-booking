'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import '@/css/layout.css';
import AppProviders from '@/providers/AppProviders';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isEnterPage = pathname === '/enter';

    return (
        <html lang="ko">
            <body className={`layout-grid ${isEnterPage ? 'enter' : ''} bg-image`}>
                <AppProviders>
                    {children}
                </AppProviders>
            </body>
        </html>
    );
};

export default RootLayout;