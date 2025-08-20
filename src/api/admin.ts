import { supabase } from '@/lib/supabaseClient';
import { EventStats, UserStats, DashboardStats, TrendData } from '@/types/dto/admin';
import dayjs from 'dayjs';

// 기간별 데이터 분류 함수
const classifyByPeriod = (data: any[], dateField: string) => {
  const now = dayjs();
  const periods = {
    today: { start: now.startOf('day'), end: now.endOf('day') },
    yesterday: { start: now.subtract(1, 'day').startOf('day'), end: now.subtract(1, 'day').endOf('day') },
    currentWeek: { start: now.startOf('week'), end: now.endOf('week') },
    lastWeek: { start: now.startOf('week').subtract(1, 'week'), end: now.startOf('week').subtract(1, 'day').endOf('day') },
    currentMonth: { start: now.startOf('month'), end: now.endOf('month') },
    lastMonth: { start: now.subtract(1, 'month').startOf('month'), end: now.subtract(1, 'month').endOf('month') }
  };
  
  return Object.entries(periods).reduce((acc, [key, { start, end }]) => {
    acc[key] = data.filter(item => {
      const itemDate = dayjs(item[dateField]);
      return itemDate.isAfter(start) && itemDate.isBefore(end);
    });
    return acc;
  }, {} as Record<string, any[]>);
};

// 통합 대시보드 데이터 조회 (최적화된 버전)
export const getAllDashboardData = async () => {
  try {
    const now = dayjs();
    const lastMonthStart = now.subtract(1, 'month').startOf('month');
    
    // API 호출로 모든 데이터 조회
    const [usersResult, ticketsResult, transactionsResult, reservationsResult, eventsResult] = await Promise.all([
      // 1. 사용자 데이터
      supabase.from('users').select('id, status'),
      
      // 2. 티켓 데이터
      supabase.from('ticket').select('status'),
      
      // 3. 결제 거래 데이터 (최근 1개월)
      supabase.from('payment_transactions')
        .select('event_id, amount, payment_type, operated_at')
        .gte('operated_at', lastMonthStart.toISOString()),
      
      // 4. 예매 데이터 (최근 1개월)
      supabase.from('reservations')
        .select('event_id, quantity, status, reserved_at')
        .gte('reserved_at', lastMonthStart.toISOString().split('T')[0]),
      
      // 5. 공연 데이터 (통합 뷰)
      supabase.from('event_with_reservation_view')
        .select('*')
        .order('event_date', { ascending: false })
    ]);

    // 에러 체크
    if (usersResult.error) throw usersResult.error;
    if (ticketsResult.error) throw ticketsResult.error;
    if (transactionsResult.error) throw transactionsResult.error;
    if (reservationsResult.error) throw reservationsResult.error;
    if (eventsResult.error) throw eventsResult.error;

    return {
      users: usersResult.data || [],
      tickets: ticketsResult.data || [],
      transactions: transactionsResult.data || [],
      reservations: reservationsResult.data || [],
      events: eventsResult.data || []
    };
  } catch (error) {
    console.error('통합 대시보드 데이터 조회 실패:', error);
    throw error;
  }
};

// 프론트엔드에서 사용할 데이터 처리 함수들
export const processUserStats = (users: any[]): UserStats => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = totalUsers - activeUsers;
  
  // 활동 사용자 수는 reservations에서 계산해야 하므로 별도 처리
  const activeUserRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  
  return {
    totalUsers,
    activeUsers,
    activityUsers: 0, // reservations 데이터 필요
    inactiveUsers,
    activeUserRate,
    activityUserRate: 0 // reservations 데이터 필요
  };
};

export const processTicketStats = (tickets: any[]) => {
  const availableTickets = tickets.filter(t => t.status === 'active').length;
  const usedTickets = tickets.filter(t => t.status === 'used').length;
  const cancelledTickets = tickets.filter(t => t.status === 'cancelled').length;
  const cancelRequestedTickets = tickets.filter(t => t.status === 'cancel_requested').length;
  const totalTickets = availableTickets + usedTickets + cancelledTickets + cancelRequestedTickets;

  return {
    totalTickets,
    availableTickets,
    usedTickets,
    cancelledTickets,
    cancelRequestedTickets
  };
};

export const processRevenueStats = (transactions: any[]) => {
  let totalPayment = 0;
  let totalRefund = 0;
  
  transactions.forEach(transaction => {
    if (transaction.payment_type === 'payment') {
      totalPayment += transaction.amount;
    } else if (transaction.payment_type === 'refund') {
      totalRefund += transaction.amount;
    }
  });

  const totalRevenue = totalPayment - totalRefund;

  return {
    totalPayment,
    totalRefund,
    totalRevenue
  };
};

