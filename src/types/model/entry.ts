export enum EntrySessionStatus {
  Pending = 'pending',
  Used = 'used',
  Expired = 'expired'
}

export const EntrySessionStatusKo: Record<EntrySessionStatus, string> = {
  [EntrySessionStatus.Pending]: '대기 중',
  [EntrySessionStatus.Used]: '사용 완료',
  [EntrySessionStatus.Expired]: '만료됨',
};

export interface EntrySessionDto {
  id: string;
  ticketId: string;
  eventId: string;
  userId: string;
  reservationId: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  status: EntrySessionStatus;
}

export interface EntrySessionWithDetailsDto extends EntrySessionDto {
  events: {
    eventName: string;
    eventDate: string;
    location?: string;
  };
  users: {
    name: string;
    email: string;
  };
  reservations: {
    quantity: number;
    ticketHolder: string;
  };
}
