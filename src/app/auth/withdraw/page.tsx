'use client';

import { useState } from "react";
import Button from '@/components/base/Button';
import { useRouter } from 'next/navigation';
import WithdrawConsent from './WithdrawConsent';
import Card from "@/components/Card";
import AnimatedText from '@/components/base/AnimatedText';
import { useSoftDeleteUser } from '@/hooks/api/useUsers';
import { useLogout } from '@/hooks/api/useAuth';
import useToast from '@/hooks/useToast';
import { useSession } from '@/hooks/useSession';

const consentItems = [
  { key: 'withdraw', required: true },
  { key: 'refund', required: true },
];

const WithdrawPage = () => {
  const router = useRouter();
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const { mutate: softDeleteUser, isPending: isDeleting } = useSoftDeleteUser();
  const { mutate: logout } = useLogout();
  const { showToast } = useToast();
  const { session } = useSession();

  const handleBack = () => {
    router.back();
  };

  const handleWithdraw = () => {
    if (!allAgreed) {
      showToast({ message: '모든 안내사항에 동의해 주세요.', iconType: 'warning', autoCloseTime: 3000 });
      return;
    }
    if (!session?.user?.id) return;
    softDeleteUser(session.user.id, {
      onSuccess: () => {
        showToast({ message: '탈퇴 신청이 완료되었습니다.', iconType: 'success', autoCloseTime: 3000 });
        setTimeout(() => {
          logout(undefined, {
            onSuccess: () => {
              router.push('/login?loggedOut=1');
            },
          });
        }, 1000);
      },
      onError: () => {
        showToast({ message: '탈퇴 신청에 실패했습니다. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
      },
    });
  };

  const allAgreed = consentItems.every(item => !item.required || checked[item.key]);

  return (
    <Card>
        <h2 className="text-2xl font-bold mb-10 text-center">회원 탈퇴 안내</h2>
        <div className="mb-2">
            <AnimatedText fontSize="text-base md:text-lg" text="더 이상 함께하지 못해 아쉽지만" />
        </div>
        <div className="mb-2">
            <AnimatedText fontSize="text-base md:text-lg" text="탈퇴 전 확인할 사항이 있어요!" delay={0.8} />
        </div>
        <WithdrawConsent checked={checked} setChecked={setChecked} />
        <div className="flex gap-2">
            <Button theme="normal" className="flex-1" padding="px-2 py-1.5" fontSize="text-sm md:text-base" onClick={handleBack}>
            돌아가기
            </Button>
            <Button theme="dark" className="flex-1" padding="px-2 py-1.5" fontSize="text-sm md:text-base" onClick={handleWithdraw} disabled={isDeleting}>
            {isDeleting ? '처리 중...' : '탈퇴하기'}
            </Button>
        </div>
    </Card>
  );
};

export default WithdrawPage; 