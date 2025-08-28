'use client';

import React from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';
import { TeamMemberViewDto } from '@/types/dto/teamMember';
import { TeamRoleEnum, TeamRoleKo, TeamRoleDisplayOrder } from '@/types/model/teamMember';
import { useUpdateTeamMember } from '@/hooks/api/useTeamMembers';
import useToast from '@/hooks/useToast';

interface TeamMemberModalProps {
    member: TeamMemberViewDto | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TeamMemberModal = ({ member, isOpen, onClose, onSuccess }: TeamMemberModalProps) => {
    const { mutate: updateMember, isPending: isUpdating } = useUpdateTeamMember();
    const { showToast } = useToast();

    const handleRoleChange = (newRole: TeamRoleEnum) => {
        if (!member) return;

        updateMember(
            {
                id: member.teamMemberId,
                data: {
                    teamRole: newRole,
                    displayOrder: TeamRoleDisplayOrder[newRole],
                }
            },
            {
                onSuccess: () => {
                    showToast({
                        message: '역할이 변경되었습니다.',
                        iconType: 'success',
                        autoCloseTime: 3000
                    });
                    onSuccess();
                },
                onError: (error) => {
                    console.error('역할 변경 실패:', error);
                    showToast({
                        message: '역할 변경에 실패했습니다.',
                        iconType: 'error',
                        autoCloseTime: 3000
                    });
                },
            }
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="min-w-[250px] md:min-w-[400px] max-w-md">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        팀 멤버 역할 변경
                    </h2>
                    {member && (
                        <p className="text-sm text-gray-600 mt-1">
                            {member.displayName}의 팀 역할을 변경합니다.
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    {/* 팀 역할 버튼들 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            팀 역할 선택
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.entries(TeamRoleKo).map(([role, label]) => (
                                <Button
                                    key={role}
                                    theme={member?.teamRole === role ? 'neon' : 'normal'}
                                    onClick={() => handleRoleChange(role as TeamRoleEnum)}
                                    fontSize="text-sm"
                                    padding="px-3 py-2"
                                    className="w-full"
                                    disabled={isUpdating}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 닫기 버튼 */}
                <div className="flex justify-end mt-6">
                    <Button
                        onClick={onClose}
                        className="px-4 py-2"
                        disabled={isUpdating}
                    >
                        닫기
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TeamMemberModal;
