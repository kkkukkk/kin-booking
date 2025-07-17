import { supabase } from '@/lib/supabaseClient';
import {
  CreateTeamMemberDto,
  UpdateTeamMemberDto,
  TeamMemberViewDto
} from '@/types/dto/teamMember';
import { toCamelCaseKeys, toSnakeCaseKeys } from '@/util/case/case';
import { TeamMember } from '@/types/model/teamMember';

// 팀 멤버 목록 조회 (뷰 사용)
export const fetchTeamMembers = async (): Promise<TeamMemberViewDto[]> => {
  const { data, error } = await supabase
    .from('team_members_view')
    .select('*')

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