export interface TicketTransferHistory {
  id: string;
  ticketId: string;
  fromUserId: string;
  toUserId: string;
  transferredAt: string;
  reason: string | null;
  createdAt: string;
}

export interface CreateTransferHistoryRequest {
  ticketId: string;
  fromUserId: string;
  toUserId: string;
  reason?: string;
}

export interface TransferHistoryWithDetails extends TicketTransferHistory {
  ticket?: {
    id: string;
    eventId: string;
    reservationId: string;
    status: string;
  };
  fromUser?: {
    id: string;
    name: string;
    email: string;
  };
  toUser?: {
    id: string;
    name: string;
    email: string;
  };
} 