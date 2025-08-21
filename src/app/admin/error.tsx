'use client';

import React from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="main-center center">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="text-center w-full max-w-md md:max-w-lg mx-auto animate-fade-in bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* 에러 제목 */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            오류
          </h1>

          {/* 에러 메시지 */}
          <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 leading-relaxed px-2">
            {error.message || '관리자 페이지에서 오류가 발생했습니다.'}
          </p>

          {/* 액션 버튼들 */}
          <div className="space-y-3 px-4">
            <button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 md:px-6 rounded-lg transition-colors duration-200"
            >
              다시 시도
            </button>
            
            <a
              href="/admin"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 md:px-6 rounded-lg transition-colors duration-200 block"
            >
              관리자 대시보드로
            </a>
          </div>

          {/* 추가 정보 */}
          <div className="mt-6 md:mt-8 mx-4 p-3 md:p-4 bg-gray-50 rounded-lg">
            <p className="text-xs md:text-sm text-gray-500">
              문제가 지속되면<br className="md:hidden" /> 시스템 관리자에게 문의하세요.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
