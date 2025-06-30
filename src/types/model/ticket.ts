export interface Ticket {
  id: string;
  reservationId: string;
  eventId: string;
  ownerId: string;
  status: TicketStatus;
  transferredAt: string | null;
  qrCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TicketStatus = 'active' | 'transferred' | 'cancelled' | 'used';

export interface CreateTicketRequest {
  reservationId: string;
  eventId: string;
  ownerId: string;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  transferredAt?: string;
  qrCode?: string;
}

export interface TransferTicketRequest {
  newOwnerId: string;
  reason?: string;
} 