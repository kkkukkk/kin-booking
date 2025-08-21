'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';
import { UserWithRoles } from '@/types/dto/user';
import { UserRoleStatus, UserRoleStatusKo } from '@/types/model/userRole';
import { formatPhoneNumber } from '@/util/phoneNumber';

interface UserRoleChangeModalProps {
  user: UserWithRoles;
  theme: string;
  onRoleChange: (userId: string, newRole: UserRoleStatus) => void;
  onClose: () => void;
}

const UserRoleChangeModal = ({ user, theme, onRoleChange, onClose }: UserRoleChangeModalProps) => {
  return (
    <Modal onClose={onClose}>
      <div className='min-w-xs max-w-sm'>
        <div className="mb-4">
          <h2 className="text-lg font-bold">사용자 권한 변경</h2>
        </div>

        {/* 사용자 기본 정보 */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${theme === 'normal' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-300'}`}>이름:</span>
            <span className="text-sm">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${theme === 'normal' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-300'}`}>이메일:</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${theme === 'normal' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-300'}`}>핸드폰 번호:</span>
            <span className="text-sm">{formatPhoneNumber(user.phoneNumber)}</span>
          </div>
        </div>

        {/* 권한 설정 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">권한 설정</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: UserRoleStatus.Master, label: UserRoleStatusKo[UserRoleStatus.Master] },
              { value: UserRoleStatus.Manager, label: UserRoleStatusKo[UserRoleStatus.Manager] },
              { value: UserRoleStatus.Member, label: UserRoleStatusKo[UserRoleStatus.Member] },
              { value: UserRoleStatus.User, label: UserRoleStatusKo[UserRoleStatus.User] }
            ].map((role) => (
              <Button
                key={role.value}
                theme={user.userRoles?.roles?.roleCode === role.value.toUpperCase() ? 'neon' : (theme === 'normal' ? 'normal' : 'dark')}
                onClick={() => onRoleChange(user.id, role.value as UserRoleStatus)}
                fontSize="text-sm"
                padding="px-3 py-2"
                className="w-full"
              >
                {role.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            theme='dark'
            reverse={theme === 'normal'}
            onClick={onClose}
            fontSize='text-sm'
            padding='px-3 py-1.5 md:py-1'
          >
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserRoleChangeModal;
