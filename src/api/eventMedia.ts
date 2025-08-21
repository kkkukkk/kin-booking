import { supabase } from "@/lib/supabaseClient";
import { EventMedia } from "@/types/model/eventMedia";
import { toCamelCaseKeys, toSnakeCaseKeys } from "@/util/case/case";
import dayjs from "dayjs";

// 공연별 미디어 조회
export const fetchEventMedia = async (eventId: string): Promise<EventMedia[]> => {
	const { data, error } = await supabase
		.from('event_media')
		.select('*')
		.eq('event_id', eventId)
		.eq('is_active', true)
		.order('uploaded_at', { ascending: false });

	if (error) throw error;

	return toCamelCaseKeys<EventMedia[]>(data ?? []);
};

// 공연별 특정 타입 미디어 조회
export const fetchEventMediaByType = async (eventId: string, mediaType: string): Promise<EventMedia[]> => {
    try {
        const { data, error } = await supabase
            .from('event_media')
            .select('*')
            .eq('event_id', eventId)
            .eq('media_type', mediaType)
            .eq('is_active', true)
            .order('version', { ascending: false });

        if (error) throw error;
        
        return toCamelCaseKeys<EventMedia[]>(data || []);
    } catch (error) {
        console.error('fetchEventMediaByType 에러:', error);
        throw error;
    }
};

// 이미지 업로드 및 미디어 등록
export const uploadEventImage = async (
	eventId: string, 
	file: File, 
	mediaType: string = 'image'
): Promise<EventMedia> => {
	// 1. Supabase Storage에 파일 업로드
	const fileName = `${eventId}_${Date.now()}_${file.name}`;
	const filePath = `events/${eventId}/${fileName}`;
	
	const { data: uploadData, error: uploadError } = await supabase.storage
		.from('kin')
		.upload(filePath, file, {
			cacheControl: '3600',
			upsert: false
		});

	if (uploadError) throw uploadError;

	// 2. 업로드된 파일의 공개 URL 가져오기
	const { data: urlData } = supabase.storage
		.from('kin')
		.getPublicUrl(filePath);

	// 3. event_media 테이블에 레코드 생성
	const mediaData = {
		event_id: eventId,
		url: urlData.publicUrl,
		media_type: mediaType,
		is_active: true,
		uploaded_at: dayjs().toISOString()
	};

	const { data: mediaRecord, error: mediaError } = await supabase
		.from('event_media')
		.insert(toSnakeCaseKeys(mediaData))
		.select()
		.single();

	if (mediaError) throw mediaError;

	return toCamelCaseKeys<EventMedia>(mediaRecord);
};

// 공연 등록 후 포스터 업로드 (최종 경로)
export const uploadEventPoster = async (
    eventId: string,
    file: File
): Promise<EventMedia> => {
    try {
        const fileExtension = file.name.split('.').pop() || 'jpg';
        
        // 기존 포스터 확인 및 버전 결정
        const { data: existingMedia } = await supabase
            .from('event_media')
            .select('id, version, extension')
            .eq('event_id', eventId)
            .eq('media_type', 'image')
            .eq('is_active', true)
            .single();

        // 새 버전 번호 결정
        const newVersion = existingMedia ? existingMedia.version + 1 : 1;
        const filePath = `events/${eventId}/poster_v${newVersion}.${fileExtension}`;

        // 새 파일을 Storage에 업로드
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('kin')
            .upload(filePath, file, {
                cacheControl: 'no-cache, no-store, must-revalidate',
                upsert: false
            });

        if (uploadError) {
            throw new Error(`Storage 업로드 실패: ${uploadError.message}`);
        }

        // 기존 포스터를 비활성화
        if (existingMedia) {
            await supabase
                .from('event_media')
                .update({ is_active: false })
                .eq('id', existingMedia.id);
        }

        // DB에 새 포스터 레코드 생성
        const mediaData = {
            event_id: eventId,
            media_type: 'image',
            is_active: true,
            uploaded_at: dayjs().toISOString(),
            version: newVersion,
            extension: fileExtension
        };

        const { data: mediaRecord, error: insertError } = await supabase
            .from('event_media')
            .insert(toSnakeCaseKeys(mediaData))
            .select()
            .single();

        if (insertError) {
            throw new Error(`미디어 등록 실패: ${insertError.message}`);
        }

        return toCamelCaseKeys<EventMedia>(mediaRecord);
    } catch (error) {
        console.error('uploadEventPoster 에러:', error);
        throw error;
    }
};

// 미디어 삭제 (소프트 삭제)
export const deleteEventMedia = async (mediaId: number): Promise<void> => {
	const { error } = await supabase
		.from('event_media')
		.update({ is_active: false })
		.eq('id', mediaId);

	if (error) throw error;
}; 

export const deleteEventPoster = async (eventId: string): Promise<void> => {
    try {
        // 1. 기존 포스터 파일 경로 찾기
        const { data: existingMedia, error: fetchError } = await supabase
            .from('event_media')
            .select('url')
            .eq('event_id', eventId)
            .eq('media_type', 'image')
            .eq('is_active', true)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: no rows returned
            throw new Error(`기존 포스터 조회 실패: ${fetchError.message}`);
        }

        if (existingMedia) {
            // 2. Storage에서 파일 삭제
            const filePath = existingMedia.url.replace(/^.*\/kin\//, ''); // /kin/ 경로 제거
            const { error: storageError } = await supabase.storage
                .from('kin')
                .remove([filePath]);

            if (storageError) {
                console.error('Storage 삭제 에러:', storageError.message);
                throw new Error(`Storage 삭제 실패: ${storageError.message}`);
            }

            // 3. DB에서 레코드 삭제
            const { error: dbError } = await supabase
                .from('event_media')
                .delete()
                .eq('event_id', eventId)
                .eq('media_type', 'image');

            if (dbError) {
                console.error('DB 삭제 에러:', dbError.message);
                throw new Error(`DB 삭제 실패: ${dbError.message}`);
            }
        }
    } catch (error) {
        console.error('deleteEventPoster 에러:', error);
        throw error;
    }
}; 