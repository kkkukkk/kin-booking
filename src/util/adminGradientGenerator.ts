// ----------------------------
// 🎨 HSL 기반 밝고 생기있는 랜덤 색상
const getVividColor = (): string => {
  const h = Math.floor(Math.random() * 360)            // 0~359 hue
  const s = 60 + Math.floor(Math.random() * 30)         // 60~90% saturation
  const l = 55 + Math.floor(Math.random() * 25)         // 55~80% lightness
  return `hsl(${h}, ${s}%, ${l}%)`
}

// ----------------------------
// 🔀 각도, 위치, 방향 랜덤
const randomAngle = (): string => `${Math.floor(Math.random() * 360)}deg`

const randomPosition = (): string => {
  const positions = ['center', 'top left', 'top right', 'bottom left', 'bottom right']
  return positions[Math.floor(Math.random() * positions.length)]
}

const randomDirection = (): string => {
  const directions = ['to right', 'to left', 'to top', 'to bottom', 'to top left', 'to bottom right']
  return directions[Math.floor(Math.random() * directions.length)]
}

// ----------------------------
// ⬛ 줄무늬 그라데이션 (black 제거)
const generateStripeGradient = (): string => {
  const stripeCount = Math.floor(Math.random() * 4) + 1 // 1~5 stripes
  const direction = randomDirection()

  const stops: string[] = []
  let currentPos = 0

  for (let i = 0; i < stripeCount; i++) {
    const gap = Math.floor(Math.random() * 10) + 5       // 5~14%
    const width = Math.floor(Math.random() * 4) + 1      // 1~4%
    const baseColor = getVividColor()
    const stripeColor = getVividColor()

    stops.push(`${baseColor} ${currentPos}%`)
    stops.push(`${stripeColor} ${currentPos + 0.2}%`)
    stops.push(`${stripeColor} ${currentPos + width}%`)
    stops.push(`${baseColor} ${currentPos + width + 0.2}%`)

    currentPos += width + gap
  }

  return `linear-gradient(${direction}, ${stops.join(', ')})`
}

// ----------------------------
// 🌈 메인 그라데이션 생성기
export const generateRandomGradient = (): string => {
  const types = ['linear', 'radial', 'stripe'] as const
  const type = types[Math.floor(Math.random() * types.length)]

  const color1 = getVividColor()
  const color2 = getVividColor()
  const color3 = getVividColor()

  if (type === 'linear') {
    return `linear-gradient(${randomAngle()}, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
  } else if (type === 'radial') {
    return `radial-gradient(circle at ${randomPosition()}, ${color1} 0%, ${color2} 60%, ${color3} 100%)`
  } else {
    return generateStripeGradient()
  }
}

// ----------------------------
// 🎨 지정 색상 조합으로 그라데이션
export const generateGradientFromColors = (
  color1: string,
  color2: string,
  color3: string,
  type: 'linear' | 'radial' = 'linear'
): string => {
  if (type === 'linear') {
    return `linear-gradient(${randomAngle()}, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
  } else {
    return `radial-gradient(circle at ${randomPosition()}, ${color1} 0%, ${color2} 60%, ${color3} 100%)`
  }
}

// ----------------------------
// 🔍 샘플 n개 생성
export const generateGradientSamples = (count: number = 6): string[] => {
  const samples: string[] = []
  for (let i = 0; i < count; i++) {
    samples.push(generateRandomGradient())
  }
  return samples
}

// ----------------------------
// ✅ 유효 CSS인지 검사
export const isValidGradient = (gradient: string): boolean => {
  try {
    const el = document.createElement('div')
    el.style.background = gradient
    return el.style.background !== ''
  } catch {
    return false
  }
}

// ----------------------------
// 🎯 fallback용 첫 번째 색상 추출
export const gradientToColor = (gradient: string): string => {
  const match = gradient.match(/hsl\(\d{1,3},\s?\d{1,3}%,\s?\d{1,3}%\)/)
  return match ? match[0] : 'hsl(220, 90%, 60%)'
}