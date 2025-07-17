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
      await queryClient.cancelQueries({ queryKey: ['team-member', userId] });
      const previousTeamMember = queryClient.getQueryData<TeamMember>(['team-member', userId]);
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
      queryClient.setQueryData<TeamMember>(['team-member', userId], (oldData) => {
        if (oldData) {
          return { ...oldData, ...updatedTeamMember };
        }
        return updatedTeamMember;
      });
      queryClient.invalidateQueries({ queryKey: ['team-member', userId] });
    },
    onError: (error, variables, context) => {
      const { userId } = variables.data;
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