import { Theme } from "@/types/ui/theme";
import React from "react";

interface FooterProps {
  theme?: Theme;
}

const Footer = ({ theme = 'normal' }: FooterProps) => {
  // 테마별 색상 클래스
  const getTextColor = () => {
    switch (theme) {
      case 'dark':
        return 'text-gray-300';
      case 'neon':
        return 'text-gray-300';
      case 'normal':
      default:
        return 'text-gray-600';
    }
  };

  const getBorderColor = () => {
    switch (theme) {
      case 'dark':
        return 'border-gray-600';
      case 'neon':
        return 'border-gray-600';
      case 'normal':
      default:
        return 'border-gray-200';
    }
  };

  const getIconColor = () => {
    switch (theme) {
      case 'dark':
        return 'text-gray-300';
      case 'neon':
        return 'text-gray-300';
      case 'normal':
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <footer className={`mt-6 pt-4 border-t ${getBorderColor()}`}>
      <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-xs md:text-sm">
        {/* 왼쪽: 링크들 */}
        <div className="flex flex-wrap justify-center md:justify-start space-x-4 md:space-x-6">
          <a 
            href="#" 
            className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
          >
            이용약관
          </a>
          <a 
            href="#" 
            className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
          >
            개인정보처리방침
          </a>
          <a 
            href="#" 
            className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
          >
            고객센터
          </a>
          <a 
            href="#" 
            className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
          >
            문의하기
          </a>
        </div>

        {/* 중앙: 소셜 링크 */}
        <div className="flex space-x-3">
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`hover:opacity-70 transition-opacity ${getIconColor()}`}
            aria-label="YouTube"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`hover:opacity-70 transition-opacity ${getIconColor()}`}
            aria-label="Instagram"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>

        {/* 오른쪽: 저작권 */}
        <div className={`text-center md:text-right ${getTextColor()}`}>
          © 2024 Kin Booking
        </div>
      </div>
    </footer>
  );
};

export default Footer; 