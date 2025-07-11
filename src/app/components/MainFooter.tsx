import React from "react";

const MainFooter = () => {
  return (
    <footer className="py-8 px-6 text-center bg-transparent animate-fade-in-delayed">
      <div className="max-w-4xl mx-auto">
        <div className="text-sm text-white/80 mb-4">
          <p className="mb-2">© 2024 KIN. All rights reserved.</p>
          <p className="text-xs">대학 동아리에서 시작된 음악의 꿈</p>
        </div>
        <div className="flex justify-center items-center space-x-6 text-xs text-white/60">
          <span>Contact</span>
          <span>•</span>
          <span>About</span>
          <span>•</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter; 