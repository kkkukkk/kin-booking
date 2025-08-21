import { supabase } from '@/lib/supabaseClient';
import { EntrySessionDto, EntrySessionWithDetailsDto } from '@/types/model/entry';
import { toCamelCaseKeys } from '@/util/case/case';

// 입장 세션 처리
export const processEntrySession = async (params: {
  eventId: string;
  userId: string;
  reservationId: string;
}) => {
  try {
    const { data, error } = await supabase.rpc('process_entry_session', {
      p_event_id: params.eventId,
      p_user_id: params.userId,
      p_reservation_id: params.reservationId
    });

    if (error) {
      throw error;
    }

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

// 입장 세션 조회
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