import { DefaultTheme } from 'react-native-paper';

// Light Theme (Premium Slate)
export const lightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#2563EB', // vibrant blue
		accent: '#F59E0B',
		background: '#F8FAFC', // slate-50
		surface: '#FFFFFF',
		text: '#0F172A', // slate-900
		textMuted: '#64748B', // slate-500
		textGrey: '#475569', // slate-600
		onSurfaceVariant: '#334155', // slate-700
		border: '#E2E8F0', // slate-200
		notification: '#2563EB',
		card: '#FFFFFF',
		secondary: '#3B82F6',
		elevation: {
			level1: 'rgba(0,0,0,0.05)',
		},
	},
}

// Dark Theme (Premium Dark Slate)
export const darkTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#3B82F6', // lighter blue for dark mode
		accent: '#FBBF24',
		background: '#0F172A', // slate-900
		surface: '#1E293B', // slate-800
		text: '#F1F5F9', // slate-100
		textMuted: '#94A3B8', // slate-400
		textGrey: '#CBD5E1', // slate-300
		onSurfaceVariant: '#E2E8F0', // slate-200
		border: '#334155', // slate-700
		notification: '#3B82F6',
		card: '#1E293B',
		secondary: '#60A5FA',
		elevation: {
			level1: 'rgba(255,255,255,0.05)',
		},
	},
}

// Blue Theme
export const blueTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#2563eb',
		accent: '#3b82f6',
		background: '#f0f9ff',
		surface: '#e0f2fe',
		text: '#1e3a8a',
		textMuted: '#64748b',
		textGrey: '#475569',
		onSurfaceVariant: '#1e3a8a',
		border: '#bfdbfe',
		notification: '#2563eb',
		card: '#dbeafe',
		secondary: '#3b82f6',
	},
};

// Green Theme
export const greenTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#16a34a',
		accent: '#22c55e',
		background: '#f0fdf4',
		surface: '#dcfce7',
		text: '#14532d',
		textMuted: '#64748b',
		textGrey: '#475569',
		onSurfaceVariant: '#14532d',
		border: '#bbf7d0',
		notification: '#16a34a',
		card: '#d1fae5',
		secondary: '#22c55e',
	},
};

// Purple Theme
export const purpleTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#7c3aed',
		accent: '#a78bfa',
		background: '#faf5ff',
		surface: '#f3e8ff',
		text: '#4c1d95',
		textMuted: '#64748b',
		textGrey: '#475569',
		onSurfaceVariant: '#4c1d95',
		border: '#ddd6fe',
		notification: '#7c3aed',
		card: '#ede9fe',
		secondary: '#a78bfa',
	},
};

// Pink Theme
export const pinkTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#db2777',
		accent: '#ec4899',
		background: '#fdf2f8',
		surface: '#fce7f3',
		text: '#831843',
		textMuted: '#64748b',
		textGrey: '#475569',
		onSurfaceVariant: '#831843',
		border: '#fbcfe8',
		notification: '#db2777',
		card: '#fce7f3',
		secondary: '#ec4899',
	},
};

// Orange Theme
export const orangeTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#ea580c',
		accent: '#f97316',
		background: '#fff7ed',
		surface: '#ffedd5',
		text: '#7c2d12',
		textMuted: '#64748b',
		textGrey: '#475569',
		onSurfaceVariant: '#7c2d12',
		border: '#fed7aa',
		notification: '#ea580c',
		card: '#ffedd5',
		secondary: '#f97316',
	},
};

// Teal Theme
export const tealTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#0d9488',
		accent: '#14b8a6',
		background: '#f0fdfa',
		surface: '#ccfbf1',
		text: '#134e4a',
		textMuted: '#64748b',
		textGrey: '#475569',
		onSurfaceVariant: '#134e4a',
		border: '#99f6e4',
		notification: '#0d9488',
		card: '#ccfbf1',
		secondary: '#14b8a6',
	},
};

// Rose Theme
export const roseTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#e11d48',
		accent: '#f43f5e',
		background: '#fff1f2',
		surface: '#ffe4e6',
		text: '#881337',
		textMuted: '#64748b',
		textGrey: '#475569',
		onSurfaceVariant: '#881337',
		border: '#fecdd3',
		notification: '#e11d48',
		card: '#ffe4e6',
		secondary: '#f43f5e',
	},
};

export const themes = {
	light: lightTheme,
	dark: darkTheme,
	blue: blueTheme,
	green: greenTheme,
	purple: purpleTheme,
	pink: pinkTheme,
	orange: orangeTheme,
	teal: tealTheme,
	rose: roseTheme,
};

export type ThemeName = keyof typeof themes;

export type ThemeType = typeof lightTheme;

export type lightThemeTypes = typeof lightTheme;

export type darkThemeTypes = typeof darkTheme;
