'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/base/Button';
import ThemeDiv from '@/components/base/ThemeDiv';
import Spinner from '@/components/spinner/Spinner';
import useToast from '@/hooks/useToast';
import { fetchSiteMaintenanceEnabled, setSiteMaintenanceEnabled } from '@/api/appSettings';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

export default function MaintenanceModeManager() {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { showToast } = useToast();
	const [enabled, setEnabled] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const loadMaintenanceMode = useCallback(async () => {
		try {
			setLoading(true);
			const isEnabled = await fetchSiteMaintenanceEnabled();
			setEnabled(isEnabled);
		} catch (error) {
			console.error('점검 모드 로드 실패:', error);
			showToast({ message: '점검 모드 설정을 불러오지 못했습니다.', iconType: 'error', autoCloseTime: 3000 });
		} finally {
			setLoading(false);
		}
	}, [showToast]);

	useEffect(() => {
		loadMaintenanceMode();
	}, [loadMaintenanceMode]);

	const handleToggle = async () => {
		const next = !enabled;
		if (next && !window.confirm('점검 모드를 켜면 일반 사용자는 /maintenance로 이동합니다. 계속할까요?')) {
			return;
		}

		try {
			setSaving(true);
			await setSiteMaintenanceEnabled(next);
			setEnabled(next);
			showToast({
				message: next ? '점검 모드를 켰습니다.' : '점검 모드를 껐습니다.',
				iconType: 'success',
				autoCloseTime: 3000,
			});
		} catch (error) {
			console.error('점검 모드 저장 실패:', error);
			showToast({ message: '점검 모드 저장에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Spinner size={48} color="var(--neon-green)" />
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6"
		>
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-[var(--neon-green)]">사이트 점검 모드</h2>
				<Button
					onClick={handleToggle}
					theme={theme}
					reverse={enabled}
					className="font-semibold px-4 py-2"
					disabled={saving}
				>
					{saving ? '저장 중...' : enabled ? '점검 끄기' : '점검 켜기'}
				</Button>
			</div>

			<ThemeDiv className="rounded-lg p-6 space-y-4">
				<div className="flex items-center gap-3">
					<span
						className={`inline-block h-3 w-3 rounded-full ${enabled ? 'bg-red-500' : 'bg-[var(--neon-green)]'}`}
					/>
					<span className="text-lg font-medium text-gray-200">
						{enabled ? '점검 중' : '정상 운영'}
					</span>
				</div>
				<p className="text-sm text-gray-400">
					켜면 일반 사용자는 /maintenance로 이동합니다. /admin, /login, /auth 경로는 계속 접근할 수 있습니다.
				</p>
				<p className="text-xs text-gray-500">
					비상 차단: Vercel 환경변수 MAINTENANCE_FORCE=true (DB 설정보다 우선)
				</p>
			</ThemeDiv>
		</motion.div>
	);
}
