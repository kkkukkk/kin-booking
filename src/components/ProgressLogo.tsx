'use client';

import Logo from './Logo';

interface ProgressLogoProps {
	steps: string[];
	currentStep: number;
}

const ProgressLogo = ({ steps, currentStep }: ProgressLogoProps) => {
	const totalSteps = steps.length;
	const clampedStep = Math.min(Math.max(currentStep, 0), totalSteps); // 0부터 totalSteps까지

	// 진행도 (0 ~ 1)
	const progress = totalSteps === 0 ? 0 : clampedStep / totalSteps;

	// 반시계 방향으로 채워지는 각도 계산
	// conic-gradient는 시계방향 기본, from -90deg로 12시 기준,
	// 반시계 방향이니까 각도를 360 - progress*360으로
	const fillAngle = 360 * (1 - progress);

	// 테두리 배경 conic-gradient 스타일 (회색 바탕 + 녹색~파랑 그라데이션)
	// 채워지는 부분은 360 - fillAngle ~ 360deg (즉 progress 만큼 반시계 방향으로 채워짐)
	const borderGradient = `conic-gradient(
    from -90deg,
    #d1d5db ${fillAngle}deg 360deg,
    #84cc16 ${fillAngle}deg ${fillAngle + 30}deg,
    #22c55e ${fillAngle + 30}deg ${fillAngle + 60}deg,
    #3b82f6 ${fillAngle + 60}deg 360deg
  )`;

	return (
		<div style={{ position: 'relative', display: 'inline-block' }}>
			{/* 테두리 역할 div, 로고보다 6px 크게 */}
			<div
				style={{
					position: 'absolute',
					top: -3,
					left: -3,
					width: 'calc(100% + 6px)',
					height: 'calc(100% + 6px)',
					borderRadius: 0, // 모서리 둥글게 안함
					background: borderGradient,
					pointerEvents: 'none',
					zIndex: 0,
					border: '3px solid transparent',
					backgroundClip: 'padding-box',
				}}
			/>
			{/* 로고 */}
			<div style={{ position: 'relative', zIndex: 1 }}>
				<Logo width={185} />
			</div>
		</div>
	);
};

export default ProgressLogo;