// 랜덤 RGB 색상 생성기
const randomColor = (): string => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`
  }
  
  // 랜덤 방향 또는 위치 선택
  const randomAngle = (): string => `${Math.floor(Math.random() * 360)}deg`
  const randomPosition = (): string => {
    const positions = ['center', 'top left', 'top right', 'bottom left', 'bottom right']
    return positions[Math.floor(Math.random() * positions.length)]
  }
  
  // 랜덤 그라데이션 생성기
  export const generateRandomGradient = (): string => {
    const type = Math.random() > 0.5 ? 'linear-gradient' : 'radial-gradient'
  
    const color1 = randomColor()
    const color2 = randomColor()
    const color3 = randomColor()
  
    if (type === 'linear-gradient') {
      return `linear-gradient(${randomAngle()}, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
    } else {
      return `radial-gradient(circle at ${randomPosition()}, ${color1} 0%, ${color2} 60%, ${color3} 100%)`
    }
  }
  
  // 특정 색상 조합으로 그라데이션 생성
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
  
  // 미리보기용 샘플 그라데이션 n개 생성
  export const generateGradientSamples = (count: number = 6): string[] => {
    const samples: string[] = []
    for (let i = 0; i < count; i++) {
      samples.push(generateRandomGradient())
    }
    return samples
  }
  
  // 유효한 CSS 그라데이션인지 검사
  export const isValidGradient = (gradient: string): boolean => {
    try {
      const el = document.createElement('div')
      el.style.background = gradient
      return el.style.background !== ''
    } catch {
      return false
    }
  }
  
  // fallback용 단일 색상 추출 (첫 번째 색상)
  export const gradientToColor = (gradient: string): string => {
    const colorMatch = gradient.match(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/)
    return colorMatch ? colorMatch[0] : 'rgb(59, 130, 246)' // 기본 fallback 파란색
  }