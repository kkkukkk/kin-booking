// SMS 발송 관련 모델 타입들

// SMS 발송 내역 모델
export interface SmsHistory {
  id: string
  eventId?: string
  phoneNumber: string
  message: string
  messageType: 'sms' | 'lms' | 'mms'
  status: 'pending' | 'sent' | 'failed' | 'delivered'
  sentAt?: string
  deliveredAt?: string
  errorMessage?: string
  templateId?: string
  scheduledAt?: string
  createdAt: string
  updatedAt: string
}

// SMS 템플릿 모델
export interface SmsTemplate {
  id: string
  name: string
  description?: string
  content: string
  variables: string[] // 템플릿에서 사용할 변수들
  messageType: 'sms' | 'lms' | 'mms'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// SMS 발송 통계 모델
export interface SmsStats {
  totalSent: number
  totalDelivered: number
  totalFailed: number
  deliveryRate: number
  todaySent: number
  thisMonthSent: number
  byEvent: {
    eventId: string
    eventName: string
    sentCount: number
    deliveredCount: number
  }[]
}

// SMS 발송 설정 모델
export interface SmsConfig {
  id: string
  provider: 'naver' | 'kakao' | 'toss'
  apiKey: string
  secretKey: string
  senderId: string
  isActive: boolean
  dailyLimit: number
  monthlyLimit: number
  createdAt: string
  updatedAt: string
}
