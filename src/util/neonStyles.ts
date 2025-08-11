import { NeonVariant } from '@/types/ui/neonVariant';

// Neon 테두리 색상 가져오기
export const getNeonBorderColor = (neonVariant: NeonVariant) => {
	const colors = {
		green: 'border-[var(--neon-green)]/40',
		cyan: 'border-[var(--neon-cyan)]/50',
		magenta: 'border-[var(--neon-magenta)]/50',
		pink: 'border-[var(--neon-pink)]/50',
		blue: 'border-[var(--neon-blue)]/50',
		yellow: 'border-[var(--neon-yellow)]/50',
		purple: 'border-[var(--neon-purple)]/50'
	};
	return colors[neonVariant] || colors.green;
};

// Neon shadow 색상 가져오기 (on 상태용)
export const getNeonShadowColor = (neonVariant: NeonVariant) => {
	switch (neonVariant) {
		case 'green':
			return 'shadow-[0_0_4px_var(--neon-green-medium),0_0_12px_var(--neon-green-light),0_0_16px_var(--neon-green-faint)]';
		case 'cyan':
			return 'shadow-[0_0_4px_var(--neon-cyan-medium),0_0_12px_var(--neon-cyan-light),0_0_16px_var(--neon-cyan-faint)]';
		case 'magenta':
			return 'shadow-[0_0_4px_var(--neon-magenta-medium),0_0_12px_var(--neon-magenta-light),0_0_16px_var(--neon-magenta-faint)]';
		case 'pink':
			return 'shadow-[0_0_4px_var(--neon-pink-medium),0_0_12px_var(--neon-pink-light),0_0_16px_var(--neon-pink-faint)]';
		case 'blue':
			return 'shadow-[0_0_4px_var(--neon-blue-medium),0_0_12px_var(--neon-blue-light),0_0_16px_var(--neon-blue-faint)]';
		case 'yellow':
			return 'shadow-[0_0_4px_var(--neon-yellow-medium),0_0_12px_var(--neon-yellow-light),0_0_16px_var(--neon-yellow-faint)]';
		case 'purple':
			return 'shadow-[0_0_4px_var(--neon-purple-medium),0_0_12px_var(--neon-purple-light),0_0_16px_var(--neon-purple-faint)]';
		default:
			return 'shadow-[0_0_4px_var(--neon-green-medium),0_0_12px_var(--neon-green-light),0_0_16px_var(--neon-green-faint)]';
	}
};

// Neon hover shadow 색상 가져오기
export const getNeonHoverShadowColor = (neonVariant: NeonVariant) => {
	switch (neonVariant) {
		case 'green':
			return 'hover:shadow-[0_0_4px_var(--neon-green-medium),0_0_12px_var(--neon-green-light),0_0_16px_var(--neon-green-faint)]';
		case 'cyan':
			return 'hover:shadow-[0_0_4px_var(--neon-cyan-medium),0_0_12px_var(--neon-cyan-light),0_0_16px_var(--neon-cyan-faint)]';
		case 'magenta':
			return 'hover:shadow-[0_0_4px_var(--neon-magenta-medium),0_0_12px_var(--neon-magenta-light),0_0_16px_var(--neon-magenta-faint)]';
		case 'pink':
			return 'hover:shadow-[0_0_4px_var(--neon-pink-medium),0_0_12px_var(--neon-pink-light),0_0_16px_var(--neon-pink-faint)]';
		case 'blue':
			return 'hover:shadow-[0_0_4px_var(--neon-blue-medium),0_0_12px_var(--neon-blue-light),0_0_16px_var(--neon-blue-faint)]';
		case 'yellow':
			return 'hover:shadow-[0_0_4px_var(--neon-yellow-medium),0_0_12px_var(--neon-yellow-light),0_0_16px_var(--neon-yellow-faint)]';
		case 'purple':
			return 'hover:shadow-[0_0_4px_var(--neon-purple-medium),0_0_12px_var(--neon-purple-light),0_0_16px_var(--neon-purple-faint)]';
		default:
			return 'hover:shadow-[0_0_4px_var(--neon-green-medium),0_0_12px_var(--neon-green-light),0_0_16px_var(--neon-green-faint)]';
	}
}; 