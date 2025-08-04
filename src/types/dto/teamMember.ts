import { TeamMember, TeamRoleEnum } from '@/types/model/teamMember';

export type CreateTeamMemberDto = Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateTeamMemberDto = Partial<Omit<TeamMember, 'id' | 'name' | 'createdAt' | 'updatedAt' | 'displayOrder'>>;

// 뷰에서 반환되는 조회용 타입
export interface TeamMemberViewDto {
  id: string;
  name: string;
  teamRole: TeamRoleEnum;
  bio?: string;
  instagramLink?: string;
  youtubeLink?: string;
  displayOrder: number;
  displayName: string;
} 