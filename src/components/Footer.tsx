import React from 'react';
import Link from 'next/link';
import { YoutubeIcon, InstagramIcon } from './icon/SocialIcons';
import { Theme } from '@/types/ui/theme';

interface FooterProps {
  theme?: Theme;
}

const Footer = ({ theme = 'normal' }: FooterProps) => {
  // 테마별 색상
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
        return 'text-gray-600';
    }
  };

  return (
    <footer className={`mt-8 pt-6 border-t ${getBorderColor()}`}>
      <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-xs md:text-sm">
        {/* About & Terms 버튼 */}
        <div className="flex space-x-4 md:space-x-6">
          <Link
            href="/about"
            className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
          >
            About
          </Link>
          <span className={`${getTextColor()}`}>•</span>
          <Link
            href="/terms"
            className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
          >
            Terms
          </Link>
        </div>

        {/* 소셜 아이콘 */}
        <div className="flex gap-5 items-center justify-center">
          <a
            href="https://youtube.com/@theblack_sejong"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:opacity-70 transition-opacity ${getIconColor()}`}
            aria-label="YouTube"
          >
            <YoutubeIcon className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/kinthejoyy"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:opacity-70 transition-opacity ${getIconColor()}`}
            aria-label="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Contact & Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-1 text-start">
          <a
            href="mailto:gfjg12@naver.com"
            className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
          >
            Contact: gfjg12@naver.com
          </a>
          <a
              href="mailto:mjkim951225@gmail.com"
              className={`hover:opacity-70 transition-opacity ${getTextColor()}`}
          >
            Contact: mjkim951225@gmail.com
          </a>
          <p className={`${getTextColor()}`}>© 2025 KIN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 