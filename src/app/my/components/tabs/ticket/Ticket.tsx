'use client'

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { TicketStatus } from '@/types/model/ticket'
import { useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import dayjs from 'dayjs';

interface TicketCardProps {
  eventName: string
  status: TicketStatus
  ticketColor?: string
  isRare?: boolean
  eventDate?: string
  ticketNumber?: number
  ticketPrice?: number
}

const TicketCard = ({
  eventName,
  status,
  ticketColor,
  isRare,
  eventDate,
  ticketNumber,
  ticketPrice,
}: TicketCardProps) => {
  const theme = useAppSelector((state: RootState) => state.theme.current)

  // 테마별 그림자 스타일 결정
  const getShadowStyle = () => {
    switch (theme) {
      case 'normal':
        return "drop-shadow(0 4px 8px rgba(0,0,0,0.25))" // 어두운 그림자
      case 'dark':
      case 'neon':
        return "drop-shadow(0 4px 8px rgba(255,255,255,0.3))" // 밝은 그림자
      default:
        return "drop-shadow(0 4px 8px rgba(0,0,0,0.25))"
    }
  }

  // 기존 mask 관련 코드들 (주석 처리)
  /*
  const contentRef = useRef<HTMLDivElement>(null)
  const [maskSize, setMaskSize] = useState({ width: 320, height: 140 })
  const [isReady, setIsReady] = useState(false)
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  // 디바운스된 리사이즈 핸들러
  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }

    resizeTimeoutRef.current = setTimeout(() => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setMaskSize({ width: Math.round(width), height: Math.round(height) })
        setIsReady(true)
      }
    }, 16) // 약 60fps에 맞춘 디바운스
  }, [])

  useEffect(() => {
    if (!contentRef.current) return

    // 초기 크기 설정
    const rect = contentRef.current.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      setMaskSize({ width: Math.round(rect.width), height: Math.round(rect.height) })
      setIsReady(true)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(contentRef.current)
    return () => {
      ro.disconnect()
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [handleResize])

  const notchRadius = 12
  const notchCx = maskSize.width - notchRadius - 80
  const notchCyTop = 0
  const notchCyBottom = maskSize.height
  const rightWidth = maskSize.width - notchCx - 1

  // 절취선 구멍 위치 계산 (가변 높이에 맞춤)
  const perforationHoles = useMemo(() => {
    const holes = []
    const smallHoleRadius = 4 // 작은 구멍 반지름
    
    // 중간 원들만 사용 (반원 제거)
    const availableHeight = maskSize.height
    const totalSmallHoles = 15 // 원 개수
    
    // 모든 간격을 동일하게 계산
    const uniformSpacing = availableHeight / (totalSmallHoles + 1)
    
    for (let i = 0; i < totalSmallHoles; i++) {
      const y = uniformSpacing + i * uniformSpacing
      holes.push({ y, radius: smallHoleRadius })
    }
    
    return holes
  }, [maskSize.height])

  // 절취선 mask SVG 생성
  const perforationMask = useMemo(() => {
    // 절취선 위치를 두 영역 경계 중앙으로 정확히 계산
    const perforationX = notchCx + 0.5 // 두 영역 경계 중앙
    
    const svg = `
      <svg width="${maskSize.width}" height="${maskSize.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="perforation-mask">
            <rect width="100%" height="100%" fill="white"/>
            ${perforationHoles.map(hole => `
              <circle 
                cx="${perforationX}" 
                cy="${hole.y}" 
                r="${hole.radius}" 
                fill="black"
              />
            `).join('')}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="white" mask="url(#perforation-mask)"/>
      </svg>
    `
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }, [maskSize.width, maskSize.height, notchCx, perforationHoles])
  */

  // 공연 날짜 포맷팅
  const formatDate = (date: string) => {
    return dayjs(date).format('YYYY년 MM월 DD일');
  };

  const formatTime = (date: string) => {
    return dayjs(date).format('HH:mm');
  };

  // 기존 로딩 표시 (주석 처리)
  /*
  // 크기 측정이 완료되지 않았으면 로딩 표시
  if (!isReady) {
    return (
      <div
        ref={contentRef}
        className="relative max-w-md mx-auto my-6"
        style={{ filter: getShadowStyle() }}
      >
        <div className="relative flex">
          <div className="p-4 bg-gray-100 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  */

  return (
    <div
      className="relative max-w-md mx-auto my-6"
      style={{ filter: getShadowStyle() }}
    >
      {/* 기존 mask 적용 div (주석 처리) */}
      {/* 
      <div
        ref={contentRef}
        className="relative flex"
        style={{
          maskImage: `url("${perforationMask}")`,
          WebkitMaskImage: `url("${perforationMask}")`,
        }}
      >
      */}
      <div className="relative flex gap-0">
        <div
          className="p-4 rounded"
          style={{
            flex: 1,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #e2e8f0 100%)',
          }}
        >
          {/* 이벤트명과 티켓 번호 */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-800 font-bold text-base leading-tight whitespace-nowrap">{eventName}</div>
            {ticketNumber && (
              <div className="text-slate-600 font-semibold text-sm">
                #{ticketNumber}
              </div>
            )}
          </div>

          {/* 티켓 정보 */}
          <div className="space-y-2">
            {eventDate && (
              <div className="bg-white bg-opacity-60 rounded p-2 border border-slate-200">
                <div className="text-xs text-slate-500 font-medium mb-1">공연일</div>
                <div className="text-xs md:text-sm text-slate-700 font-semibold whitespace-nowrap">
                  {formatDate(eventDate)}
                </div>
                <div className="text-xs text-slate-600">
                  {formatTime(eventDate)}
                </div>
              </div>
            )}

            {/* 공연 장소와 가격 */}
            <div className="space-y-2">
              {ticketPrice && (
                <div className="bg-white bg-opacity-50 rounded p-2 border border-slate-200 flex items-center justify-between md:flex-col md:items-start">
                  <div className="text-xs text-slate-500 font-medium">가격</div>
                  <div className="text-xs font-semibold text-slate-700">
                    {ticketPrice.toLocaleString()}원
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측 영역 */}
        <div
          className="flex flex-col justify-center items-center select-none relative overflow-hidden rounded w-20"
          style={{
            background: status === TicketStatus.Used ? 'transparent' : (ticketColor || '#3b82f6'),
            color: status === TicketStatus.Used ? 'transparent' : 'white',
            transition: 'all 0.3s ease',
            userSelect: 'none',
          }}
        >
          {/* 배경 패턴 */}
          {status !== TicketStatus.Used && (
            <div className="absolute inset-0 opacity-20">
              {isRare ? (
                // 희귀 티켓 전용 패턴 - 별 모양과 다이아몬드
                <>
                  <div className="absolute top-2 right-2 w-8 h-8">
                    <div className="w-full h-full bg-white rounded-full opacity-60"></div>
                    <div className="absolute inset-1 bg-transparent border-2 border-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 transform rotate-45 bg-white opacity-60"></div>
                  <div className="absolute top-1/2 right-4 w-4 h-4">
                    <div className="w-full h-full bg-white rounded-full opacity-60"></div>
                    <div className="absolute inset-0.5 bg-transparent border border-white rounded-full"></div>
                  </div>
                  {/* 추가 별 모양들 */}
                  <div className="absolute top-4 right-6 w-3 h-3 bg-white opacity-40 rounded-full"></div>
                  <div className="absolute bottom-4 right-8 w-2 h-2 bg-white opacity-50 rounded-full"></div>
                </>
              ) : (
                // 일반 티켓 패턴
                <>
                  <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-2 border-white rounded-full"></div>
                  <div className="absolute top-1/2 right-4 w-4 h-4 border-2 border-white rounded-full"></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* 기존 mask 적용 div 닫기 (주석 처리) */}
      {/* </div> */}

      {/* 절취선 점선 요소 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-0.5 bg-gray-300" style={{ 
          left: 'calc(100% - 80px - 0.5px)', // 우측 영역 시작 부분
          top: '50%',
          height: '95%',
          transform: 'translateY(-50%)',
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, #9ca3af 8px, #9ca3af 12px)'
        }}></div>
      </div>
    </div>
  )
}

export default TicketCard