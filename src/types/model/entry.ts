export interface EntrySessionDto {
    id: string;
    ticketId: string;
    eventId: string;
    userId: string;
    reservationId: string;
    createdAt: string;
    expiresAt: string;
    usedAt?: string;
    status: 'pending' | 'used' | 'expired';
  }
  
  export interface EntrySessionWithDetailsDto extends EntrySessionDto {
    tickets: {
      id: string;
      ticketNumber: number;
      status: string;
    };
    events: {
      eventName: string;
      eventDate: string;
      location?: string;
    };
    users: {
      name: string;
      email: string;
    };
  }
  
  export interface CreateEntrySessionDto {
    ticketId: string;
    eventId: string;
    userId: string;
    reservationId: string;
  }