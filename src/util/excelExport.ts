import * as XLSX from 'xlsx';

export interface TicketExportData {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  ticketHolder: string;
  ticketCount: number;
  ticketNumbers: number[];
  eventId: string;
  ticketStatuses: string[];
}

export interface EventInfo {
  id: string;
  eventName: string;
}

export const exportTicketsToExcel = (
  data: TicketExportData[], 
  filename?: string, 
  separateByEvent: boolean = false,
  events?: EventInfo[]
) => {
  if (data.length === 0) {
    return;
  }
  
  // 워크북 생성
  const wb = XLSX.utils.book_new();

  if (separateByEvent && data.length > 0) {
    // 공연별로 그룹핑 (eventId 기준)
    const eventGroups: { [eventId: string]: TicketExportData[] } = {};
    
    data.forEach(item => {
      if (!eventGroups[item.eventId]) {
        eventGroups[item.eventId] = [];
      }
      eventGroups[item.eventId].push(item);
    });

    // 각 공연별로 워크시트 생성
    Object.entries(eventGroups).forEach(([eventId, eventData]) => {
      try {
        const excelData = eventData.map(item => ({
          '사용자명': item.userName,
          '이메일': item.userEmail,
          '전화번호': item.userPhoneNumber,
          '티켓홀더': item.ticketHolder,
          '티켓수량': item.ticketCount,
          '티켓번호': item.ticketNumbers.join(', '),
          '상태': item.ticketStatuses.map(status => getStatusKorean(status)).join(', ')
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // 빈 행 제거 - 실제 데이터 범위만 설정 (헤더 포함)
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
        ws['!ref'] = XLSX.utils.encode_range({
          s: { c: 0, r: 0 },
          e: { c: range.e.c, r: excelData.length } // 헤더 포함하므로 +1
        });
        
        // 컬럼 너비 설정
        const colWidths = [
          { wch: 15 }, // 사용자명
          { wch: 25 }, // 이메일
          { wch: 15 }, // 전화번호
          { wch: 15 }, // 티켓홀더
          { wch: 10 }, // 티켓수량
          { wch: 20 }, // 티켓번호
          { wch: 10 }  // 상태
        ];
        ws['!cols'] = colWidths;

        // 워크시트 이름 (모달의 공연 데이터 사용)
        const eventInfo = events?.find(e => e.id === eventId);
        const eventName = eventInfo?.eventName || `공연_${eventId}`;
        const sheetName = eventName.length > 31 ? eventName.substring(0, 31) : eventName;
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      } catch (error) {
        // 에러 발생 시 해당 워크시트만 건너뛰고 계속 진행
      }
    });
  } else {
    try {
      // 단일 워크시트로 모든 데이터 (공연명 컬럼 제거)
      const excelData = data.map(item => ({
        '사용자명': item.userName,
        '이메일': item.userEmail,
        '전화번호': item.userPhoneNumber,
        '티켓홀더': item.ticketHolder,
        '티켓수량': item.ticketCount,
        '티켓번호': item.ticketNumbers.join(', '),
        '상태': item.ticketStatuses.map(status => getStatusKorean(status)).join(', ')
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // 빈 행 제거 - 실제 데이터 범위만 설정 (헤더 포함)
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      ws['!ref'] = XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: range.e.c, r: excelData.length } // 헤더 포함하므로 +1
      });
      
      // 컬럼 너비 설정
      const colWidths = [
        { wch: 15 }, // 사용자명
        { wch: 25 }, // 이메일
        { wch: 15 }, // 전화번호
        { wch: 15 }, // 티켓홀더
        { wch: 10 }, // 티켓수량
        { wch: 20 }, // 티켓번호
        { wch: 10 }  // 상태
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, '티켓 목록');
    } catch (error) {
      throw error;
    }
  }

  // 파일명 생성
  const defaultFilename = `티켓목록_${new Date().toISOString().split('T')[0]}.xlsx`;
  const finalFilename = filename || defaultFilename;

  // 파일 다운로드
  XLSX.writeFile(wb, finalFilename);
};

// 상태를 한국어로 변환
const getStatusKorean = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'active': '사용 가능',
    'cancelled': '취소됨',
    'used': '사용 완료',
    'transferred': '양도됨',
    'cancel_requested': '취소 신청'
  };
  return statusMap[status] || status;
};
