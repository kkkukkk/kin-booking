import { supabase } from "@/lib/supabaseClient";
import { EventMedia } from "@/types/model/eventMedia";
import { toCamelCaseKeys } from "@/util/case/case";

// 공연별 미디어 조회
export const fetchEventMedia = async (eventId: string): Promise<EventMedia[]> => {
	const { data, error } = await supabase
		.from('event_media')
		.select('*')
		.eq('event_id', eventId)
		.eq('is_active', true)
		.order('uploaded_at', { ascending: false });

	if (error) throw error;

    console.log(data);

	return toCamelCaseKeys<EventMedia[]>(data ?? []);
};

// 공연별 특정 타입 미디어 조회
export const fetchEventMediaByType = async (eventId: string, mediaType: string): Promise<EventMedia[]> => {
	const { data, error } = await supabase
		.from('event_media')
		.select('*')
		.eq('event_id', eventId)
		.eq('media_type', mediaType)
		.eq('is_active', true)
		.order('uploaded_at', { ascending: false });

	if (error) throw error;

	return toCamelCaseKeys<EventMedia[]>(data ?? []);
}; 