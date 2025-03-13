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
		onSurfaceVariant: '#000000',
		card: '#f2f2f2',
		border: '#f2f2f2',
		notification: '#3498db',
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
		onSurfaceVariant: '#ffffff',
		card: '#121212',
		border: '#121212',
		notification: '#3498db',
	},
};

export type lightThemeTypes = typeof lightTheme;

export type darkThemeTypes = typeof darkTheme;
