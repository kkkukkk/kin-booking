// SMS 발송 관련 React Query 훅들

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  sendSms, 
  sendLms, 
  sendMms, 
  sendBulkSms, 
  sendEventSms,
  fetchSmsHistory,
  fetchSmsTemplates,
  fetchSmsStats
} from "@/api/sms";
import { 
  SendSmsDto, 
  SendLmsDto, 
  SendMmsDto, 
  SendBulkSmsDto, 
  SendEventSmsDto 
} from "@/types/dto/sms";

// 기본 SMS 발송
export const useSendSms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendSms,
    onSuccess: () => {
      // SMS 발송 내역 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['sms', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['sms', 'stats'] });
    },
    onError: (error: Error) => {
      console.error('SMS 발송 실패:', error.message);
    },
  });
};

// LMS 발송
export const useSendLms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendLms,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['sms', 'stats'] });
    },
    onError: (error: Error) => {
      console.error('LMS 발송 실패:', error.message);
    },
  });
};

// MMS 발송
export const useSendMms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMms,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['sms', 'stats'] });
    },
    onError: (error: Error) => {
      console.error('MMS 발송 실패:', error.message);
    },
  });
};

// 대량 SMS 발송
export const useSendBulkSms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendBulkSms,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['sms', 'stats'] });
    },
    onError: (error: Error) => {
      console.error('대량 SMS 발송 실패:', error.message);
    },
  });
};

// 공연별 예매자 대상 SMS 발송
export const useSendEventSms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendEventSms,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['sms', 'stats'] });
      // 예매 관련 쿼리도 무효화 (예매자 목록 등)
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error: Error) => {
      console.error('공연별 SMS 발송 실패:', error.message);
    },
  });
};

// SMS 발송 내역 조회
export const useSmsHistory = (params?: {
  eventId?: string;
  phoneNumber?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ['sms', 'history', params],
    queryFn: () => fetchSmsHistory(params),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// SMS 템플릿 조회
export const useSmsTemplates = () => {
  return useQuery({
    queryKey: ['sms', 'templates'],
    queryFn: fetchSmsTemplates,
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// SMS 통계 조회
export const useSmsStats = () => {
  return useQuery({
    queryKey: ['sms', 'stats'],
    queryFn: fetchSmsStats,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
  });
};
