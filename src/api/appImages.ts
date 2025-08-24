import { supabase } from '@/lib/supabaseClient';
import { toCamelCaseKeys, toSnakeCaseKeys } from '@/util/case/case';
import { AppImage } from '@/types/model/appImages';
import { CreateAppImageDto, UpdateAppImageDto } from '@/types/dto/appImages';

// ===== 기본 CRUD 함수 =====

// 모든 이미지 조회
export const fetchAllImages = async (): Promise<AppImage[]> => {
  const { data, error } = await supabase
    .from('app_images')
    .select('*')
    .order('type', { ascending: true })
    .order('order', { ascending: true });

  if (error) throw error;
  return toCamelCaseKeys<AppImage[]>(data || []);
};

// 타입별 이미지 조회
export const fetchImagesByType = async (type: string): Promise<AppImage[]> => {
  const { data, error } = await supabase
    .from('app_images')
    .select('*')
    .eq('type', type)
    .order('order', { ascending: true });

  if (error) throw error;
  return toCamelCaseKeys<AppImage[]>(data || []);
};

// 활성화된 이미지만 조회
export const fetchActiveImages = async (type?: string): Promise<AppImage[]> => {
  let query = supabase
    .from('app_images')
    .select('*')
    .eq('is_active', true)
    .order('type', { ascending: true })
    .order('order', { ascending: true });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return toCamelCaseKeys<AppImage[]>(data || []);
};

// 이미지 생성
export const createImage = async (image: CreateAppImageDto): Promise<AppImage> => {
  const imageSnake = toSnakeCaseKeys<CreateAppImageDto>(image);
  const { data, error } = await supabase
    .from('app_images')
    .insert(imageSnake)
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<AppImage>(data);
};

// 이미지 수정
export const updateImage = async (id: string, image: UpdateAppImageDto): Promise<AppImage> => {
  const imageSnake = toSnakeCaseKeys<UpdateAppImageDto>(image);
  const { data, error } = await supabase
    .from('app_images')
    .update(imageSnake)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<AppImage>(data);
};

// 이미지 삭제 (DB + Storage)
export const deleteImage = async (id: string): Promise<void> => {
  // 1. 먼저 이미지 정보 조회하여 URL 확인
  const { data: imageData, error: fetchError } = await supabase
    .from('app_images')
    .select('url')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  // 2. Storage에서 파일 삭제 (Supabase Storage URL인 경우에만)
  if (imageData?.url?.includes('supabase.co/storage/v1/object/public/kin/')) {
    try {
      // URL에서 파일 경로 추출 (예: images/background.jpg, login-slide/slide_1.jpg)
      const filePath = imageData.url.replace(/^.*\/kin\//, '');
      const { error: storageError } = await supabase.storage
        .from('kin')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage 파일 삭제 에러:', storageError.message);
        // Storage 삭제 실패해도 DB 삭제는 진행
      }
    } catch (error) {
      console.error('Storage 파일 삭제 중 예외 발생:', error);
      // Storage 삭제 실패해도 DB 삭제는 진행
    }
  }

  // 3. DB에서 레코드 삭제
  const { error } = await supabase
    .from('app_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// 이미지 순서 변경
export const updateImageOrder = async (updates: { id: string; order: number }[]): Promise<void> => {
  const { error } = await supabase
    .from('app_images')
    .upsert(
      updates.map(update => ({ id: update.id, order: update.order })),
      { onConflict: 'id' }
    );

  if (error) throw error;
};

// ===== 편의 함수 =====

// 배경 이미지 조회
export const fetchBackgroundImage = async (): Promise<string | null> => {
  const images = await fetchImagesByType('background');
  return images[0]?.url || null;
};

// 배경 이미지 업데이트
export const updateBackgroundImage = async (imageUrl: string): Promise<AppImage> => {
  const images = await fetchImagesByType('background');
  
  if (images.length > 0) {
    return await updateImage(images[0].id, { 
      url: imageUrl,
      description: '메인 페이지 배경 이미지'
    });
  } else {
    return await createImage({
      type: 'background',
      url: imageUrl,
      description: '메인 페이지 배경 이미지'
    });
  }
};

// 로그인 슬라이드 이미지 조회
export const fetchLoginSlideImages = async (): Promise<AppImage[]> => {
  return await fetchImagesByType('login_slide');
};

// 활성화된 로그인 슬라이드 이미지 조회
export const fetchActiveLoginSlideImages = async (): Promise<AppImage[]> => {
  return await fetchActiveImages('login_slide');
};

// ===== 파일 업로드 함수 =====
export const uploadImageToStorage = async (file: File, type: 'background' | 'login_slide' | 'banner'): Promise<string> => {
  try {
    // 파일명 생성 (중복 방지)
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `${type}/${fileName}`;
    
    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('kin')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // 업로드된 파일의 공개 URL 반환
    const { data: urlData } = supabase.storage
      .from('kin')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
}; 