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
	},
};
