import MainClientSection from "@/app/components/MainClientSection";
import MainHeader from "@/app/components/MainHeader";
import MainFooter from "@/app/components/MainFooter";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <MainHeader />
      <div className="flex-1 overflow-y-auto scrollbar-none relative">
        <MainClientSection />
      </div>
      <MainFooter />
    </div>
  );
}