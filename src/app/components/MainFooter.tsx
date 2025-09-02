import Link from 'next/link';
import { YoutubeIcon, InstagramIcon } from '@/components/icon/SocialIcons';

const MainFooter = () => {
  return (
    <footer className="w-full mt-6 pt-4 flex justify-center bg-transparent animate-fade-in-delayed">
      <div className="md:w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-xs md:text-sm mb-6 md:justify-between">
        {/* About & Terms 버튼 */}
        <div className="flex space-x-4 md:space-x-6">
          <Link href="/about" className="text-white/60 hover:opacity-70 transition-opacity">
            About
          </Link>
          <span className="text-white/60">•</span>
          <Link href="/terms" className="text-white/60 hover:opacity-70 transition-opacity">
            Terms
          </Link>
        </div>

        {/* 소셜 아이콘 */}
        <div className="flex gap-5 items-center justify-center md:gap-10">
          <a
            href="https://youtube.com/@theblack_sejong"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity text-white/60"
            aria-label="YouTube"
          >
            <YoutubeIcon className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/kinthejoyy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity text-white/60"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Contact & Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-1">
          <a
            href="mailto:gfjg12@naver.com"
            className="text-white/60 hover:opacity-70 transition-opacity"
          >
            Contact: gfjg12@naver.com
          </a>
          <a
              href="mailto:mjkim951225@gmail.com"
              className="text-white/60 hover:opacity-70 transition-opacity"
          >
            Contact: mjkim951225@gmail.com
          </a>
          <p className="text-white/60">© 2025 KIN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter; 