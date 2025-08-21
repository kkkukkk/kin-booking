// SMS 발송 관련 API 함수들

import { supabase } from "@/lib/supabaseClient";
import { toCamelCaseKeys, toSnakeCaseKeys } from "@/util/case/case";
import { 
  SendSmsDto, 
  SendLmsDto, 
  SendMmsDto, 
  SendBulkSmsDto, 
  SendEventSmsDto,
  SmsResponseDto,
  BulkSmsResponseDto 
} from "@/types/dto/sms";
import { SmsHistory, SmsTemplate, SmsStats, SmsConfig } from "@/types/model/sms";

// 기본 SMS 발송
export const sendSms = async (params: SendSmsDto): Promise<SmsResponseDto> => {
  // TODO: 네이버 SENS API 연동
  console.log('SMS 발송 예정:', params);
  
  // 실제 구현 시:
  // const response = await fetch('네이버_SENS_API_URL', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     phoneNumber: params.phoneNumber,
  //     message: params.message,
  //     // ... 기타 파라미터
  //   })
  // });
  // 
  // if (!response.ok) throw new Error('SMS 발송 실패');
  // 
  // const result = await response.json();
  // return result;

  // 임시 응답 (실제 구현 전까지)
  return {
    success: true,
    messageId: 'temp_' + Date.now(),
    phoneNumber: params.phoneNumber
  };
};

// LMS 발송
export const sendLms = async (params: SendLmsDto): Promise<SmsResponseDto> => {
  // TODO: 네이버 SENS LMS API 연동
  console.log('LMS 발송 예정:', params);
  
  return {
    success: true,
    messageId: 'temp_lms_' + Date.now(),
    phoneNumber: params.phoneNumber
  };
};

// MMS 발송
export const sendMms = async (params: SendMmsDto): Promise<SmsResponseDto> => {
  // TODO: 네이버 SENS MMS API 연동
  console.log('MMS 발송 예정:', params);
  
  return {
    success: true,
    messageId: 'temp_mms_' + Date.now(),
    phoneNumber: params.phoneNumber
  };
};

// 대량 SMS 발송
export const sendBulkSms = async (params: SendBulkSmsDto): Promise<BulkSmsResponseDto> => {
  // TODO: 네이버 SENS 대량 발송 API 연동
  console.log('대량 SMS 발송 예정:', params);
  
  const results: SmsResponseDto[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const phoneNumber of params.phoneNumbers) {
    try {
      const result = await sendSms({
        phoneNumber,
        message: params.message,
        templateId: params.templateId,
        scheduledAt: params.scheduledAt
      });
      results.push(result);
      if (result.success) successCount++;
      else failCount++;
    } catch (error) {
      results.push({
        success: false,
        phoneNumber,
        errorMessage: error instanceof Error ? error.message : '알 수 없는 오류'
      });
      failCount++;
    }
  }

  return {
    totalCount: params.phoneNumbers.length,
    successCount,
    failCount,
    results
  };
};

// 공연별 예매자 대상 SMS 발송
export const sendEventSms = async (params: SendEventSmsDto): Promise<BulkSmsResponseDto> => {
  // TODO: 예매자 전화번호 조회 및 SMS 발송
  console.log('공연별 SMS 발송 예정:', params);
  
  // 1. 예매자 전화번호 조회
  let phoneNumbers: string[] = [];
  
  if (params.targetType === 'custom' && params.customPhoneNumbers) {
    phoneNumbers = params.customPhoneNumbers;
  } else {
    // TODO: 예매자 테이블에서 전화번호 조회
    // const { data: reservations } = await supabase
    //   .from('reservations')
    //   .select('user_id')
    //   .eq('event_id', params.eventId)
    //   .eq('status', params.targetType === 'confirmed' ? 'confirmed' : 'pending');
    // 
    // const { data: users } = await supabase
    //   .from('users')
    //   .select('phone_number')
    //   .in('id', reservations.map(r => r.user_id));
    // 
    // phoneNumbers = users.map(u => u.phone_number);
    
    // 임시 데이터
    phoneNumbers = ['010-1234-5678', '010-9876-5432'];
  }

  // 2. SMS 발송
  return await sendBulkSms({
    phoneNumbers,
    message: params.message,
    templateId: params.templateId,
    scheduledAt: params.scheduledAt
  });
};

// SMS 발송 내역 조회
export const fetchSmsHistory = async (params?: {
  eventId?: string;
  phoneNumber?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}): Promise<{ data: SmsHistory[]; totalCount: number }> => {
  // TODO: SMS 발송 내역 테이블 조회
  console.log('SMS 발송 내역 조회 예정:', params);
  
  // 임시 데이터
  const tempData: SmsHistory[] = [
    {
      id: '1',
      eventId: 'event_1',
      phoneNumber: '010-1234-5678',
      message: '공연 안내 메시지입니다.',
      messageType: 'sms',
      status: 'delivered',
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return {
    data: tempData,
    totalCount: tempData.length
  };
};

// SMS 템플릿 조회
export const fetchSmsTemplates = async (): Promise<SmsTemplate[]> => {
  // TODO: SMS 템플릿 테이블 조회
  console.log('SMS 템플릿 조회 예정');
  
  // 임시 데이터
  return [
    {
      id: '1',
      name: '공연 안내',
      description: '공연 정보 안내용 템플릿',
      content: '[{공연명}] 공연 안내\n\n📅 공연일: {공연일}\n⏰ 시간: {공연시간}\n📍 장소: {장소}\n\n감사합니다!',
      variables: ['공연명', '공연일', '공연시간', '장소'],
      messageType: 'sms',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: '예매 확정',
      description: '예매 확정 안내용 템플릿',
      content: '[{공연명}] 예매가 확정되었습니다!\n\n📅 공연일: {공연일}\n⏰ 시간: {공연시간}\n📍 장소: {장소}\n🎫 수량: {수량}매\n\n즐거운 공연 되세요!',
      variables: ['공연명', '공연일', '공연시간', '장소', '수량'],
      messageType: 'sms',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

// SMS 통계 조회
export const fetchSmsStats = async (): Promise<SmsStats> => {
  // TODO: SMS 통계 데이터 조회
  console.log('SMS 통계 조회 예정');
  
  // 임시 데이터
  return {
    totalSent: 150,
    totalDelivered: 142,
    totalFailed: 8,
    deliveryRate: 94.7,
    todaySent: 12,
    thisMonthSent: 89,
    byEvent: [
      {
        eventId: 'event_1',
        eventName: '뮤지컬 햄릿',
        sentCount: 45,
        deliveredCount: 43
      },
      {
        eventId: 'event_2',
        eventName: '콘서트 클래식',
        sentCount: 33,
        deliveredCount: 31
      }
    ]
  };
};
