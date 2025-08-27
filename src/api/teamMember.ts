import { supabase } from '@/lib/supabaseClient';
import {
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
  TeamMemberViewDto
} from '@/types/dto/teamMember';
import { toCamelCaseKeys, toSnakeCaseKeys } from '@/util/case/case';
import { TeamMember, TeamRoleDisplayOrder } from '@/types/model/teamMember';

// 팀 멤버 목록 조회 (모든 멤버 - 관리자용)
export const fetchTeamMembers = async (): Promise<TeamMemberViewDto[]> => {
  const { data, error } = await supabase
    .from('team_members_view')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return toCamelCaseKeys<TeamMemberViewDto[]>(data ?? []);
};

// 활성 팀 멤버 목록 조회 (About 페이지용)
export const fetchActiveTeamMembers = async (): Promise<TeamMemberViewDto[]> => {
  const { data, error } = await supabase
    .from('team_members_view')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return toCamelCaseKeys<TeamMemberViewDto[]>(data ?? []);
};

// 팀 멤버 단일 조회
export const fetchTeamMemberById = async (id: string): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return toCamelCaseKeys<TeamMember>(data);
};

// 팀 멤버 생성
export const createTeamMember = async (teamMember: CreateTeamMemberDto): Promise<TeamMemberViewDto> => {
  const { data, error } = await supabase
    .from('team_members')
    .insert(toSnakeCaseKeys(teamMember))
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<TeamMemberViewDto>(data);
};

// 팀 멤버 수정
export const updateTeamMember = async (id: string, teamMember: UpdateTeamMemberDto): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from('team_members')
    .update(toSnakeCaseKeys(teamMember))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<TeamMember>(data);
};

// 팀 멤버 삭제 (소프트 삭제)
export const deleteTeamMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('team_members')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
};

// 사용자 역할 변경 시 팀 멤버 자동 생성/비활성화
export const syncTeamMemberWithUserRole = async (userId: string, newRoleCode: string): Promise<void> => {
  // 먼저 기존 팀 멤버가 있는지 확인
  const { data: existingMember, error: fetchError } = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  // 사용자 정보 조회 (displayName을 위해)
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('name')
    .eq('id', userId)
    .single();

  if (userError) throw userError;

  // 역할에 따른 팀 멤버 처리
  if (['MEMBER', 'MANAGER', 'MASTER'].includes(newRoleCode)) {
    // 팀 멤버 역할로 변경된 경우 (MEMBER, MANAGER, MASTER 모두 CREW로 생성)
    if (existingMember) {
      // 기존 멤버가 있으면 활성화
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ is_active: true })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      // 기존 멤버가 없으면 새로 생성 (항상 CREW로)
      const { error: insertError } = await supabase
        .from('team_members')
        .insert({
          user_id: userId,
          display_name: user.name,
          team_role: 'CREW',
          is_active: true,
          display_order: TeamRoleDisplayOrder.CREW
        });

      if (insertError) throw insertError;
    }
  } else if (newRoleCode === 'USER') {
    // 일반 사용자로 변경된 경우
    if (existingMember) {
      // 기존 멤버가 있으면 비활성화
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    }
  }
}; 