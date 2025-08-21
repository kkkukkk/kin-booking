'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';

const QRScannerPage = () => {
  const router = useRouter();
  const { session } = useSession();
  const { showToast } = useToast();
  
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // QR 스캔 결과 처리
  const handleQRScan = (data: string) => {
    try {
      // QR 코드에서 세션 ID 추출
      // 예: /admin/entry-check?entry=session_123
      const url = new URL(data);
      const entryParam = url.searchParams.get('entry');
      
      if (entryParam) {
        // 입장 확인 페이지로 이동
        router.push(`/admin/entry-check?entry=${entryParam}`);
      } else {
        // 직접 세션 ID가 QR에 있는 경우
        if (data.startsWith('session_') || data.length > 10) {
          router.push(`/admin/entry-check?entry=${data}`);
        } else {
          showToast({
            message: '올바른 입장 QR 코드가 아닙니다.',
            iconType: 'error',
            autoCloseTime: 3000,
          });
        }
      }
    } catch (error) {
      console.error('QR 코드 파싱 실패:', error);
      showToast({
        message: 'QR 코드를 읽을 수 없습니다. 다시 시도해주세요.',
        iconType: 'error',
        autoCloseTime: 3000,
      });
    }
  };

  // 로그인 체크만
  if (!session?.user) {
    return (
      <ThemeDiv className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <Button
            theme="normal"
            onClick={() => router.push('/login')}
            padding='px-6 py-2'
          >
            로그인하기
          </Button>
        </div>
      </ThemeDiv>
    );
  }

  return (
    <ThemeDiv className="h-full p-6">
      {/* 콘텐츠 영역 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full mb-8">
          {/* 페이지 제목 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
              </svg>
            </div>
          </div>

          {/* QR 스캔 버튼 */}
          <div className="text-center mb-8">
            <Button
              theme="neon"
              onClick={() => setIsScannerOpen(true)}
              padding="px-8 py-4"
              className="text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mx-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              QR 코드 스캔 시작
            </Button>
          </div>

          {/* 사용 방법 안내 */}
          <ThemeDiv className="rounded-lg p-6 shadow-lg" isChildren>
            <h3 className="text-lg font-bold mb-4 flex items-center justify-center">
              사용 방법
            </h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'QR 코드 생성', desc: '사용자가 입장 QR 코드를 생성합니다' },
                { step: 2, title: '스캔 시작', desc: '위의 "QR 코드 스캔 시작" 버튼을 클릭합니다' },
                { step: 3, title: '카메라 스캔', desc: '카메라로 QR 코드를 스캔합니다' },
                { step: 4, title: '자동 이동', desc: '자동으로 입장 확인 페이지로 이동합니다' }
              ].map((item) => (
                <div key={item.step} className="flex items-center group">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 transition-transform duration-200 shadow-md">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 text-sm">{item.title}</h4>
                    <p className="text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ThemeDiv>
        </div>
      </div>

      {/* QR 스캐너 모달 */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQRScan}
      />
    </ThemeDiv>
  );
};

export default QRScannerPage; 