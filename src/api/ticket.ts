import { supabase } from '@/lib/supabaseClient';
import { Ticket, CreateTicketRequest, UpdateTicketRequest } from '@/types/model/ticket';
import { TicketWithEventDto } from '@/types/dto/ticket';
import { toCamelCaseKeys } from '@/util/case/case';

// 티켓 생성
export const createTicket = async (ticketData: CreateTicketRequest): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('ticket')
    .insert([ticketData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 예약 ID로 티켓 조회
export const getTicketsByReservationId = async (reservationId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('reservation_id', reservationId)
    .in('status', ['active', 'cancelled', 'used', 'transferred']);

  if (error) throw error;
  return data;
};

// 사용자 ID로 티켓 조회
export const getTicketsByOwnerId = async (ownerId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('owner_id', ownerId)
    .in('status', ['active', 'cancelled', 'used', 'transferred'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 공연별(이벤트별) 전체 티켓 취소 (DB 통신만)
export const cancelAllTicketsByEvent = async (eventId: string, userId: string): Promise<{ updated: number }> => {
  const { data: tickets, error } = await supabase
    .from('ticket')
    .select('id')
    .eq('event_id', eventId)
    .eq('owner_id', userId)
    .eq('status', 'active');

  if (error) throw error;
  if (!tickets || tickets.length === 0) return { updated: 0 };

  const activeTicketIds = tickets.map((t: any) => t.id);
  if (activeTicketIds.length === 0) return { updated: 0 };

  const { error: updateError } = await supabase
    .from('ticket')
    .update({ status: 'cancel_requested' })
    .in('id', activeTicketIds)
    .select();

  if (updateError) throw updateError;
  return { updated: activeTicketIds.length };
};

// 이벤트 ID로 티켓 조회
export const getTicketsByEventId = async (eventId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('event_id', eventId)
    .in('status', ['active', 'cancelled', 'used', 'transferred']);

  if (error) throw error;
  return data;
};

// 티켓 ID로 티켓 조회
export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('id', ticketId)
    .single();

  if (error) throw error;
  return data;
};

// 티켓 상태 업데이트
export const updateTicket = async (ticketId: string, updateData: UpdateTicketRequest): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('ticket')
    .update(updateData)
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 티켓 삭제 (예약 취소 시)
export const deleteTicket = async (ticketId: string): Promise<void> => {
  const { error } = await supabase
    .from('ticket')
    .delete()
    .eq('id', ticketId);

  if (error) throw error;
};

// 예약 ID로 모든 티켓 삭제
export const deleteTicketsByReservationId = async (reservationId: string): Promise<void> => {
  const { error } = await supabase
    .from('ticket')
    .delete()
    .eq('reservation_id', reservationId);

  if (error) throw error;
};

// 티켓 취소 신청 (DB 통신만)
export const requestCancelTicket = async (ticketId: string, userId: string): Promise<{ updated: boolean }> => {
  const { error } = await supabase
    .from('ticket')
    .update({ status: 'cancel_requested' })
    .eq('id', ticketId)
    .eq('owner_id', userId);
  if (error) throw error;
  return { updated: true };
};

export const getTicketsWithEventByOwnerId = async (ownerId: string): Promise<TicketWithEventDto[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select(`*, event:event_id(*)`)
    .eq('owner_id', ownerId)
    .in('status', ['active', 'cancelled', 'used', 'transferred'])
    .order('created_at', { ascending: false });

  if (error) throw error;

  return toCamelCaseKeys<TicketWithEventDto[]>(data ?? []);
}; 