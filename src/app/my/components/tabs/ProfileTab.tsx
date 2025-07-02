'use client'

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import { useUpdateUser } from '@/hooks/api/useUsers';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import Spinner from '@/components/spinner/Spinner';
import { formatPhoneNumber } from '@/util/phoneNumber';

interface ProfileTabProps {
	user: any;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { mutate: updateUser, isPending } = useUpdateUser();
	const { showToast } = useToast();
	const { showAlert } = useAlert();

	if (!user) {
		return (
			<div className="space-y-6">
				<ThemeDiv className="p-6 rounded-lg">
					<h3 className="text-xl font-semibold mb-4">프로필 정보</h3>
					<div className="text-center py-8">
						<p className="text-gray-500">사용자 정보를 불러올 수 없습니다.</p>
						<p className="text-sm text-gray-400 mt-2">관리자에게 문의해주세요.</p>
					</div>
				</ThemeDiv>
			</div>
		);
	}

	const handleToggle = async () => {
		const confirmed = await showAlert({
			type: 'confirm',
			title: '마케팅 수신 변경',
			message: user.marketingConsent
				? '마케팅 정보 수신을 거부하시겠습니까?'
				: '마케팅 정보 수신에 동의하시겠습니까?',
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

	return (
		<div className="space-y-6">
			<ThemeDiv className="p-6 rounded-lg" isChildren>
				<h3 className="text-xl font-semibold mb-4">프로필 정보</h3>
				<div className="space-y-4">
					<div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
						<span className="font-medium opacity-70">이름</span>
						<span>{user.name}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
						<span className="font-medium opacity-70">이메일</span>
						<span>{user.email}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
						<span className="font-medium opacity-70">전화번호</span>
						<span>{formatPhoneNumber(user.phoneNumber)}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
						<span className="font-medium opacity-70">가입일</span>
						<span>{new Date(user.registerDate).toLocaleDateString('ko-KR')}</span>
					</div>
					<div className="flex justify-between items-center py-2">
						<span className="font-medium opacity-70">마케팅 수신</span>
						<button
							className={`px-3 py-1 rounded transition-colors duration-200 flex items-center gap-2 ${user.marketingConsent ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'} ${isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
							onClick={handleToggle}
							disabled={isPending}
						>
							{isPending && <Spinner size={16} color={user.marketingConsent ? 'white' : 'gray'} />}
							{user.marketingConsent ? '동의' : '거부'}
						</button>
					</div>
				</div>
			</ThemeDiv>
		</div>
	);
};

export default ProfileTab; 