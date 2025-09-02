import MainClient from "@/app/components/MainClient";
import MainHeader from "@/app/components/MainHeader";
import MainFooter from "@/app/components/MainFooter";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KIN',
  description: 'KIN과 함께 특별한 순간을 만들어보세요.',
  openGraph: {
    title: 'KIN',
    description: 'KIN과 함께 특별한 순간을 만들어보세요.',
  },
};

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <MainHeader />
      <div className="flex-1 overflow-y-auto scrollbar-none relative" data-scroll-container="true">
        <MainClient />
      </div>
      <MainFooter />
    </div>
  );
}