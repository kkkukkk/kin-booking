'use client'

import { useState } from 'react';
import { TeamMember, TeamRoleKo } from '@/types/model/teamMember';
import Button from '@/components/base/Button';
import { InstagramIcon, YoutubeIcon } from '@/components/icon/SocialIcons';
import ThemeDiv from '@/components/base/ThemeDiv';
import Input from '@/components/base/Input';
import Textarea from '@/components/base/Textarea';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useUpdateTeamMember } from '@/hooks/api/useTeamMembers';
import useToast from '@/hooks/useToast';

interface TeamTabProps {
	teamMember: TeamMember;
}

const TeamTab = ({ teamMember }: TeamTabProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { mutate: updateTeamMember, isPending } = useUpdateTeamMember();
	const { showToast } = useToast();
	
	const [editMode, setEditMode] = useState(false);
	const [editedData, setEditedData] = useState({
		displayName: teamMember.displayName || '',
		bio: teamMember.bio || '',
		instagramLink: teamMember.instagramLink || '',
		youtubeLink: teamMember.youtubeLink || '',
	});

	const handleChange = (field: string, value: string) => {
		setEditedData(prev => ({
			...prev,
			[field]: value
		}));
	};

		const handleSave = () => {
		updateTeamMember(
			{ 
				id: teamMember.id, 
				data: { ...editedData, userId: teamMember.userId } 
			},
			{
				onSuccess: () => {
					setEditMode(false);
					showToast({ message: '팀원 정보가 업데이트되었습니다.', iconType: 'success', autoCloseTime: 3000 });
				},
				onError: (err: any) => {
					showToast({ message: err?.message || '업데이트에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
				}
			}
		);
	};

	const handleCancel = () => {
		setEditedData({
			displayName: teamMember.displayName || '',
			bio: teamMember.bio || '',
			instagramLink: teamMember.instagramLink || '',
			youtubeLink: teamMember.youtubeLink || '',
		});
		setEditMode(false);
	};

	if (editMode) {
		return (
			<ThemeDiv className="p-6 rounded-lg" isChildren>
				<h3 className="text-xl font-semibold mb-4">팀원 정보 수정</h3>
				<div className="space-y-4">
					<div>
						<span className="font-medium opacity-70">보여줄 이름:</span>
						<Input
							theme={theme}
							value={editedData.displayName}
							onChange={(e) => handleChange('displayName', e.target.value)}
							className="w-full mt-1 focus:ring-1 focus:ring-yellow-400"
							placeholder="보여줄 이름을 입력하세요."
						/>
					</div>
					<div>
						<span className="font-medium opacity-70">소개:</span>
						<Textarea
							theme={theme}
							value={editedData.bio}
							onChange={(e) => handleChange('bio', e.target.value)}
							className="w-full mt-1 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
							rows={3}
							placeholder="팀원 소개를 입력하세요."
						/>
					</div>
					<div>
						<span className="font-medium opacity-70">Instagram:</span>
						<Input
							theme={theme}
							value={editedData.instagramLink}
							onChange={(e) => handleChange('instagramLink', e.target.value)}
							className="w-full mt-1 focus:ring-1 focus:ring-pink-400"
							placeholder="Instagram 링크를 입력하세요."
						/>
					</div>
					<div>
						<span className="font-medium opacity-70">YouTube:</span>
						<Input
							theme={theme}
							value={editedData.youtubeLink}
							onChange={(e) => handleChange('youtubeLink', e.target.value)}
							className="w-full mt-1 focus:ring-1 focus:ring-red-400"
							placeholder="YouTube 링크를 입력하세요."
						/>
					</div>
				</div>
				<div className="flex justify-end gap-2 mt-4">
					<Button
						theme="normal"
						padding="px-3 py-1"
						fontSize="text-sm"
						onClick={handleCancel}
						disabled={isPending}
					>취소</Button>
					<Button
						theme="dark"
						padding="px-3 py-1"
						fontSize="text-sm"
						onClick={handleSave}
						disabled={isPending}
					>
						{isPending ? '저장 중...' : '저장'}
					</Button>
				</div>
			</ThemeDiv>
		);
	}

	return (
		<ThemeDiv className="p-6 rounded-lg" isChildren>
			<h3 className="text-xl font-semibold mb-4">멤버 정보</h3>
			<div className="space-y-2">
				<div className="flex justify-between items-center py-2 border-b border-gray-200">
					<span className="font-medium opacity-70">보여줄 이름</span>
					<span>{teamMember.displayName}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-200">
					<span className="font-medium opacity-70">역할</span>
					<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-700/60 text-white">
						{TeamRoleKo[teamMember.teamRole]}
					</span>
				</div>
				{teamMember.bio && (
					<div className="flex flex-col pt-2 pb-4 border-b border-gray-200">
						<span className="font-medium opacity-70 mb-2">소개</span>
						<div className="text-sm leading-relaxed line-clamp-4">{teamMember.bio}</div>
					</div>
				)}
				<div className="flex justify-between items-center py-2">
					<span className="font-medium opacity-70">소셜 링크</span>
					<div className="flex items-center gap-2">
						{teamMember.instagramLink && (
							<a
								href={teamMember.instagramLink}
								target="_blank"
								rel="noopener noreferrer"
								className="text-pink-400 hover:text-pink-300 transition-colors p-1 rounded-full hover:bg-pink-400/10"
								title="Instagram"
							>
								<InstagramIcon className="w-5 h-5" />
							</a>
						)}
						{teamMember.youtubeLink && (
							<a
								href={teamMember.youtubeLink}
								target="_blank"
								rel="noopener noreferrer"
								className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-400/10"
								title="YouTube"
							>
								<YoutubeIcon className="w-5 h-5" />
							</a>
						)}
						{!teamMember.instagramLink && !teamMember.youtubeLink && (
							<span className="text-sm opacity-50">등록된 링크가 없습니다</span>
						)}
					</div>
				</div>
			</div>
			<div className="flex justify-end mt-4">
				<Button
					theme="dark"
					padding="px-3 py-1"
					fontSize="text-sm"
					onClick={() => setEditMode(true)}>
					수정
				</Button>
			</div>
		</ThemeDiv>
	);
};

export default TeamTab; 