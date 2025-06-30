import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTicket,
  getTicketsByReservationId,
  getTicketsByOwnerId,
  getTicketsByEventId,
  getTicketById,
  updateTicket,
  transferTicket,
  transferMultipleTickets,
  deleteTicket,
  deleteTicketsByReservationId,
} from '@/api/ticket';
import { CreateTicketRequest, UpdateTicketRequest, TransferTicketRequest } from '@/types/model/ticket';

// 예약 ID로 티켓 조회
export const useTicketsByReservationId = (reservationId: string) => {
  return useQuery({
    queryKey: ['tickets', 'reservation', reservationId],
    queryFn: () => getTicketsByReservationId(reservationId),
    enabled: !!reservationId,
  });
};

// 사용자 ID로 티켓 조회
export const useTicketsByOwnerId = (ownerId: string) => {
  return useQuery({
    queryKey: ['tickets', 'owner', ownerId],
    queryFn: () => getTicketsByOwnerId(ownerId),
    enabled: !!ownerId,
  });
};

// 이벤트 ID로 티켓 조회
export const useTicketsByEventId = (eventId: string) => {
  return useQuery({
    queryKey: ['tickets', 'event', eventId],
    queryFn: () => getTicketsByEventId(eventId),
    enabled: !!eventId,
  });
};

// 티켓 ID로 티켓 조회
export const useTicketById = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: !!ticketId,
  });
};

// 티켓 생성
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticketData: CreateTicketRequest) => createTicket(ticketData),
    onSuccess: (data) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', data.reservationId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'owner', data.ownerId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'event', data.eventId] });
    },
  });
};

// 티켓 업데이트
export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, updateData }: { ticketId: string; updateData: UpdateTicketRequest }) =>
      updateTicket(ticketId, updateData),
    onSuccess: (data) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['ticket', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', data.reservationId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'owner', data.ownerId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'event', data.eventId] });
    },
  });
};

// 티켓 양도
export const useTransferTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, transferData }: { ticketId: string; transferData: TransferTicketRequest }) =>
      transferTicket(ticketId, transferData),
    onSuccess: (data) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['ticket', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', data.reservationId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'owner', data.ownerId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'event', data.eventId] });
    },
  });
};

// 여러 티켓 동시 양도
export const useTransferMultipleTickets = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketIds, transferData }: { ticketIds: string[]; transferData: TransferTicketRequest }) =>
      transferMultipleTickets(ticketIds, transferData),
    onSuccess: (data) => {
      // 관련 쿼리들 무효화
      data.forEach(ticket => {
        queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] });
        queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', ticket.reservationId] });
        queryClient.invalidateQueries({ queryKey: ['tickets', 'owner', ticket.ownerId] });
        queryClient.invalidateQueries({ queryKey: ['tickets', 'event', ticket.eventId] });
      });
    },
  });
};

// 티켓 삭제
export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: (_, ticketId) => {
      // 티켓 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.removeQueries({ queryKey: ['ticket', ticketId] });
    },
  });
};

// 예약 ID로 모든 티켓 삭제
export const useDeleteTicketsByReservationId = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTicketsByReservationId,
    onSuccess: (_, reservationId) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', reservationId] });
    },
  });
}; 