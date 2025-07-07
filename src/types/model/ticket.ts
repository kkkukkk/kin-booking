export enum TicketStatus {
  Active = 'active',
  Transferred = 'transferred',
  Cancelled = 'cancelled',
  Used = 'used',
  CancelRequested = 'cancel_requested',
}

export const TicketStatusKo: Record<TicketStatus, string> = {
  [TicketStatus.Active]: '유효',
  [TicketStatus.Transferred]: '양도',
  [TicketStatus.Cancelled]: '취소',
  [TicketStatus.Used]: '완료',
  [TicketStatus.CancelRequested]: '취소 신청',
};

export interface Ticket {
  id: string;
  reservationId: string;
  eventId: string;
  ownerId: string;
  status: TicketStatus;
  transferredAt: string | null;
  createdAt: string;
  updatedAt: string;
  color: string | null;
  isRare: boolean;
  ticketNumber: number;
}

export interface CreateTicketRequest {
  reservationId: string;
  eventId: string;
  ownerId: string;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  transferredAt?: string;
}

export interface TransferTicketRequest {
  newOwnerId: string;
  reason?: string;
}
