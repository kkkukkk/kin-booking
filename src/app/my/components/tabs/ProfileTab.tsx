'use client'

import ThemeDiv from '@/components/base/ThemeDiv';
import { useUpdateUser } from '@/hooks/api/useUsers';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import Spinner from '@/components/spinner/Spinner';
import { formatPhoneNumber } from '@/util/phoneNumber';
import { useRouter } from 'next/navigation';
import Button from '@/components/base/Button';
import { User } from '@/types/model/user';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

interface ProfileTabProps {
	user: User;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
	const { mutate: updateUser, isPending } = useUpdateUser();
	const { showToast } = useToast();
	const { showAlert } = useAlert();
	const router = useRouter();
	const theme = useAppSelector((state: RootState) => state.theme.current);

	if (!user) {
		return (
			<div className="text-center">
				<div className="mb-6">
					<div className="relative mx-auto w-24 h-24 mb-4">
						{/* 사용자 아이콘 배경 */}
						<div className={clsx(
							"absolute inset-0 rounded-full opacity-20",
							theme === "normal" ? "bg-yellow-100" : "bg-[var(--neon-yellow)]/20"
						)}></div>
						{/* 사용자 아이콘 */}
						<div className={clsx(
							"absolute inset-2 rounded-full flex items-center justify-center",
							theme === "normal" ? "bg-yellow-50" : "bg-[var(--neon-yellow)]/30"
						)}>
							<svg className="w-8 h-8 opacity-60" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
							</svg>
						</div>
					</div>
				</div>
				<h3 className="text-base md:text-xl font-bold mb-3">사용자 정보를 불러올 수 없어요</h3>
				<p className="text-sm opacity-70 mb-6 leading-relaxed">
					정보를 불러오는데 실패했어요!<br />
					관리자에게 문의해주세요
				</p>
			</div>
		);
	}

	const handleToggle = async () => {
		const confirmed = await showAlert({
			type: 'confirm',
			title: '공연정보 수신 변경',
			message: user.marketingConsent
				? '공연정보 수신을 거부하시겠습니까?'
				: '공연정보 수신에 동의하시겠습니까?',
		});
		if (!confirmed) return;

		updateUser(
			{ userId: user.id, update: { marketingConsent: !user.marketingConsent } },
			{
				onSuccess: () => {
					showToast({ message: '마케팅 수신 여부가 변경되었습니다.', iconType: 'success', autoCloseTime: 3000 });
				},
				onError: () => {
					showToast({ message: '변경에 실패했습니다. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
				},
			}
		);
	};

	const handlePasswordChange = async () => {
		const confirmed = await showAlert({
			type: 'confirm',
			title: '비밀번호 변경',
			message: '비밀번호를 변경하시겠습니까?',
		});
		if (confirmed) {
			router.push('/auth/reset-password?source=password&logout=false');
		}
	};

	const handleWithdraw = () => {
		router.push('/auth/withdraw');
	};

	return (
		<ThemeDiv className="p-6 rounded" isChildren>
			<div className={"flex justify-between items-start w-full mb-6"}>
				<h3 className="text-lg sm:text-xl font-semibold">프로필</h3>
				<div className="flex gap-2 items-center">
					<Button
						theme="dark"
						padding="px-2 py-1.5"
						className="text-xs md:text-sm font-semibold"
						reverse={true}
						onClick={handleWithdraw}
					>
						회원탈퇴
					</Button>
					<Button
						theme="dark"
						padding="px-2 py-1.5"
						className="text-xs md:text-sm font-semibold"
						reverse={true}
						onClick={handlePasswordChange}
					>
						비밀번호 변경
					</Button>
				</div>
			</div>
			<div className="space-y-4 text-sm md:text-base">
				<div className="flex justify-between items-center py-2 border-b border-gray-200">
					<span className="font-medium opacity-70">이름</span>
					<span>{user.name}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-200">
					<span className="font-medium opacity-70">이메일</span>
					<span>{user.email}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-200">
					<span className="font-medium opacity-70">핸드폰 번호</span>
					<span>{formatPhoneNumber(user.phoneNumber)}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-200">
					<span className="font-medium opacity-70">가입일</span>
					<span>{dayjs(user.registerDate).format('YYYY년 MM월 DD일')}</span>
				</div>
				<div className="flex justify-between items-center py-2">
					<span className="font-medium opacity-70">공연정보 수신</span>
					<button
						className={`px-3 py-1 rounded transition-all duration-200 font-semibold flex items-center gap-2 cursor-pointer shadow-sm ${user.marketingConsent ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md' : 'bg-gray-300 text-gray-700 hover:bg-gray-400 hover:shadow-md'} ${isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
						onClick={handleToggle}
						disabled={isPending}
					>
						{isPending && <Spinner size={16} color={user.marketingConsent ? 'white' : 'gray'} />}
						{user.marketingConsent ? '동의' : '거부'}
					</button>
				</div>
			</div>
		</ThemeDiv>
	);
};

export default ProfileTab; 