// 티켓용 그라데이션 색상 팔레트
const GRADIENT_COLORS = [
  // 따뜻한 색상
  ['#ff6b6b', '#ee5a52', '#ff5252'], // 빨간색 계열
  ['#ffa726', '#ff9800', '#ff8f00'], // 주황색 계열
  ['#ffeb3b', '#fdd835', '#f9a825'], // 노란색 계열
  
  // 차가운 색상
  ['#4fc3f7', '#29b6f6', '#0288d1'], // 파란색 계열
  ['#66bb6a', '#4caf50', '#388e3c'], // 초록색 계열
  ['#ab47bc', '#9c27b0', '#7b1fa2'], // 보라색 계열
  
  // 중성 색상
  ['#26a69a', '#00897b', '#00695c'], // 청록색 계열
  ['#ff7043', '#ff5722', '#d84315'], // 주황빨간색 계열
  ['#8d6e63', '#6d4c41', '#4e342e'], // 갈색 계열
];

// 그라데이션 패턴 정의
const GRADIENT_PATTERNS = [
  'linear-gradient(135deg, {color1} 0%, {color2} 50%, {color3} 100%)',
  'linear-gradient(45deg, {color1} 0%, {color2} 30%, {color3} 70%, {color1} 100%)',
  'linear-gradient(90deg, {color1} 0%, {color2} 25%, {color3} 75%, {color1} 100%)',
  'linear-gradient(180deg, {color1} 0%, {color2} 50%, {color3} 100%)',
  'radial-gradient(circle at top left, {color1} 0%, {color2} 50%, {color3} 100%)',
  'radial-gradient(circle at center, {color1} 0%, {color2} 70%, {color3} 100%)',
];

// 랜덤 색상 조합 생성
export const generateRandomGradient = (seed?: string): string => {
  // seed가 있으면 결정적 랜덤, 없으면 진짜 랜덤
  const random = seed ? 
    (() => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32bit 정수로 변환
      }
      return () => {
        hash = (hash * 9301 + 49297) % 233280;
        return hash / 233280;
      };
    })() : 
    () => Math.random();

  // 색상 팔레트에서 랜덤 선택
  const colorSet = GRADIENT_COLORS[Math.floor(random() * GRADIENT_COLORS.length)];
  const [color1, color2, color3] = colorSet;
  
  // 그라데이션 패턴에서 랜덤 선택
  const pattern = GRADIENT_PATTERNS[Math.floor(random() * GRADIENT_PATTERNS.length)];
  
  // 패턴에 색상 적용
  return pattern
    .replace('{color1}', color1)
    .replace('{color2}', color2)
    .replace('{color3}', color3);
};

// 이벤트 ID 기반 결정적 그라데이션 생성
export const generateEventGradient = (eventId: string): string => {
  return generateRandomGradient(eventId);
};

// 티켓 ID 기반 결정적 그라데이션 생성
export const generateTicketGradient = (ticketId: string): string => {
  return generateRandomGradient(ticketId);
};

// 색상 팔레트 내보내기 (다른 곳에서 사용할 수 있도록)
export { GRADIENT_COLORS, GRADIENT_PATTERNS }; 