import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Settings } from 'lucide-react-native';

import { router } from 'expo-router';
import MenuList from './Menu';
import { useTheme } from '@/context/ThemeContext';

type CustomHeaderProps = {
	setMenuVisible: (visible: boolean) => void;
	menuVisible: boolean;
	title?: string;
};

export default function CustomHeader({
	setMenuVisible,
	menuVisible,
	title = 'Todos',
}: CustomHeaderProps) {
	const { themeClrs } = useTheme();
	const [visible, setVisible] = React.useState(false);
	return (
		<View
			style={[styles.header, { backgroundColor: themeClrs.colors.background }]}
		>
			<Text
				style={[
					styles.headerText,
					{
						color: themeClrs.colors.accent,
					},
				]}
			>
				{title}
			</Text>
			<View style={styles.iconContainer}>
				<TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
					<MenuList visible={visible} setVisible={() => setVisible(!visible)} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => router.push('settings')}>
					<Settings color={themeClrs.colors.text} size={22} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 10,
		height: 85,
		paddingTop: 45,
	},
	headerText: {
		fontSize: 25,
		fontWeight: 'bold',
	},
	iconContainer: {
		flexDirection: 'row',
		gap: 20,
	},
});
