'use client'

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { TicketStatus } from '@/types/model/ticket'

interface TicketCardProps {
  eventName: string
  status: TicketStatus
  latestCreatedAt?: string
  eventId?: string
  ticketColor?: string
  isRare?: boolean
  eventDate?: string
  location?: string
  ticketId?: string
  ticketNumber?: number
  ticketPrice?: number
}

const TicketCard: React.FC<TicketCardProps> = ({
  eventName,
  status,
  latestCreatedAt,
  eventId,
  ticketColor,
  isRare,
  eventDate,
  location,
  ticketId,
  ticketNumber,
  ticketPrice,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [maskSize, setMaskSize] = useState({ width: 320, height: 140 })
  const [maskId] = useState(() => `ticketMask-${Math.random().toString(36).slice(2)}`)
  const [isReady, setIsReady] = useState(false)
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  // 디바운스된 리사이즈 핸들러
  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      for (let entry of entries) {
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

  // rare 티켓용 gold 그라데이션
  const rareGradient = 'linear-gradient(135deg, #ffd700 0%, #fffbe6 100%)';

  // UUID를 더 읽기 쉽게 포맷팅 (앞 8자리만 표시)
  const formatTicketId = (id?: string) => {
    if (!id) return 'N/A'
    return id.substring(0, 8).toUpperCase()
  }

  // 공연 날짜 포맷팅
  const formatEventDate = (date?: string) => {
    if (!date) return '날짜 미정'
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }

  // 공연 시간 포맷팅
  const formatEventTime = (date?: string) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 마스크 요소들을 메모이제이션
  const maskElements = useMemo(() => {
    const elements = []
    const notchCount = Math.floor(maskSize.height / 10)
    
    for (let i = 0; i < notchCount; i++) {
      const cy = 7 + i * 14
      elements.push(
        <React.Fragment key={i}>
          <circle cx={0} cy={cy} r={4} fill="black" />
          <circle cx={maskSize.width} cy={cy} r={4} fill="black" />
          <circle cx={notchCx} cy={cy} r={4} fill="black" />
        </React.Fragment>
      )
    }
    
    return elements
  }, [maskSize.height, maskSize.width, notchCx])

  // 크기 측정이 완료되지 않았으면 로딩 상태 표시
  if (!isReady) {
    return (
      <div
        ref={contentRef}
        className="relative max-w-md mx-auto my-6"
        style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.25))" }}
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

  return (
    <div
      className="relative max-w-md mx-auto my-6"
      style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.25))" }}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={maskSize.width} height={maskSize.height}>
            <rect x="0" y="0" width={maskSize.width} height={maskSize.height} fill="white" />
            <circle cx={notchCx} cy={notchCyTop} r={notchRadius} fill="black" />
            <circle cx={notchCx} cy={notchCyBottom} r={notchRadius} fill="black" />
            {maskElements}
          </mask>
        </defs>
      </svg>

      <div
        ref={contentRef}
        className="relative flex"
        style={{
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
          background: 'transparent',
        }}
      >
        <div
          className="p-4"
          style={{
            width: notchCx,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #e2e8f0 100%)',
          }}
        >
          {/* 이벤트명과 티켓 번호 */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-800 font-bold text-base leading-tight">{eventName}</div>
            {ticketNumber && (
              <div className="text-slate-600 font-semibold text-sm">
                #{ticketNumber}
              </div>
            )}
          </div>
          
          {/* 티켓 정보 섹션 - 더 컴팩트하게 */}
          <div className="space-y-2">
            {/* 공연 날짜와 시간을 분리해서 표시 */}
            {eventDate && (
              <div className="bg-white bg-opacity-60 rounded p-2 border border-slate-200">
                <div className="text-xs text-slate-500 font-medium mb-1">공연일</div>
                <div className="text-sm text-slate-700 font-semibold">
                  {formatEventDate(eventDate)}
                </div>
                <div className="text-xs text-slate-600">
                  {formatEventTime(eventDate)}
                </div>
              </div>
            )}
            
            {/* 공연 장소와 가격 */}
            <div className="space-y-2">
              {location && (
                <div className="bg-white bg-opacity-40 rounded p-2">
                  <div className="text-xs text-slate-500 font-medium mb-1">공연장</div>
                  <div className="text-sm text-slate-700 font-semibold leading-tight">{location}</div>
                </div>
              )}
              
              {/* 가격 정보 */}
              {ticketPrice && (
                <div className="bg-white bg-opacity-50 rounded p-2 border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium mb-1">가격</div>
                  <div className="text-sm font-semibold text-slate-700">
                    {ticketPrice.toLocaleString()}원
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측 영역 - 최소한의 공간만 사용 */}
        <div
          className="flex flex-col justify-center items-center select-none relative overflow-hidden"
          style={{
            width: rightWidth,
            borderLeft: '2px dashed rgba(255,255,255,0.3)',
            background: status === TicketStatus.Used ? 'transparent' : (isRare ? rareGradient : (ticketColor || '#3b82f6')),
            color: status === TicketStatus.Used ? 'transparent' : 'white',
            transition: 'all 0.3s ease',
            userSelect: 'none',
          }}
        >
          {/* 배경 패턴 */}
          {status !== TicketStatus.Used && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 right-4 w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketCard