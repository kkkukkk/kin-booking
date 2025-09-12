'use client';

import React, { useState } from 'react';
import { useUsers, useUpdateUserRole } from '@/hooks/api/useUsers';
import { resendConfirmationEmail } from '@/api/auth';
import useDebounce from '@/hooks/useDebounce';
import { useRoles } from '@/hooks/api/useRoles';
import DataTable from '@/components/base/DataTable';

import { UserWithRoles } from '@/types/dto/user';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { StatusBadge } from '@/components/status/StatusBadge';
import useToast from '@/hooks/useToast';
import SearchBar from '@/components/search/SearchBar';
import ThemeDiv from '@/components/base/ThemeDiv';
import { UserStatusKo } from '@/types/model/user';

import { UserRoleStatus, UserRoleStatusKo } from '@/types/model/userRole';
import PaginationButtons from '@/components/pagination/PaginationButtons';
import Select from '@/components/base/Select';
import { formatPhoneNumber } from '@/util/phoneNumber';
import dayjs from 'dayjs';
import UserRoleChangeModal from './UserRoleChangeModal';
import { useSession } from '@/hooks/useSession';
import { getUserHighestRole } from '@/util/userRole';

const UsersClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  const { session } = useSession();

  // 현재 로그인한 사용자 정보 조회
  const { data: currentUser } = useUsers({ id: session?.user?.id });
  const currentUserRole = getUserHighestRole(currentUser?.data?.[0] || null);
  const isMaster = currentUserRole === UserRoleStatus.Master;

  // 검색/필터 상태
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: '',
    role: '',
  });

  // 디바운싱된 검색어 (500ms 후 API 호출)
  const debouncedKeyword = useDebounce(searchParams.keyword, 300);

  // 정렬 상태
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: 'asc' | 'desc';
  }>({
    field: 'registerDate',
    direction: 'desc'
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 페이지 크기 옵션
  const pageSizeOptions = [10, 20, 50, 100];

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

  // 사용자 및 역할 데이터
  const { data: usersResponse, isLoading, error, refetch } = useUsers({
    keyword: debouncedKeyword,
    status: searchParams.status,
    page: 1, // 클라이언트 사이드 필터링을 위해 항상 전체 데이터를 가져옴
    size: 1000, // 충분히 큰 값으로 설정
    sortBy: sortConfig.field === 'role' ? 'registerDate' : sortConfig.field, // 역할 정렬은 클라이언트에서 처리
    sortDirection: sortConfig.field === 'role' ? 'desc' : sortConfig.direction,
  });
  const { data: roles } = useRoles();
  const updateUserRoleMutation = useUpdateUserRole();

  const users = React.useMemo(() => usersResponse?.data || [], [usersResponse?.data]);
  
  // 클라이언트 사이드 필터링 및 정렬
  const processedUsers = React.useMemo(() => {
    const usersData = users || [];
    let processed = usersData;
    
    // 역할 필터링 (클라이언트 사이드)
    if (searchParams.role) {
      processed = processed.filter(user => 
        user.userRoles?.roles?.roleCode === searchParams.role
      );
    }
    
    // 역할 정렬 (클라이언트 사이드)
    if (sortConfig.field === 'role') {
      processed = processed.sort((a, b) => {
        const roleA = a.userRoles?.roles?.roleCode || '';
        const roleB = b.userRoles?.roles?.roleCode || '';
        
        // 역할 우선순위 정의 (마스터 > 매니저 > 멤버 > 유저)
        const rolePriority = {
          [UserRoleStatus.Master]: 4,
          [UserRoleStatus.Manager]: 3,
          [UserRoleStatus.Member]: 2,
          [UserRoleStatus.User]: 1
        };
        
        const priorityA = rolePriority[roleA as UserRoleStatus] || 0;
        const priorityB = rolePriority[roleB as UserRoleStatus] || 0;
        
        if (sortConfig.direction === 'asc') {
          return priorityA - priorityB;
        } else {
          return priorityB - priorityA;
        }
      });
    }
    
    return processed;
  }, [users, searchParams.role, sortConfig.field, sortConfig.direction]);
  
  // 필터링된 결과로 페이지네이션 계산
  const finalUsers = processedUsers;
  const totalCount = finalUsers.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // 페이지네이션 적용 (클라이언트 사이드)
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = finalUsers.slice(startIndex, endIndex);

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchParams(prev => ({ ...prev, keyword }));
    setCurrentPage(1);
  };

  // 상태 필터 핸들러
  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({ ...prev, status }));
    setCurrentPage(1);
  };

  // 역할 필터 핸들러
  const handleRoleFilter = (role: string) => {
    setSearchParams(prev => ({ ...prev, role }));
    setCurrentPage(1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // 정렬 핸들러
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({ field, direction });
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
  };

  // 사용자 클릭 핸들러
  const handleUserClick = (user: UserWithRoles) => {
    if (!isMaster) {
      showToast({
        message: '권한이 없습니다.',
        iconType: 'error',
        autoCloseTime: 3000
      });
      return;
    }

    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };



  // 역할 변경 핸들러
  const handleRoleChange = async (userId: string, newRoleStatus: UserRoleStatus) => {
    try {
      // roles에서 해당 roleCode에 맞는 role_id 찾기
      const targetRole = roles?.find(role => role.roleCode === newRoleStatus);
      if (!targetRole) {
        showToast({ message: '해당 역할을 찾을 수 없습니다.', iconType: 'error' });
        return;
      }

      // 실제 역할 변경 API 호출
      await updateUserRoleMutation.mutateAsync({
        userId,
        newRoleId: targetRole.id,
        roleCode: newRoleStatus
      });

      showToast({ message: `역할이 ${UserRoleStatusKo[newRoleStatus]}로 변경되었습니다.`, iconType: 'success', autoCloseTime: 3000 });

      // selectedUser 상태 업데이트 (모달에서 즉시 반영)
      setSelectedUser(prev => prev ? {
        ...prev,
        userRoles: {
          ...prev.userRoles,
          roles: {
            ...prev.userRoles?.roles,
            roleCode: newRoleStatus
          }
        }
      } : null);

      // 권한 변경 후 모달 닫기
      setIsModalOpen(false);
      setSelectedUser(null);

      // 데이터 새로고침
      refetch();
    } catch (error) {
      showToast({ message: '역할 변경에 실패했습니다.', iconType: 'error' });
    }
  };

  // 인증 메일 재전송 핸들러
  const handleResendEmail = async (email: string) => {
    try {
      await resendConfirmationEmail(email);
      showToast({ 
        message: `${email}로 인증 메일을 재전송했습니다.`, 
        iconType: 'success', 
        autoCloseTime: 3000 
      });
    } catch (error) {
      showToast({ 
        message: `인증 메일 재전송 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, 
        iconType: 'error', 
        autoCloseTime: 3000 
      });
    }
  };



  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'name',
      header: '이름',
      render: (user: UserWithRoles) => (
        <div className="font-medium">{user.name}</div>
      ),
      width: '12%',
      sortable: true,
    },
    {
      key: 'email',
      header: '이메일',
      render: (user: UserWithRoles) => (
        <div className="text-sm">{user.email}</div>
      ),
      width: '22%',
      sortable: true,
    },
    {
      key: 'phoneNumber',
      header: '전화번호',
      render: (user: UserWithRoles) => (
        <div className="text-sm">{formatPhoneNumber(user.phoneNumber)}</div>
      ),
      width: '15%',
      sortable: true,
    },
    {
      key: 'role',
      header: '역할',
      render: (user: UserWithRoles) => (
        <div className="flex items-center space-x-2">
          <StatusBadge
            status={user.userRoles?.roles?.roleCode || UserRoleStatus.User}
            theme={theme}
            className="text-xs"
            statusType="userRole"
            size="sm"
          />
        </div>
      ),
      width: '12%',
      sortable: true,
    },
    {
      key: 'status',
      header: '상태',
      render: (user: UserWithRoles) => (
        <div className="flex items-center space-x-2">
          <StatusBadge
            status={user.status}
            theme={theme}
            className="text-xs"
            statusType="user"
            size="sm"
          />
        </div>
      ),
      width: '12%',
      sortable: true,
    },
    {
      key: 'registerDate',
      header: '가입일',
      render: (user: UserWithRoles) => (
        <div className="text-sm">
          {dayjs(user.registerDate).format('YYYY-MM-DD')}
        </div>
      ),
      width: '12%',
      sortable: true,
    },
    {
      key: 'emailVerified',
      header: '메일 인증',
      render: (user: UserWithRoles) => (
        <div className={`text-sm ${user.emailVerified ? 'text-green-500' : 'text-red-500'}`}>
          {user.emailVerified ? '완료' : '미완'}
        </div>
      ),
      width: '12%',
    },
    {
      key: 'marketingConsent',
      header: '마케팅 동의',
      render: (user: UserWithRoles) => (
        <div className={`text-sm ${user.marketingConsent ? 'text-green-500' : 'text-red-500'}`}>
          {user.marketingConsent ? '동의' : '거부'}
        </div>
      ),
      width: '12%',
    },
  ];

  // 모바일 카드 섹션 렌더 함수
  const mobileCardSections = (user: UserWithRoles) => ({
    firstRow: (
      <>
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="font-semibold text-sm truncate">{user.name}</span>
            <div className="flex items-center gap-2">
              <StatusBadge
                status={user.userRoles?.roles?.roleCode || UserRoleStatus.User}
                theme={theme}
                statusType="userRole"
                size="sm"
              />
              <StatusBadge
                status={user.status}
                theme={theme}
                className="text-xs"
                statusType="user"
                size="sm"
              />
            </div>
          </div>
        </div>
      </>
    ),
    secondRow: (
      <>
        <div className="w-full flex flex-col gap-1">
          <div className="flex text-sm items-center justify-between">
            <div>가입일</div>
            <span className="text-sm truncate">{dayjs(user.registerDate).format('YYYY-MM-DD')}</span>
          </div>
          <div className="truncate text-sm flex items-center justify-between">
            <div>핸드폰 번호</div>
            <span>{formatPhoneNumber(user.phoneNumber)}</span>
          </div>
          <div className="truncate text-sm flex items-center justify-between">
            <div>이메일</div>
            <span>{user.email}</span>
          </div>
          <div className="truncate text-sm flex items-center justify-between">
            <div>이메일 인증</div>
            <span className={user.emailVerified ? 'text-green-500' : 'text-red-500'}>
              {user.emailVerified ? '완료' : '미완'}
            </span>
          </div>
        </div>
      </>
    ),
  });

  return (
    <ThemeDiv className="flex flex-col min-h-full">
      {/* 상단 고정 영역 */}
      <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
        <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
          <h1 className="text-lg md:text-xl font-bold mb-2">사용자 관리</h1>
        </div>

        {/* 검색 및 필터 */}
        <SearchBar
          label="사용자 검색 및 필터"
          initialOpen={false}
          filters={{
            keyword: {
              value: searchParams.keyword,
              onChange: handleSearch,
              placeholder: "이름, 이메일 검색..."
            },
            status: {
              value: searchParams.status,
              onChange: handleStatusFilter,
              options: [
                { value: '', label: '상태' },
                ...Object.entries(UserStatusKo).map(([key, label]) => ({
                  value: key,
                  label
                }))
              ]
            },
            role: {
              value: searchParams.role,
              onChange: handleRoleFilter,
              options: [
                { value: '', label: '권한' },
                ...(roles?.map(role => ({
                  value: role.roleCode,
                  label: UserRoleStatusKo[role.roleCode]
                })) || [])
              ]
            }
          }}
        />
      </div>

      {/* 테이블 상단 정보 영역 */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-2">
        {/* 총 개수 */}
        <div className="flex-1 md:flex-2/3 flex justify-start mb-2 md:mb-0">
                              <span className="text-sm text-gray-400">
                        총 {totalCount}명 중 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)}명 표시
                    </span>
        </div>

        {/* 페이지 크기 선택 */}
        <div className="flex items-center gap-4 flex-1 justify-end shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 md:w-[80%] whitespace-nowrap">페이지당 표시:</span>
            <Select
              theme={theme}
              value={pageSize.toString()}
              onChange={(value) => handlePageSizeChange(Number(value))}
              className="min-w-20"
              options={pageSizeOptions.map(size => ({
                value: size.toString(),
                label: `${size}명`
              }))}
              fontSize="text-xs md:text-sm"
            />
          </div>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
        {/* 사용자 목록 테이블 */}
        <div className="flex-1 min-h-fit md:min-h-0">
          {error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-red-500 mb-4">사용자 목록을 불러오는데 실패했습니다.</p>
              <button 
                onClick={() => refetch()} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <DataTable
              data={paginatedUsers}
              columns={columns}
              theme={theme}
              isLoading={isLoading}
              emptyMessage="사용자가 없습니다."
              loadingMessage="로딩 중..."
              className="h-full"
              mobileCardSections={mobileCardSections}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              onRowClick={isMaster ? handleUserClick : undefined}
            />
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-6">
          <PaginationButtons
            paginationInfo={{
              page: currentPage,
              totalPages,
              size: pageSize,
              hasPrev: currentPage > 1,
              hasNext: currentPage < totalPages
            }}
            onPageChange={handlePageChange}
            showFirstLast={false}
          />
        </div>
      </div>

      {/* 사용자 권한 변경 모달 */}
      {isModalOpen && selectedUser && (
        <UserRoleChangeModal
          user={selectedUser}
          theme={theme}
          onRoleChange={handleRoleChange}
          onResendEmail={handleResendEmail}
          onClose={handleCloseModal}
        />
      )}
    </ThemeDiv>
  );
};

export default UsersClient; 