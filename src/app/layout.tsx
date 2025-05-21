import React from "react";
import './globals.css'
import QueryProvider from '@/providers/QueryProvider'


const RootLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <html lang="ko">
            <body
                className="min-h-screen bg-gray-100 flex items-center justify-center"
                style={{ backgroundImage: `url(https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/images/background.jpg?v=${Date.now()})` }}
            >
                <div className="w-full max-w-sm bg-white bg-opacity-30 backdrop-blur-md rounded-xl p-6 shadow-lg">
                    <QueryProvider>{children}</QueryProvider>
                </div>
            </body>
        </html>
    )
}

export default RootLayout;
