import { generateRandomGradient } from '@/util/adminGradientGenerator';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'sm md:md' | 'md md:lg'; // 반응형 크기 지원
  gradient?: string; // 커스텀 그라데이션 (선택사항)
  className?: string;
}

const UserAvatar = ({ name, size = 'md', gradient, className = '' }: UserAvatarProps) => {
  // 크기별 클래스 (반응형 지원)
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'w-10 h-10 text-sm';
      case 'md': return 'w-12 h-12 text-base';
      case 'lg': return 'w-16 h-16 text-base';
      case 'sm md:md': return 'w-10 h-10 md:w-12 md:h-12 text-sm md:text-base';
      case 'md md:lg': return 'w-12 h-12 md:w-16 md:h-16 text-base';
      default: return 'w-10 h-10 md:w-12 md:h-12 text-sm md:text-base';
    }
  };
  
  // 이름 기반으로 일관된 그라데이션 생성 (같은 이름은 같은 그라데이션)
  const getConsistentGradient = (name: string): string => {
    // 이름의 각 문자를 숫자로 변환하여 시드 생성
    let seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const originalRandom = Math.random;
    
    // 시드 기반 랜덤 함수
    Math.random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    
    const result = generateRandomGradient();
    Math.random = originalRandom;
    return result;
  };
  
  // 성을 제외한 이름(첫 글자 제외) 추출, 최대 2자까지
  const getNameWithoutSurname = (name: string): string => {
    if (!name || name.length < 2) return '';
    return name.slice(1, 3);
  };

  const avatarGradient = gradient || getConsistentGradient(name);

  const displayChars = getNameWithoutSurname(name) || name.charAt(0);
  
  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getSizeClasses(size)} ${className}`}
      style={{ background: avatarGradient }}
    >
      {displayChars}
    </div>
  );
};

export default UserAvatar; 