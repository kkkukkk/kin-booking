export enum TeamRoleEnum {
  LEADER = 'LEADER',
  STAFF = 'STAFF',
  CREW = 'CREW',
}

export const TeamRoleKo: Record<TeamRoleEnum, string> = {
  [TeamRoleEnum.LEADER]: '리더',
  [TeamRoleEnum.STAFF]: '스태프',
  [TeamRoleEnum.CREW]: '멤버',
};

// 역할별 표시 순서 매핑
export const TeamRoleDisplayOrder: Record<TeamRoleEnum, number> = {
  [TeamRoleEnum.LEADER]: 0,
  [TeamRoleEnum.STAFF]: 1,
  [TeamRoleEnum.CREW]: 2,
};

export interface TeamMember {
  id: string;
  userId: string;
  bio?: string;
  instagramLink?: string;
  youtubeLink?: string;
  teamRole: TeamRoleEnum;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  displayName: string;
} 