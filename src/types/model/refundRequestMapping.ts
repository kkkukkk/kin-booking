export interface RefundRequestMapping {
  id: string;
  userId: string;
  refundAccountId: string;
  reservationId: string;
  eventId: string;
  createdAt: string;
}

export interface CreateRefundRequestMappingRequest {
  userId: string;
  refundAccountId: string;
  reservationId: string;
  eventId: string;
}