export const processEventStats = (events: any[], transactions: any[], reservations: any[]): EventStats[] => {
  return events.map(event => {
    // 해당 공연의 결제 거래 집계
    const eventTransactions = transactions.filter(t => t.event_id === event.event_id);
    let totalPayment = 0;
    let totalRefund = 0;
    
    eventTransactions.forEach(transaction => {
      if (transaction.payment_type === 'payment') {
        totalPayment += transaction.amount;
      } else if (transaction.payment_type === 'refund') {
        totalRefund += transaction.amount;
      }
    });

    const netRevenue = totalPayment - totalRefund;
    
    // 해당 공연의 예매 집계
    const eventReservations = reservations.filter(r => r.event_id === event.event_id);
    const confirmedQuantity = eventReservations
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + r.quantity, 0);
    
    const pendingQuantity = eventReservations
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.quantity, 0);
    
    const cancelledQuantity = eventReservations
      .filter(r => r.status === 'cancelled' || r.status === 'voided')
      .reduce((sum, r) => sum + r.quantity, 0);

    const totalReservedQuantity = confirmedQuantity + pendingQuantity + cancelledQuantity;
    
    // 판매율 계산 (실제 판매된 티켓 수 / 총 좌석 수)
    const salesRate = event.seat_capacity > 0 ? (event.reserved_quantity / event.seat_capacity) * 100 : 0;
    
    // 취소율 계산
    const cancellationRate = totalReservedQuantity > 0 ? (cancelledQuantity / totalReservedQuantity) * 100 : 0;

    return {
      eventId: event.event_id,
      eventName: event.event_name,
      eventDate: event.event_date,
      seatCapacity: event.seat_capacity,
      reservedQuantity: event.reserved_quantity,
      confirmedQuantity,
      pendingQuantity,
      cancelledQuantity,
      reservationRate: Math.round(salesRate * 100) / 100, // 판매율로 사용
      totalRevenue: netRevenue,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
      status: event.status,
      totalReservations: totalReservedQuantity,
      remainingSeats: event.seat_capacity - event.reserved_quantity,
      ticketPrice: event.ticket_price || 0,
    };
  });
};

export const processTrendStats = (transactions: any[], reservations: any[]): TrendData[] => {
  // 기간별 분류
  const paymentByPeriod = classifyByPeriod(transactions, 'operated_at');
  const reservationsByPeriod = classifyByPeriod(reservations, 'reserved_at');

  // 수익 계산 함수
  const calculatePaymentStats = (transactions: any[]) => {
    let payment = 0;
    let refund = 0;
    transactions.forEach(t => {
      if (t.payment_type === 'payment') {
        payment += t.amount;
      } else if (t.payment_type === 'refund') {
        refund += t.amount;
      }
    });
    return { payment, refund, netRevenue: payment - refund };
  };

  // 예매/취소 통계 함수
  const calculateReservationStats = (reservations: any[]) => {
    const total = reservations.length;
    const cancelled = reservations.filter(r => r.status === 'cancelled' || r.status === 'voided').length;
    return { total, cancelled };
  };

  // 각 기간별 통계 계산
  const todayStats = calculatePaymentStats(paymentByPeriod.today || []);
  const todayResStats = calculateReservationStats(reservationsByPeriod.today || []);
  
  const yesterdayStats = calculatePaymentStats(paymentByPeriod.yesterday || []);
  const yesterdayResStats = calculateReservationStats(reservationsByPeriod.yesterday || []);
  
  const currentWeekStats = calculatePaymentStats(paymentByPeriod.currentWeek || []);
  const currentWeekResStats = calculateReservationStats(reservationsByPeriod.currentWeek || []);
  
  const lastWeekStats = calculatePaymentStats(paymentByPeriod.lastWeek || []);
  const lastWeekResStats = calculateReservationStats(reservationsByPeriod.lastWeek || []);
  
  const currentMonthStats = calculatePaymentStats(paymentByPeriod.currentMonth || []);
  const currentMonthResStats = calculateReservationStats(reservationsByPeriod.currentMonth || []);
  
  const lastMonthStats = calculatePaymentStats(paymentByPeriod.lastMonth || []);
  const lastMonthResStats = calculateReservationStats(reservationsByPeriod.lastMonth || []);

  // 증감률 계산 함수
  const calculateChangeRate = (current: number, previous: number) => {
    if (previous === 0) {
      if (current === 0) return 0;
      return current > 0 ? 100 : -100;
    }
    return Math.round(((current - previous) / previous) * 100);
  };

  return [
    {
      period: '어제 대비',
      payment: todayStats.payment,
      refund: todayStats.refund,
      netRevenue: todayStats.netRevenue,
      reservations: todayResStats.total,
      cancellations: todayResStats.cancelled,
      changeRate: calculateChangeRate(todayStats.netRevenue, yesterdayStats.netRevenue),
      netReservations: todayResStats.total - todayResStats.cancelled
    },
    {
      period: '저번주 대비',
      payment: currentWeekStats.payment,
      refund: currentWeekStats.refund,
      netRevenue: currentWeekStats.netRevenue,
      reservations: currentWeekResStats.total,
      cancellations: currentWeekResStats.cancelled,
      changeRate: calculateChangeRate(currentWeekStats.netRevenue, lastWeekStats.netRevenue),
      netReservations: currentWeekResStats.total - currentWeekResStats.cancelled
    },
    {
      period: '지난달 대비',
      payment: currentMonthStats.payment,
      refund: currentMonthStats.refund,
      netRevenue: currentMonthStats.netRevenue,
      reservations: currentMonthResStats.total,
      cancellations: currentMonthResStats.cancelled,
      changeRate: calculateChangeRate(currentMonthStats.netRevenue, lastMonthStats.netRevenue),
      netReservations: currentMonthResStats.total - currentMonthResStats.cancelled
    }
  ];
};

