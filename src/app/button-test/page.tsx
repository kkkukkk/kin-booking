'use client';

import { useState } from 'react';

export default function ButtonTestPage() {
  const [clickedButton, setClickedButton] = useState<string>('');

  const handleButtonClick = (buttonName: string) => {
    setClickedButton(buttonName);
    setTimeout(() => setClickedButton(''), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🎨 버튼 디자인 테스트</h1>
        
        {clickedButton && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-700">클릭된 버튼: <strong>{clickedButton}</strong></p>
          </div>
        )}

        {/* 그라데이션 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🌈 그라데이션 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('그라데이션 - 초록')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-lg font-medium transition-all"
            >
              입장하기
            </button>
            <button
              onClick={() => handleButtonClick('그라데이션 - 파랑')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-lg font-medium transition-all"
            >
              양도하기
            </button>
            <button
              onClick={() => handleButtonClick('그라데이션 - 보라')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-lg font-medium transition-all"
            >
              구매하기
            </button>
          </div>
        </section>

        {/* 아웃라인 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">📝 아웃라인 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('아웃라인 - 파랑')}
              className="px-6 py-3 bg-transparent border-2 border-blue-400 text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-all hover:scale-105"
            >
              양도하기
            </button>
            <button
              onClick={() => handleButtonClick('아웃라인 - 초록')}
              className="px-6 py-3 bg-transparent border-2 border-green-400 text-green-700 hover:bg-green-50 font-medium rounded-lg transition-all hover:scale-105"
            >
              확인하기
            </button>
            <button
              onClick={() => handleButtonClick('아웃라인 - 빨강')}
              className="px-6 py-3 bg-transparent border-2 border-red-400 text-red-700 hover:bg-red-50 font-medium rounded-lg transition-all hover:scale-105"
            >
              취소하기
            </button>
          </div>
        </section>

        {/* 소프트 섀도우 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">☁️ 소프트 섀도우 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('소프트 섀도우 - 빨강')}
              className="px-6 py-3 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-red-600 font-medium rounded-lg transition-all hover:scale-105"
            >
              취소 신청
            </button>
            <button
              onClick={() => handleButtonClick('소프트 섀도우 - 파랑')}
              className="px-6 py-3 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-blue-600 font-medium rounded-lg transition-all hover:scale-105"
            >
              상세보기
            </button>
            <button
              onClick={() => handleButtonClick('소프트 섀도우 - 초록')}
              className="px-6 py-3 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-green-600 font-medium rounded-lg transition-all hover:scale-105"
            >
              저장하기
            </button>
          </div>
        </section>

        {/* 글래스모피즘 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">💎 글래스모피즘 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('글래스모피즘 - 블루')}
              className="px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:bg-white/30 font-medium rounded-lg transition-all hover:scale-105"
            >
              로그인
            </button>
            <button
              onClick={() => handleButtonClick('글래스모피즘 - 그린')}
              className="px-6 py-3 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-700 shadow-lg hover:bg-green-500/30 font-medium rounded-lg transition-all hover:scale-105"
            >
              시작하기
            </button>
            <button
              onClick={() => handleButtonClick('글래스모피즘 - 퍼플')}
              className="px-6 py-3 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-700 shadow-lg hover:bg-purple-500/30 font-medium rounded-lg transition-all hover:scale-105"
            >
              설정하기
            </button>
          </div>
        </section>

        {/* 네온 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">✨ 네온 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('네온 - 블루')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]"
            >
              활성화
            </button>
            <button
              onClick={() => handleButtonClick('네온 - 그린')}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]"
            >
              완료
            </button>
            <button
              onClick={() => handleButtonClick('네온 - 레드')}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]"
            >
              삭제
            </button>
          </div>
        </section>

        {/* 3D 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🎲 3D 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('3D - 블루')}
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-[0_8px_0_rgb(59,130,246)] hover:shadow-[0_4px_0_rgb(59,130,246)] hover:translate-y-1 active:shadow-[0_2px_0_rgb(59,130,246)] active:translate-y-2"
            >
              눌러보세요
            </button>
            <button
              onClick={() => handleButtonClick('3D - 그린')}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-[0_8px_0_rgb(34,197,94)] hover:shadow-[0_4px_0_rgb(34,197,94)] hover:translate-y-1 active:shadow-[0_2px_0_rgb(34,197,94)] active:translate-y-2"
            >
              클릭하세요
            </button>
            <button
              onClick={() => handleButtonClick('3D - 레드')}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg transition-all hover:scale-105 shadow-[0_8px_0_rgb(239,68,68)] hover:shadow-[0_4px_0_rgb(239,68,68)] hover:translate-y-1 active:shadow-[0_2px_0_rgb(239,68,68)] active:translate-y-2"
            >
              터치하세요
            </button>
          </div>
        </section>

        {/* 실제 버튼 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🔘 실제 버튼 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('실제 버튼 - 블루')}
              className="px-6 py-3 bg-gradient-to-b from-blue-400 to-blue-600 text-white font-bold rounded-lg transition-all hover:from-blue-500 hover:to-blue-700 active:from-blue-600 active:to-blue-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.4)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]"
            >
              실제 버튼
            </button>
            <button
              onClick={() => handleButtonClick('실제 버튼 - 그린')}
              className="px-6 py-3 bg-gradient-to-b from-green-400 to-green-600 text-white font-bold rounded-lg transition-all hover:from-green-500 hover:to-green-700 active:from-green-600 active:to-green-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.4)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]"
            >
              확인 버튼
            </button>
            <button
              onClick={() => handleButtonClick('실제 버튼 - 레드')}
              className="px-6 py-3 bg-gradient-to-b from-red-400 to-red-600 text-white font-bold rounded-lg transition-all hover:from-red-500 hover:to-red-700 active:from-red-600 active:to-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.4)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]"
            >
              삭제 버튼
            </button>
          </div>
        </section>

        {/* 미니멀 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">⚪ 미니멀 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('미니멀 - 그레이')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-all hover:scale-105"
            >
              기본
            </button>
            <button
              onClick={() => handleButtonClick('미니멀 - 블랙')}
              className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-all hover:scale-105"
            >
              다크
            </button>
            <button
              onClick={() => handleButtonClick('미니멀 - 화이트')}
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-medium rounded-lg transition-all hover:scale-105"
            >
              라이트
            </button>
          </div>
        </section>

        {/* 현재 TicketStack 스타일 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🎫 현재 TicketStack 스타일</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleButtonClick('TicketStack - 입장')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 rounded-lg font-medium transition-all"
            >
              입장하기
            </button>
            <button
              onClick={() => handleButtonClick('TicketStack - 양도')}
              className="px-6 py-3 bg-transparent border-2 border-blue-400 text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-all hover:scale-105"
            >
              양도하기
            </button>
            <button
              onClick={() => handleButtonClick('TicketStack - 취소')}
              className="px-6 py-3 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-red-600 font-medium rounded-lg transition-all hover:scale-105"
            >
              취소 신청
            </button>
          </div>
        </section>
      </div>
    </div>
  );
} 