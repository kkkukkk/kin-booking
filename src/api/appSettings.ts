import { supabase } from '@/lib/supabaseClient';
import { AppSettings, LoginImage } from '@/types/model/appSettings';
import { CreateAppSettingsDto, UpdateAppSettingsDto, CreateLoginImageDto, UpdateLoginImageDto } from '@/types/dto/appSettings';
import { toCamelCaseKeys, toSnakeCaseKeys } from '@/util/case/case';

// 모든 설정 조회
export const fetchAllAppSettings = async (): Promise<AppSettings[]> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .order('key', { ascending: true });

  if (error) throw error;
  return toCamelCaseKeys<AppSettings[]>(data || []);
};

// 특정 키의 설정 조회
export const fetchAppSettingByKey = async (key: string): Promise<AppSettings | null> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116는 결과가 없을 때
  return data ? toCamelCaseKeys<AppSettings>(data) : null;
};

// 설정 생성
export const createAppSetting = async (setting: CreateAppSettingsDto): Promise<AppSettings> => {
  const settingSnake = toSnakeCaseKeys<CreateAppSettingsDto>(setting);
  const { data, error } = await supabase
    .from('app_settings')
    .insert(settingSnake)
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<AppSettings>(data);
};

// 설정 수정
export const updateAppSetting = async (key: string, setting: UpdateAppSettingsDto): Promise<AppSettings> => {
  const settingSnake = toSnakeCaseKeys<UpdateAppSettingsDto>(setting);
  const { data, error } = await supabase
    .from('app_settings')
    .update(settingSnake)
    .eq('key', key)
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<AppSettings>(data);
};

// 설정 삭제
export const deleteAppSetting = async (key: string): Promise<void> => {
  const { error } = await supabase
    .from('app_settings')
    .delete()
    .eq('key', key);

  if (error) throw error;
};

// 배경 이미지 설정 조회 (편의 함수)
export const fetchBackgroundImageSetting = async (): Promise<string | null> => {
  const setting = await fetchAppSettingByKey('background_image_url');
  return setting?.value || null;
};

// 배경 이미지 설정 업데이트 (편의 함수)
export const updateBackgroundImageSetting = async (imageUrl: string): Promise<AppSettings> => {
  const setting = await fetchAppSettingByKey('background_image_url');
  
  if (setting) {
    return await updateAppSetting('background_image_url', { 
      value: imageUrl,
      description: '메인 페이지 배경 이미지 URL'
    });
  } else {
    return await createAppSetting({
      key: 'background_image_url',
      value: imageUrl,
      description: '메인 페이지 배경 이미지 URL'
    });
  }
};

// ===== 로그인 이미지 관리 =====

// 모든 로그인 이미지 조회
export const fetchAllLoginImages = async (): Promise<LoginImage[]> => {
  const { data, error } = await supabase
    .from('login_images')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return toCamelCaseKeys<LoginImage[]>(data || []);
};

// 활성화된 로그인 이미지만 조회
export const fetchActiveLoginImages = async (): Promise<LoginImage[]> => {
  const { data, error } = await supabase
    .from('login_images')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true });

  if (error) throw error;
  return toCamelCaseKeys<LoginImage[]>(data || []);
};

// 로그인 이미지 생성
export const createLoginImage = async (image: CreateLoginImageDto): Promise<LoginImage> => {
  const imageSnake = toSnakeCaseKeys<CreateLoginImageDto>(image);
  const { data, error } = await supabase
    .from('login_images')
    .insert(imageSnake)
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<LoginImage>(data);
};

// 로그인 이미지 수정
export const updateLoginImage = async (id: string, image: UpdateLoginImageDto): Promise<LoginImage> => {
  const imageSnake = toSnakeCaseKeys<UpdateLoginImageDto>(image);
  const { data, error } = await supabase
    .from('login_images')
    .update(imageSnake)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<LoginImage>(data);
};

// 로그인 이미지 삭제
export const deleteLoginImage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('login_images')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// 로그인 이미지 순서 변경
export const updateLoginImageOrder = async (updates: { id: string; order: number }[]): Promise<void> => {
  const { error } = await supabase
    .from('login_images')
    .upsert(
      updates.map(update => ({ id: update.id, order: update.order })),
      { onConflict: 'id' }
    );

  if (error) throw error;
}; 