import { DefaultTheme } from 'react-native-paper';

export const lightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#3498db',
		accent: '#f1c40f',
		background: '#ffffff',
		surface: '#f2f2f2',
		text: '#000000',
		textMuted: '#808080',
		textGrey: '#696f71',
		onSurfaceVariant: '#000000',
		border: '#f2f2f2',
		notification: '#3498db',
		card: '#f4f9fc',
	},
};

export const darkTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#3498db',
		accent: '#f1c40f',
		background: '#000000',
		surface: '#121212',
		text: '#ffffff',
		textMuted: '#333333',
		textGrey: '#808080',
		onSurfaceVariant: '#ffffff',
		border: '#121212',
		notification: '#3498db',
		card: '#121212',
	},
};

export type lightThemeTypes = typeof lightTheme;

export type darkThemeTypes = typeof darkTheme;
