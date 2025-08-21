// SMS 발송 관련 DTO 타입들

// 기본 SMS 발송 DTO
export interface SendSmsDto {
  phoneNumber: string
  message: string
  templateId?: string
  scheduledAt?: string // 예약 발송 시간
}

// LMS (긴 문자) 발송 DTO
export interface SendLmsDto {
  phoneNumber: string
  subject: string // 제목
  message: string
  templateId?: string
  scheduledAt?: string
}

// MMS (멀티미디어) 발송 DTO
export interface SendMmsDto {
  phoneNumber: string
  subject: string
  message: string
  imageUrl?: string
  templateId?: string
  scheduledAt?: string
}

// 대량 발송 DTO
export interface SendBulkSmsDto {
  phoneNumbers: string[]
  message: string
  templateId?: string
  scheduledAt?: string
}

// 공연별 예매자 대상 발송 DTO
export interface SendEventSmsDto {
  eventId: string
  targetType: 'all' | 'confirmed' | 'pending' | 'custom'
  customPhoneNumbers?: string[]
  message: string
  templateId?: string
  scheduledAt?: string
}

// 발송 결과 응답 DTO
export interface SmsResponseDto {
  success: boolean
  messageId?: string
  errorMessage?: string
  phoneNumber: string
}

// 대량 발송 결과 응답 DTO
export interface BulkSmsResponseDto {
  totalCount: number
  successCount: number
  failCount: number
  results: SmsResponseDto[]
}
