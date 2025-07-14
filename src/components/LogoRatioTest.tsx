"use client";

import { useState } from "react";

const LogoRatioTest = () => {
  const [kRatio, setKRatio] = useState(33.33);
  const [iRatio, setIRatio] = useState(33.33);
  const [nRatio, setNRatio] = useState(33.33);
  const [kOffset, setKOffset] = useState(0);
  const [iOffset, setIOffset] = useState(33.33);
  const [nOffset, setNOffset] = useState(66.67);

  return (
    <div className="h-screen bg-black overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-white text-2xl mb-8">로고 비율 테스트</h1>
        
        {/* 컨트롤 패널 */}
        <div className="bg-gray-800 p-4 rounded-lg mb-8">
          <h2 className="text-white text-lg mb-4">비율 조정</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm">K 비율 (%)</label>
              <input
                type="range"
                min="10"
                max="100"
                step="0.1"
                value={kRatio}
                onChange={(e) => setKRatio(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-white text-sm ml-2">{kRatio}%</span>
            </div>
            
            <div>
              <label className="text-white text-sm">I 비율 (%)</label>
              <input
                type="range"
                min="10"
                max="100"
                step="0.1"
                value={iRatio}
                onChange={(e) => setIRatio(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-white text-sm ml-2">{iRatio}%</span>
            </div>
            
            <div>
              <label className="text-white text-sm">N 비율 (%)</label>
              <input
                type="range"
                min="10"
                max="100"
                step="0.1"
                value={nRatio}
                onChange={(e) => setNRatio(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-white text-sm ml-2">{nRatio}%</span>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="text-white text-sm">K 오프셋 (%)</label>
            <input
              type="range"
              min="-50"
              max="100"
              step="0.1"
              value={kOffset}
              onChange={(e) => setKOffset(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-white text-sm ml-2">{kOffset}%</span>
          </div>
          
          <div className="mt-4">
            <label className="text-white text-sm">I 오프셋 (%)</label>
            <input
              type="range"
              min="-50"
              max="100"
              step="0.1"
              value={iOffset}
              onChange={(e) => setIOffset(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-white text-sm ml-2">{iOffset}%</span>
          </div>
          
          <div className="mt-4">
            <label className="text-white text-sm">N 오프셋 (%)</label>
            <input
              type="range"
              min="-50"
              max="100"
              step="0.1"
              value={nOffset}
              onChange={(e) => setNOffset(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-white text-sm ml-2">{nOffset}%</span>
          </div>
        </div>

        {/* 테스트 결과 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* K */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white text-lg mb-2">K</h3>
            <div className="overflow-hidden border border-gray-600">
              <img
                src="/images/logo_dark_horizon.webp"
                alt="K"
                style={{
                  width: `${kRatio}%`,
                  marginLeft: `-${kOffset}%`,
                }}
                className="h-auto"
              />
            </div>
            <p className="text-white text-sm mt-2">
              비율: {kRatio}%, 오프셋: {kOffset}%
            </p>
          </div>

          {/* I */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white text-lg mb-2">I</h3>
            <div className="overflow-hidden border border-gray-600">
              <img
                src="/images/logo_dark_horizon.webp"
                alt="I"
                style={{
                  width: `${iRatio}%`,
                  marginLeft: `-${iOffset}%`,
                }}
                className="h-auto"
              />
            </div>
            <p className="text-white text-sm mt-2">
              비율: {iRatio}%, 오프셋: {iOffset}%
            </p>
          </div>

          {/* N */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white text-lg mb-2">N</h3>
            <div className="overflow-hidden border border-gray-600">
              <img
                src="/images/logo_dark_horizon.webp"
                alt="N"
                style={{
                  width: `${nRatio}%`,
                  marginLeft: `-${nOffset}%`,
                }}
                className="h-auto"
              />
            </div>
            <p className="text-white text-sm mt-2">
              비율: {nRatio}%, 오프셋: {nOffset}%
            </p>
          </div>
        </div>

        {/* 전체 로고 */}
        <div className="bg-gray-800 p-4 rounded-lg mb-8">
          <h3 className="text-white text-lg mb-2">전체 로고</h3>
          <img
            src="/images/logo_dark_horizon.webp"
            alt="전체 로고"
            className="h-auto max-w-full"
          />
        </div>

        {/* 개별 로고 파일들 */}
        <div className="bg-gray-800 p-4 rounded-lg mb-8">
          <h3 className="text-white text-lg mb-4">개별 로고 파일들</h3>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <img
                src="/images/logo_dark_K.webp"
                alt="K"
                className="h-16 md:h-20 w-auto"
              />
              <p className="text-white text-sm mt-2">logo_dark_K.webp</p>
            </div>
            <div className="text-center">
              <img
                src="/images/logo_dark_I.webp"
                alt="I"
                className="h-16 md:h-20 w-auto"
              />
              <p className="text-white text-sm mt-2">logo_dark_I.webp</p>
            </div>
            <div className="text-center">
              <img
                src="/images/logo_dark_N.webp"
                alt="N"
                className="h-16 md:h-20 w-auto"
              />
              <p className="text-white text-sm mt-2">logo_dark_N.webp</p>
            </div>
          </div>
        </div>

        {/* 최종 CSS 코드 */}
        <div className="bg-gray-800 p-4 rounded-lg mt-8">
          <h3 className="text-white text-lg mb-2">최종 CSS 코드</h3>
          <pre className="text-green-400 text-sm overflow-x-auto">
{`.k-letter {{
  background-image: url('/images/logo_dark_horizon.webp');
  background-size: ${(100 / kRatio * 100).toFixed(2)}% 100%;
  background-position: ${kOffset}% 0;
}}

.i-letter {{
  background-image: url('/images/logo_dark_horizon.webp');
  background-size: ${(100 / iRatio * 100).toFixed(2)}% 100%;
  background-position: ${iOffset}% 0;
}}

.n-letter {{
  background-image: url('/images/logo_dark_horizon.webp');
  background-size: ${(100 / nRatio * 100).toFixed(2)}% 100%;
  background-position: ${nOffset}% 0;
}}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LogoRatioTest; 