import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Settings } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import MenuList from './Menu';

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
	const theme = useTheme();
	const [visible, setVisible] = React.useState(false);
	return (
		<View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
			<Text
				style={[
					styles.headerText,
					{
						color: theme.colors.primary,
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
					<Settings color={theme.dark ? '#fff' : '#000'} size={22} />
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
		backgroundColor: '#fff',
	},
	headerText: {
		fontSize: 28,
		fontWeight: 'bold',
	},
	iconContainer: {
		flexDirection: 'row',
		gap: 20,
	},
});
