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
import { useSoftDeleteUser } from '@/hooks/api/useUsers';
import { useLogout } from '@/hooks/api/useAuth';

interface ProfileTabProps {
	user: User;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
	const { mutate: updateUser, isPending } = useUpdateUser();
	const { mutate: softDeleteUser, isPending: isDeleting } = useSoftDeleteUser();
	const { mutate: logout } = useLogout();
	const { showToast } = useToast();
	const { showAlert } = useAlert();
	const router = useRouter();

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
			message: '비밀번호를 변경하시겠습니까?\n자동으로 로그아웃 됩니다.',
		});
		if (confirmed) {
			router.push('/auth/reset-password?source=password&logout=true');
		}
	};

	const handleWithdraw = () => {
		router.push('/auth/withdraw');
	};

	return (
		<ThemeDiv className="p-6 rounded-lg" isChildren>
			<div className={"flex justify-between items-start w-full mb-6"}>
				<h3 className="text-lg sm:text-xl font-semibold">프로필</h3>
				<div className="flex gap-2 items-center">
					<Button
						theme="dark"
						padding="px-2 py-1.5"
						className="text-xs sm:text-sm"
						onClick={handleWithdraw}
					>
						회원탈퇴
					</Button>
					<Button
						theme="dark"
						padding="px-2 py-1.5"
						className="text-xs sm:text-sm"
						onClick={handlePasswordChange}
					>
						비밀번호 변경
					</Button>
				</div>
			</div>
			<div className="space-y-4">
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
					<span>{new Date(user.registerDate).toLocaleDateString('ko-KR')}</span>
				</div>
				<div className="flex justify-between items-center py-2">
					<span className="font-medium opacity-70">공연정보 수신</span>
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
	);
};

export default ProfileTab; 