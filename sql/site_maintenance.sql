-- 사이트 점검 모드 (DB 기반)
-- Supabase SQL Editor에서 실행하세요.

-- 1) app_settings에 점검 모드 키 추가 (key UNIQUE가 있다면 ON CONFLICT 사용)
INSERT INTO app_settings (key, value, description)
VALUES (
  'site_maintenance',
  'false',
  '사이트 점검 모드. true면 일반 사용자는 /maintenance로 이동합니다.'
)
ON CONFLICT (key) DO UPDATE
SET
  description = EXCLUDED.description;

-- key에 UNIQUE 제약이 없다면 위 INSERT가 실패할 수 있습니다.
-- 그 경우 아래만 실행하세요.
-- INSERT INTO app_settings (key, value, description)
-- VALUES ('site_maintenance', 'false', '사이트 점검 모드. true/false');

-- 2) middleware(anon)에서 읽기 위한 RPC
CREATE OR REPLACE FUNCTION public.get_site_maintenance_mode()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT value = 'true'
      FROM public.app_settings
      WHERE key = 'site_maintenance'
      LIMIT 1
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.get_site_maintenance_mode() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_site_maintenance_mode() TO anon, authenticated;

-- 3) 점검 켜기/끄기 예시
-- UPDATE app_settings SET value = 'true'  WHERE key = 'site_maintenance';
-- UPDATE app_settings SET value = 'false' WHERE key = 'site_maintenance';
