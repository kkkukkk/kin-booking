"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/base/Button";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icon/ArrowIcons";
import TermsOfService from "@/app/register/components/terms/TermsOfService";
import PersonalInfo from "@/app/register/components/terms/PersonalInfo";
import Marketing from "@/app/register/components/terms/Marketing";
import Seat from "@/app/events/[eventId]/reservation/components/steps/terms/Seat";
import Cancel from "@/app/events/[eventId]/reservation/components/steps/terms/Cancel";
import { DEFAULT_REFUND_POLICY } from "@/types/refund";
import WithdrawNotice from '@/app/auth/withdraw/terms/WithdrawNotice';
import RefundNotice from '@/app/auth/withdraw/terms/RefundNotice';

type TermsTab = "service" | "privacy" | "marketing" | "seat" | "cancel" | "withdraw" | "refund";

const TermsClient = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TermsTab>("service");

  const tabs = [
    { id: "service" as TermsTab, label: "이용약관" },
    { id: "privacy" as TermsTab, label: "개인정보 처리 방침" },
    { id: "marketing" as TermsTab, label: "공연정보 수신 동의" },
    { id: "seat" as TermsTab, label: "좌석 예매 정책" },
    { id: "cancel" as TermsTab, label: "취소/환불 정책" },
    { id: "withdraw" as TermsTab, label: "회원 탈퇴 안내" },
    { id: "refund" as TermsTab, label: "티켓/환불 안내" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "service":
        return <TermsOfService />;
      case "privacy":
        return <PersonalInfo />;
      case "marketing":
        return <Marketing />;
      case "seat":
        return <Seat />;
      case "cancel":
        return <Cancel policy={DEFAULT_REFUND_POLICY} />;
      case "withdraw":
        return <WithdrawNotice />;
      case "refund":
        return <RefundNotice />;
      default:
        return <TermsOfService />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 via-green-900/20 to-black">
      {/* 헤더 */}
      <motion.div
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          onClick={() => router.back()}
          theme="dark"
          padding="px-2 py-1"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900/50 via-green-900/10 to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id
                    ? "text-white border-b-2 border-green-500"
                    : "text-gray-400 hover:text-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white/5 via-green-500/5 to-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10 text-white shadow-lg"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default TermsClient; 