import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getStorageImageUrl(bucket: string, filePath: string) {
	//테스트
	bucket = 'kin';
	filePath = 'images/background.jpg';

	const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
	return data.publicUrl;
}

