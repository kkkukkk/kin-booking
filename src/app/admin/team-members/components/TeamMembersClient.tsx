'use client';

import { useState } from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import DataTable from '@/components/base/DataTable';
import { TeamMemberViewDto } from '@/types/dto/teamMember';
import { TeamRoleEnum, TeamRoleKo } from '@/types/model/teamMember';
import { useTeamMembers, useUpdateTeamMember } from '@/hooks/api/useTeamMembers';
import Spinner from '@/components/spinner/Spinner';

import SearchBar from '@/components/search/SearchBar';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import TeamMemberModal from './TeamMemberModal';
import { useSession } from '@/hooks/useSession';
import { getUserHighestRole } from '@/util/userRole';
import { UserRoleStatus } from '@/types/model/userRole';
import { useUsers } from '@/hooks/api/useUsers';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';


const TeamMembersClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  const { showAlert } = useAlert();
  const { session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberViewDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  const { data: teamMembers, isLoading, error, refetch } = useTeamMembers();
  const updateTeamMemberMutation = useUpdateTeamMember();

  // 현재 로그인한 사용자 정보 조회
  const { data: currentUser } = useUsers({ id: session?.user?.id });
  const currentUserRole = getUserHighestRole(currentUser?.data?.[0] || null);
  const isMaster = currentUserRole === UserRoleStatus.Master;



  const filteredMembers = teamMembers?.filter(member => {
    const matchesSearch = member.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || roleFilter === 'all' || member.teamRole === roleFilter;
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    return a.displayOrder - b.displayOrder;
  }) || [];



  const handleMemberClick = (member: TeamMemberViewDto) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (member: TeamMemberViewDto) => {
    if (!isMaster) {
      showToast({ 
        message: '멤버 상태 변경은 마스터 권한이 필요합니다.', 
        iconType: 'error',
        autoCloseTime: 3000
      });
      return;
    }

    const newStatus = !member.isActive;
    const action = newStatus ? '활성화' : '비활성화';

    const confirmed = await showAlert({
      type: 'confirm',
      title: '팀 멤버 상태 변경',
      message: `정말로 ${member.displayName}을(를) ${action}하시겠습니까?\n\n주의사항:\n• 역할 변경 시 자동으로 멤버 상태가 동기화됩니다\n• 수동으로 상태를 변경하면 자동 동기화와 충돌할 수 있습니다\n• 가능한 한 사용자 관리 페이지에서 역할 변경을 권장합니다`
    });

    if (confirmed) {
      try {
        await updateTeamMemberMutation.mutateAsync({
          id: member.teamMemberId,
          data: {
            isActive: newStatus,
          }
        });
        showToast({ 
          message: `멤버가 ${action}되었습니다.`, 
          iconType: 'success',
          autoCloseTime: 3000
        });
        refetch();
      } catch (error) {
        showToast({ 
          message: `멤버 ${action}에 실패했습니다.`, 
          iconType: 'error',
          autoCloseTime: 3000
        });
      }
    }
  };



  const columns = [
    {
      key: 'displayName',
      header: '이름',
      render: (member: TeamMemberViewDto) => (
        <div className="text-sm">
          <div className="font-medium">{member.displayName}</div>
        </div>
      ),
      width: '10%',
    },
    {
      key: 'teamRole',
      header: '역할',
      render: (member: TeamMemberViewDto) => (
        <div className="text-sm">
          <div className="font-medium">{TeamRoleKo[member.teamRole as TeamRoleEnum]}</div>
        </div>
      ),
      width: '10%',
    },
    {
      key: 'bio',
      header: '소개',
      render: (member: TeamMemberViewDto) => (
        <div className="text-sm">
          <div className="truncate max-w-xs">{member.bio || '-'}</div>
        </div>
      ),
      width: '27%',
    },
    {
      key: 'instagramLink',
      header: 'Instagram',
      render: (member: TeamMemberViewDto) => member.instagramLink ? (
        <a href={member.instagramLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
          링크
        </a>
      ) : '-',
      width: '15%',
    },
    {
      key: 'youtubeLink',
      header: 'YouTube',
      render: (member: TeamMemberViewDto) => member.youtubeLink ? (
        <a href={member.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
          링크
        </a>
      ) : '-',
      width: '15%',
    },
    {
      key: 'actions',
      header: '작업',
      render: (member: TeamMemberViewDto) => (
        <div className="flex space-x-2">
          {isMaster && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // 행 클릭 이벤트 방지
                handleToggleActive(member);
              }}
              className={`px-2 py-1 text-xs cursor-pointer rounded font-semibold text-white hover:opacity-80 ${
                member.isActive 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {member.isActive ? '비활성화' : '활성화'}
            </button>
          )}
          <span className="text-xs text-gray-400">행 클릭: 역할 변경</span>
        </div>
      ),
      width: '15%',
    },
  ];

  if (isLoading) {
    return (
      <ThemeDiv className="flex flex-col min-h-full">
        <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold mb-2">팀 멤버 관리</h1>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
          <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
        </div>
      </ThemeDiv>
    );
  }

  if (error) {
    return (
      <ThemeDiv className="flex flex-col min-h-full">
        <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold mb-2">팀 멤버 관리</h1>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
          <div className="text-center">
            <p className="text-red-500 mb-4">멤버 정보를 불러오는데 실패했습니다.</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              다시 시도
            </button>
          </div>
        </div>
      </ThemeDiv>
    );
  }

  return (
    <ThemeDiv className="flex flex-col min-h-full">
      {/* 상단 고정 영역 */}
      <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
        <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
          <h1 className="text-lg md:text-xl font-bold mb-2">팀 멤버 관리</h1>
        </div>

        {/* 검색 및 필터 */}
        <SearchBar
          label="멤버 검색 및 필터"
          initialOpen={false}
          filters={{
            keyword: {
              value: searchTerm,
              onChange: setSearchTerm,
              placeholder: "이름 또는 소개 검색..."
            },
            role: {
              value: roleFilter,
              onChange: setRoleFilter,
              options: [
                { value: 'all', label: '모든 역할' },
                ...Object.entries(TeamRoleKo).map(([role, label]) => ({
                  value: role,
                  label: label,
                }))
              ],
            },
          }}
        />
      </div>

      {/* 테이블 상단 정보 영역 */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-2">
        {/* 총 개수 */}
        <div className="flex-1 md:flex-2/3 flex justify-start mb-2 md:mb-0">
          <span className="text-sm text-gray-400">
            총 {filteredMembers.length}건 표시
          </span>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
        {/* 멤버 목록 테이블 */}
        <div className="flex-1 min-h-fit md:min-h-0">
          <DataTable
            data={filteredMembers}
            columns={columns}
            theme={theme}
            isLoading={isLoading}
            emptyMessage="멤버가 없습니다."
            loadingMessage="로딩 중..."
            className="h-full"
            onRowClick={handleMemberClick}
          />
        </div>
      </div>

      {/* 멤버 편집 모달 */}
      {isModalOpen && editingMember && (
        <TeamMemberModal
          member={editingMember}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMember(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingMember(null);
            refetch();
          }}
        />
      )}
    </ThemeDiv>
  );
};

export default TeamMembersClient;
