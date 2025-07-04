'use client'

import React, { useRef, useState, useEffect } from 'react'
import { TicketStatus } from '@/types/model/ticket'

interface TicketCardProps {
  eventName: string
  status: TicketStatus
  latestCreatedAt?: string
  eventId?: string
  ticketColor?: string
  isRare?: boolean
}

const TicketCard: React.FC<TicketCardProps> = ({
  eventName,
  status,
  latestCreatedAt,
  eventId,
  ticketColor,
  isRare,
}) => {
  const ticketNo = '1234-5678'

  const contentRef = useRef<HTMLDivElement>(null)
  const [maskSize, setMaskSize] = useState({ width: 320, height: 160 })
  const [maskId] = useState(() => `ticketMask-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    if (!contentRef.current) return
    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        setMaskSize({ width: Math.round(width), height: Math.round(height) })
      }
    })
    ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, [])

  const notchRadius = 12
  const notchCx = maskSize.width - notchRadius - 80
  const notchCyTop = 0
  const notchCyBottom = maskSize.height
  const rightWidth = maskSize.width - notchCx - 1

  // rare 티켓용 gold 그라데이션
  const rareGradient = 'linear-gradient(135deg, #ffd700 0%, #fffbe6 100%)';

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
            {[...Array(Math.floor(maskSize.height / 10))].map((_, i) => {
              const cy = 7 + i * 14;
              return (
                <React.Fragment key={i}>
                  <circle key={`left-notch-${i}`} cx={0} cy={cy} r={4} fill="black" />
                  <circle key={`right-notch-${i}`} cx={maskSize.width} cy={cy} r={4} fill="black" />
                  <circle key={`center-notch-${i}`} cx={notchCx} cy={cy} r={4} fill="black" />
                </React.Fragment>
              )
            })}
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
        {/* 좌측 영역 - 개선된 디자인 */}
        <div
          className="p-4"
          style={{
            width: notchCx,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #e2e8f0 100%)',
          }}
        >
          {/* 이벤트명 */}
          <div className="text-slate-800 font-bold text-lg mb-3 leading-tight">{eventName}</div>
          
          {/* 티켓 정보 섹션 */}
          <div className="space-y-3">
            {/* 티켓 번호 */}
            <div className="bg-white bg-opacity-60 rounded-lg p-2 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium mb-1">티켓 번호</div>
              <div className="text-sm font-mono text-slate-700 select-text">{ticketNo}</div>
            </div>
            
            {/* 날짜 정보 */}
            {latestCreatedAt && (
              <div className="bg-white bg-opacity-40 rounded-lg p-2">
                <div className="text-xs text-slate-500 font-medium mb-1">예약일</div>
                <div className="text-sm text-slate-700 font-semibold">
                  {new Date(latestCreatedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 우측 영역 - 그라데이션 배경과 아이콘 */}
        <div
          className="p-4 flex flex-col justify-center items-center select-none relative overflow-hidden"
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