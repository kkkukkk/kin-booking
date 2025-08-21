import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTeamMembers,
  fetchTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '@/api/teamMember';
import {
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
  TeamMemberViewDto
} from '@/types/dto/teamMember';
import { TeamMember } from '@/types/model/teamMember';

// 팀 멤버 목록 조회
export const useTeamMembers = () => {
  return useQuery<TeamMemberViewDto[]>({
    queryKey: ['team-members'],
    queryFn: fetchTeamMembers,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// 팀 멤버 단일 조회
export const useTeamMemberById = (id: string) => {
  return useQuery<TeamMember>({
    queryKey: ['team-member', id],
    queryFn: () => fetchTeamMemberById(id),
    enabled: !!id,
    retry: 1,
  });
};

// 팀 멤버 생성
export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamMemberViewDto, Error, CreateTeamMemberDto>({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
};

// 팀 멤버 수정
export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation<TeamMember, Error, { id: string; data: UpdateTeamMemberDto }, { previousTeamMember: TeamMember | undefined }>({
    mutationFn: ({ id, data }) => {
      // userId를 그대로 사용
      return updateTeamMember(id, data);
    },
    onMutate: async ({ id, data }) => {
      const { userId } = data;
      // userId로 조회되는 쿼리만 취소 (실제로 사용되는 쿼리 키)
      await queryClient.cancelQueries({ queryKey: ['team-member', userId] });

      // 이전 데이터 저장
      const previousTeamMember = queryClient.getQueryData<TeamMember>(['team-member', userId]);

      // 낙관적 업데이트 - userId에 대해서만 업데이트
      queryClient.setQueryData<TeamMember>(['team-member', userId], (oldData) => {
        if (oldData) {
          return { ...oldData, ...data };
        }
        return oldData;
      });

      return { previousTeamMember };
    },
    onSuccess: (updatedTeamMember, variables) => {
      const { userId } = variables.data;

      // 성공 시 캐시 업데이트 - userId에 대해서만 업데이트
      queryClient.setQueryData<TeamMember>(['team-member', userId], (oldData) => {
        if (oldData) {
          return { ...oldData, ...updatedTeamMember };
        }
        return updatedTeamMember;
      });

      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['team-member', userId] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
    onError: (error, variables, context) => {
      const { userId } = variables.data;

      // 실패 시 이전 데이터로 롤백
      if (context?.previousTeamMember) {
        queryClient.setQueryData(['team-member', userId], context.previousTeamMember);
      }
    },
  });
};

// 팀 멤버 삭제
export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
}; 