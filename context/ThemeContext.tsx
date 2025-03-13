import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '../constants/Colors';

const ThemeContext = createContext({
	theme: 'light',
	toggleTheme: () => {},
	themeClrs: {
		colors: lightTheme.colors,
	},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const deviceTheme = useColorScheme();
	const [theme, setTheme] = useState<string>(deviceTheme || 'light');

	useEffect(() => {
		const loadTheme = async () => {
			const storedTheme = await AsyncStorage.getItem('user-theme');
			if (storedTheme) {
				setTheme(storedTheme);
			} else {
				setTheme(deviceTheme || 'light');
			}
		};
		loadTheme();
	}, [deviceTheme]);

	const toggleTheme = async () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		await AsyncStorage.setItem('user-theme', newTheme);
	};

	const themeClrs = theme === 'light' ? lightTheme : darkTheme;

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, themeClrs }}>
			<PaperProvider theme={themeClrs}>{children}</PaperProvider>
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
