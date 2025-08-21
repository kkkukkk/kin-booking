import { useSession } from '@/hooks/useSession';
import { useUsers } from '@/hooks/api/useUsers';
import { getUserHighestRole } from '@/util/userRole';
import { UserRoleStatus } from '@/types/model/userRole';

/**
 * 관리자 권한 체크를 위한 커스텀 훅
 * @returns 관리자 권한 관련 정보와 함수들
 */
export const useAdminAuth = () => {
  const { session } = useSession();

  // 현재 로그인한 사용자 정보 조회
  const { data: currentUserResponse } = useUsers({ id: session?.user?.id });
  const currentUser = currentUserResponse?.data?.[0];
  const currentUserRole = getUserHighestRole(currentUser || null);

  // 권한별 접근 가능 여부
  const isMaster = currentUserRole === UserRoleStatus.Master;
  const isManager = currentUserRole === UserRoleStatus.Manager;
  const isMember = currentUserRole === UserRoleStatus.Member;
  const isUser = currentUserRole === UserRoleStatus.User;

  // 기능별 권한 체크
  const canManageUsers = isMaster; // 사용자 권한 변경은 마스터만
  const canManageEvents = isManager || isMaster; // 공연 관리는 매니저 이상
  const canViewAdmin = isMember || isManager || isMaster; // 관리자 페이지 접근은 멤버 이상

  return {
    // 사용자 정보
    currentUser,
    currentUserRole,

    // 권한 상태
    isMaster,
    isManager,
    isMember,
    isUser,

    // 기능별 권한
    canManageUsers,
    canManageEvents,
    canViewAdmin,

    // 로딩 상태
    isLoading: !currentUserResponse,
  };
};
