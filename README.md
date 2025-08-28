# 🎫 KIN Booking - 공연 예약 플랫폼

## ✨ 주요 기능

### 🎭 공연 관리
- 공연 생성 및 편집
- 공연 정보 및 설명
- 공연 검색 및 필터링

### 🎟️ 예약 시스템
- 예약 프로세스 (예약 → 승인(관리자) → 확정)
- 실시간 좌석 선택
- 결제 정보 관리
- 예약 내역 조회

### 👥 사용자 관리
- 친구 추가 및 티켓 양도
- 사용자 프로필 관리
- 역할 기반 권한 관리

### 🎫 티켓 시스템
- QR 코드 기반 티켓
- 티켓 양도 및 환불
- 티켓 전송 히스토리
- 입장 체크 시스템

### 📊 관리자 대시보드
- 공연 통계 및 분석
- 예약 현황
- 사용자 관리
- 결제 내역 관리
- 앱 설정 관리 (배경 이미지 등)

## 🛠️ 기술 스택

### Frontend
- **Next.js 15** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS 4** - 유틸리티 기반 CSS 프레임워크
- **Redux Toolkit** - 상태 관리
- **React Query** - 서버 상태 관리
- **Framer Motion** - 애니메이션

### Backend & Database
- **Supabase** - 백엔드 서비스 및 데이터베이스
- **PostgreSQL** - 관계형 데이터베이스

## 📱 주요 페이지

- **홈페이지** (`/`) - 메인 이벤트 목록
- **공연 상세** (`/events`) - 공연 정보 및 예약
- **로그인** (`/login`) - 사용자 인증
- **마이페이지** (`/my`) - 개인 정보 및 예약 내역
- **관리자** (`/admin`) - 이벤트 및 사용자 관리, 앱 설정 관리

## 🔒 보안 기능

- Row Level Security (RLS)

### 앱 설정 관리
- 관리자 페이지 (`/admin/settings`)에서 전역 설정을 관리할 수 있습니다.
- 배경 이미지 URL을 변경하면 즉시 반영됩니다.
- 로그인 슬라이드 이미지를 추가/수정/삭제하고 순서를 조정할 수 있습니다.
- 캐시 문제 없이 동적으로 설정을 관리할 수 있습니다.

## 📊 성능 최적화

- CSS 최적화 및 번들링
- 이미지 최적화
- 코드 스플리팅

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - 훌륭한 React 프레임워크
- [Supabase](https://supabase.com/) - 백엔드 서비스
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Vercel](https://vercel.com/) - 배포 플랫폼

---

**KIN Booking**
