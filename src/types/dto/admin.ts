// 공연별 통계 데이터
export interface EventStats {
  eventId: string;
  eventName: string;
  eventDate: string;
  seatCapacity: number;
  reservedQuantity: number;
  confirmedQuantity: number;
  pendingQuantity: number;
  cancelledQuantity: number;
  reservationRate: number; // 예매율 (%)
  totalRevenue: number; // 총 수익
  cancellationRate: number; // 취소율 (%)
  status: string;
  totalReservations: number; // 전체 예매 수
  remainingSeats: number; // 남은 좌석 수
  ticketPrice: number; // 티켓 가격
}

// 사용자 통계 데이터
export interface UserStats {
  totalUsers: number;
  activeUsers: number;      // DB 상태가 active인 사용자
  activityUsers: number;    // 최근 30일 내 활동이 있는 사용자
  inactiveUsers: number;    // 비활성 사용자 (전체 - 활성)
  activeUserRate: number;   // 활성 사용자 비율 (%)
  activityUserRate: number; // 활동 사용자 비율 (%)
}

// 시간별 증감 데이터
export interface TrendData {
  period: string;           // 기간 (예: "어제 대비", "저번주 대비", "지난달 대비")
  payment: number;          // 해당 기간 입금
  refund: number;           // 해당 기간 환불
  netRevenue: number;       // 해당 기간 총수익 (입금 - 환불)
  reservations: number;     // 해당 기간 예매 수
  cancellations: number;    // 해당 기간 취소 수
  changeRate: number;       // 이전 기간 대비 수익 증감률 (%)
  netReservations: number;  // 예매 - 취소 (순증가 건수)
}

// 전체 통계 요약
export interface DashboardStats {
  events: EventStats[];
  users: UserStats;
  totalRevenue: number;
  totalReservations: number;
  totalCancellations: number;
  totalTickets: number;
  availableTickets: number;
  usedTickets: number;
  cancelledTickets: number;
  cancelRequestedTickets: number;
  trends: TrendData[];      // 시간별 증감 데이터 추가
}
