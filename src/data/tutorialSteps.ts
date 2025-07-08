import { TutorialStep } from '@/components/tutorial/TutorialOverlay';

export const panelTutorialSteps: TutorialStep[] = [
  {
    id: 'panel-intro',
    target: '.panel-toggle-button', // TogglePanel의 버튼에 클래스 추가 필요
    title: '🎛️ 설정 패널',
    message: '여기가 모든 기능을 모아둔 설정 패널이에요! 다양한 기능들을 확인해보세요.',
    position: 'bottom-right'
  },
  {
    id: 'theme-buttons',
    target: '.theme-button-set', // ThemeButtonSet에 클래스 추가 필요
    title: '🎨 테마 변경',
    message: 'Normal, Dark, Neon 테마로 원하는 스타일로 변경할 수 있어요.',
    position: 'left'
  },
  {
    id: 'home-button',
    target: '.home-button', // PanelContent의 Home 버튼에 클래스 추가 필요
    title: '🏠 홈으로 이동',
    message: '언제든지 홈 화면으로 빠르게 이동할 수 있어요.',
    position: 'bottom'
  },
  {
    id: 'my-page-button',
    target: '.my-page-button', // PanelContent의 My 버튼에 클래스 추가 필요
    title: '👤 마이페이지',
    message: '내 정보와 예매 내역을 확인할 수 있어요.',
    position: 'bottom'
  },
  {
    id: 'logout-button',
    target: '.logout-button', // PanelContent의 Logout 버튼에 클래스 추가 필요
    title: '🚪 로그아웃',
    message: '안전하게 로그아웃할 수 있어요. 확인 후 로그아웃됩니다.',
    position: 'bottom'
  }
];

export const mainPageTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    target: 'body',
    title: '👋 환영합니다!',
    message: 'KIN 예매 서비스에 오신 것을 환영합니다! 화면 우하단에 있는 설정 패널을 확인해보세요.',
    position: 'top'
  },
  {
    id: 'panel-location',
    target: '.panel-toggle-button',
    title: '🎛️ 설정 패널',
    message: '여기가 설정 패널이에요! "KIN" 버튼을 클릭하면 다양한 기능을 사용할 수 있어요.',
    position: 'left'
  },
  {
    id: 'panel-features',
    target: 'body',
    title: '✨ 패널 기능들',
    message: '패널에서는 테마 변경, 홈 이동, 마이페이지, 로그아웃 등 다양한 기능을 사용할 수 있어요.',
    position: 'top'
  }
]; 