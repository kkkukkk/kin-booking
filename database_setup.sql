-- 앱 설정 테이블 생성
CREATE TABLE IF NOT EXISTS app_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 배경 이미지 설정 추가
INSERT INTO app_settings (key, value, description) VALUES 
  ('background_image_url', 'https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/images/background.jpg', '메인 페이지 배경 이미지 URL')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- RLS 정책 설정 (관리자만 접근 가능)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 관리자만 읽기/쓰기 가능하도록 정책 설정
CREATE POLICY "관리자는 모든 설정에 접근 가능" ON app_settings
  FOR ALL USING (
    user_has_role(ARRAY['MASTER'::text, 'MANAGER'::text, 'MEMBER'::text])
  );

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);
CREATE INDEX IF NOT EXISTS idx_app_settings_updated_at ON app_settings(updated_at);

-- 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===== 로그인 이미지 테이블 =====

-- 로그인 이미지 테이블 생성
CREATE TABLE IF NOT EXISTS login_images (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정 (관리자만 접근 가능)
ALTER TABLE login_images ENABLE ROW LEVEL SECURITY;

-- 관리자만 읽기/쓰기 가능하도록 정책 설정
CREATE POLICY "관리자는 모든 로그인 이미지에 접근 가능" ON login_images
  FOR ALL USING (
    user_has_role(ARRAY['MASTER'::text, 'MANAGER'::text, 'MEMBER'::text])
  );

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_login_images_order ON login_images("order");
CREATE INDEX IF NOT EXISTS idx_login_images_active ON login_images(is_active);
CREATE INDEX IF NOT EXISTS idx_login_images_updated_at ON login_images(updated_at);

-- 업데이트 트리거 생성
CREATE TRIGGER update_login_images_updated_at
  BEFORE UPDATE ON login_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 기본 로그인 이미지 추가 (기존 Supabase Storage 이미지들)
INSERT INTO login_images (url, "order", is_active) VALUES 
  ('https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/login-slide/slide_1.jpg', 0, true),
  ('https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/login-slide/slide_2.jpg', 1, true),
  ('https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/login-slide/slide_3.jpg', 2, true)
ON CONFLICT DO NOTHING; 