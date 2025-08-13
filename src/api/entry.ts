import { supabase } from '@/lib/supabaseClient';
import { EntrySessionDto, EntrySessionWithDetailsDto } from '@/types/model/entry';
import { toCamelCaseKeys } from '@/util/case/case';

// 입장 세션 처리 RPC 함수
export const processEntrySession = async (params: {
  eventId: string;
  userId: string;
  reservationId: string;
}) => {
  try {
    console.log('processEntrySession RPC 호출 시작:', params);
    
    // RPC 함수 호출
    const { data, error } = await supabase.rpc('process_entry_session', {
      p_event_id: params.eventId,
      p_user_id: params.userId,
      p_reservation_id: params.reservationId
    });

    if (error) {
      console.error('RPC 함수 호출 실패:', error);
      throw error;
    }

    console.log('RPC 함수 호출 성공:', data);
    
    // RPC 결과를 EntrySessionDto 형태로 변환
    const sessionData = toCamelCaseKeys<EntrySessionDto>(data.session_data);
    
    return {
      action: data.action,
      message: data.message,
      session: sessionData
    };  

  } catch (error) {
    console.error('입장 세션 처리 실패:', error);
    throw error;
  }
};

// 입장 세션 조회 함수
export const getEntrySession = async (sessionId: string): Promise<EntrySessionWithDetailsDto> => {
  const { data, error } = await supabase
    .from('entry_sessions')
    .select(`
      *,
      events:event_id (
        event_name,
        event_date
      ),
      users:user_id (
        name
      ),
      reservations:reservation_id (
        quantity,
        ticket_holder
      )
    `)
    .eq('id', sessionId)
    .single();

  if (error) throw error;
  
  // snake_case를 camelCase로 변환
  const camelCaseData = toCamelCaseKeys<EntrySessionWithDetailsDto>(data);
  
  return camelCaseData;
};

// 입장 세션 상태 업데이트
export const updateEntrySessionStatus = async (sessionId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('entry_sessions')
    .update({ status })
    .eq('id', sessionId);

  if (error) throw error;
};