// 네온 색상 변형 타입
export type NeonVariant = 'green' | 'cyan' | 'magenta' | 'pink' | 'blue' | 'yellow' | 'purple';

// 네온 색상 상수 (타입 안전성을 위한 const assertion)
export const NEON_VARIANTS = {
  GREEN: 'green',
  CYAN: 'cyan',
  MAGENTA: 'magenta',
  PINK: 'pink',
  BLUE: 'blue',
  YELLOW: 'yellow',
  PURPLE: 'purple'
} as const;

// 기본값
export const DEFAULT_NEON_VARIANT: NeonVariant = 'green';

// 타입 가드 함수
export const isValidNeonVariant = (value: string): value is NeonVariant => {
  return Object.values(NEON_VARIANTS).includes(value as NeonVariant);
}; 