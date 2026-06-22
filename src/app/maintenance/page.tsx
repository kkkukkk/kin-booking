import type { Metadata } from 'next';
import MaintenanceClient from './components/MaintenanceClient';

export const metadata: Metadata = {
	title: 'KIN — 준비 중',
	description: 'KIN 공연 예매 사이트를 준비하고 있습니다.',
	robots: { index: false, follow: false },
};

const MaintenancePage = () => {
	return <MaintenanceClient />;
};

export default MaintenancePage;
