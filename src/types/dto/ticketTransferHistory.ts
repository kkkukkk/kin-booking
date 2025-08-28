// 양도 이력 그룹 DTO (뷰 테이블용)
export interface TransferHistoryGroupDto {
  // 그룹핑 기준
  groupTime: string;
  fromUserId: string;
  toUserId: string;
  
  // 매수 정보
  ticketCount: number;
  
  // 양도자 정보
  fromUserName: string;
  fromUserEmail: string;
  
  // 수령자 정보
  toUserName: string;
  toUserEmail: string;
  
  // 이벤트 정보
  eventName: string;
  
  // 양도 정보
  reason?: string;
}
