import { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const panelTutorialSteps: TutorialStep[] = [
  {
    id: 'panel-intro',
    target: '.panel-toggle-button',
    title: '설정 패널',
    message: '여기가 모든 기능을 모아둔 설정 패널이에요! 다양한 기능들을 확인해보세요.',
    position: 'bottom-right'
  },
  {
    id: 'theme-buttons',
    target: '.theme-button-set',
    title: '테마 변경',
    message: 'Normal, Dark, Neon 테마로 원하는 스타일로 변경할 수 있어요.',
    position: 'left'
  },
  {
    id: 'home-button',
    target: '.home-button',
    title: '홈으로 이동',
    message: '언제든지 홈 화면으로 빠르게 이동할 수 있어요.',
    position: 'bottom'
  },
  {
    id: 'my-page-button',
    target: '.my-page-button',
    title: '마이페이지',
    message: '내 정보와 예매 내역을 확인할 수 있어요.',
    position: 'bottom'
  },
  {
    id: 'logout-button',
    target: '.logout-button',
    title: '로그아웃',
    message: '안전하게 로그아웃할 수 있어요. 확인 후 로그아웃됩니다.',
    position: 'bottom'
  }
];

export const mainPageTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    target: 'body',
    message: 'KIN을 찾아주셔서 감사합니다!\n유용한 기능 하나를 소개해 드릴게요!',
    position: 'top'
  },
  {
    id: 'panel-location',
    target: '.panel-toggle-button',
    message: '오른쪽 아래 "KIN" 버튼 보이시나요?\n여기가 기능 패널이에요!',
    position: 'left'
  },
  {
    id: 'panel-features',
    target: '.panel-toggle-button',
    message: '테마 변경, 페이지 이동, 로그아웃 등\n여러 기능들을 유용하게 사용해보세요!',
    position: 'top'
  }
]; 