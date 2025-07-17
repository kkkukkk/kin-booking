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