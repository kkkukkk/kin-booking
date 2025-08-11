import { supabase } from '@/lib/supabaseClient';
import { toCamelCaseKeys, toSnakeCaseKeys } from '@/util/case/case';
import { CreateEntrySessionDto, EntrySessionDto, EntrySessionWithDetailsDto } from '@/types/model/entry';
import dayjs from 'dayjs';

// 입장 세션 생성
export const createEntrySession = async (params: {
    eventId: string;
    userId: string;
    reservationId: string;
  }): Promise<EntrySessionDto> => {
    const expiresAt = dayjs().add(1, 'hour').toISOString();
    
    const { data, error } = await supabase
      .from('entry_sessions')
      .insert({
        ...toSnakeCaseKeys<CreateEntrySessionDto>(params),
        expires_at: expiresAt,
        status: 'pending'
      })
      .select()
      .single();
  
    if (error) throw error;
    return toCamelCaseKeys<EntrySessionDto>(data);
  };

// 입장 세션 조회 (상세 정보 포함)
export const getEntrySession = async (entryId: string): Promise<EntrySessionWithDetailsDto> => {
    const { data, error } = await supabase
      .from('entry_sessions')
      .select(`
        *,
        tickets:ticket_id(id, ticket_number, status),
        events:event_id(event_name, event_date, location),
        users:user_id(name, email)
      `)
      .eq('id', entryId)
      .gte('expires_at', dayjs().toISOString()) // 현재 시간보다 큰 것만
      .eq('status', 'pending')
      .single();
  
    if (error) throw error;
    return toCamelCaseKeys<EntrySessionWithDetailsDto>(data);
  };

// 입장 처리
export const markEntryAsUsed = async (entryId: string): Promise<void> => {
    const now = dayjs().toISOString();
    
    // 1. 입장 세션 상태 업데이트
    const { error: sessionError } = await supabase
      .from('entry_sessions')
      .update({
        status: 'used',
        used_at: now
      })
      .eq('id', entryId);
  
    if (sessionError) throw sessionError;
    
    // 2. 해당 예매의 모든 활성 티켓을 used로 변경
    const { data: session } = await supabase
      .from('entry_sessions')
      .select('reservation_id, event_id, user_id')
      .eq('id', entryId)
      .single();
      
    if (session) {
      const { error: ticketError } = await supabase
        .from('ticket')
        .update({ status: 'used' })
        .eq('reservation_id', session.reservation_id)  // 예매 ID
        .eq('event_id', session.event_id)               // 이벤트 ID
        .eq('owner_id', session.user_id)                // 현재 소유자 ID
        .eq('status', 'active');                        // 활성 상태만
        
      if (ticketError) throw ticketError;
    }
};
  
// 만료된 세션 정리
export const cleanupExpiredSessions = async (): Promise<void> => {
    const { error } = await supabase
        .rpc('update_expired_sessions');
    if (error) throw error;
};