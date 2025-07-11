import React from 'react';
import { generateRandomGradient } from '@/util/adminGradientGenerator';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  gradient?: string; // 커스텀 그라데이션 (선택사항)
  className?: string;
}

const UserAvatar = ({ name, size = 'md', gradient, className = '' }: UserAvatarProps) => {
  // 크기별 클래스
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
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
  
  // 그라데이션 결정: 커스텀 > 일관된 랜덤
  const avatarGradient = gradient || getConsistentGradient(name);
  
  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-semibold ${sizeClasses[size]} ${className}`}
      style={{ background: avatarGradient }}
    >
      {name.charAt(0)}
    </div>
  );
};

export default UserAvatar; 