// 활동 사용자 통계 (reservations 데이터 필요)
export const processActivityUserStats = (users: any[], reservations: any[]): UserStats => {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = totalUsers - activeUsers;
  
  // 최근 30일 내 활동이 있는 사용자 수
  const thirtyDaysAgo = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
  const recentReservations = reservations.filter(r => r.reserved_at >= thirtyDaysAgo);
  const uniqueActivityUsers = new Set(recentReservations.map(r => r.user_id).filter(id => id !== null)).size;
  
  const activeUserRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  const activityUserRate = totalUsers > 0 ? (uniqueActivityUsers / totalUsers) * 100 : 0;

  return {
    totalUsers,
    activeUsers,
    activityUsers: uniqueActivityUsers,
    inactiveUsers,
    activeUserRate,
    activityUserRate
  };
};

// 전체 대시보드 통계 조회 (최적화된 통합 버전)
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // 통합 데이터 조회
    const rawData = await getAllDashboardData();
    
    // 프론트엔드에서 데이터 처리
    const userStats = processActivityUserStats(rawData.users, rawData.reservations);
    const ticketStats = processTicketStats(rawData.tickets);
    const revenueStats = processRevenueStats(rawData.transactions);
    const eventStats = processEventStats(rawData.events, rawData.transactions, rawData.reservations);
    const trends = processTrendStats(rawData.transactions, rawData.reservations);

    // 전체 예매 수와 취소 수 계산
    const totalReservations = eventStats.reduce((sum, event) => sum + event.reservedQuantity, 0);
    const totalCancellations = eventStats.reduce((sum, event) => sum + event.cancelledQuantity, 0);

    return {
      events: eventStats,
      users: userStats,
      totalRevenue: revenueStats.totalRevenue,
      totalReservations: totalReservations,
      totalCancellations: totalCancellations,
      totalTickets: ticketStats.totalTickets,
      availableTickets: ticketStats.availableTickets,
      usedTickets: ticketStats.usedTickets,
      cancelledTickets: ticketStats.cancelledTickets,
      cancelRequestedTickets: ticketStats.cancelRequestedTickets,
      trends: trends,
    };
  } catch (error) {
    console.error('대시보드 통계 조회 실패:', error);
    throw error;
  }
};

// 기존 개별 API 함수들 (하위 호환성을 위해 유지)
export const getEventStats = async (): Promise<EventStats[]> => {
  const rawData = await getAllDashboardData();
  return processEventStats(rawData.events, rawData.transactions, rawData.reservations);
};

export const getUserStats = async (): Promise<UserStats> => {
  const rawData = await getAllDashboardData();
  return processActivityUserStats(rawData.users, rawData.reservations);
};

export const getTicketStats = async () => {
  const rawData = await getAllDashboardData();
  return processTicketStats(rawData.tickets);
};

export const getRevenueStats = async () => {
  const rawData = await getAllDashboardData();
  return processRevenueStats(rawData.transactions);
};

export const getTrendStats = async (): Promise<TrendData[]> => {
  const rawData = await getAllDashboardData();
  return processTrendStats(rawData.transactions, rawData.reservations);
};
