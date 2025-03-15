import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Menu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import MenuList from './Menu';
import { useTheme } from '@/context/ThemeContext';

type CustomHeaderProps = {
	setMenuVisible: (visible: boolean) => void;
	menuVisible: boolean;
	title?: string;
	showMenu?: boolean;
};

export default function CustomHeader({
	setMenuVisible,
	menuVisible,
	title = 'Todos',
	showMenu = false,
}: CustomHeaderProps) {
	const { themeClrs } = useTheme();
	const [visible, setVisible] = React.useState(false);
	const navigation = useNavigation<any>();
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
				{showMenu && (
					<TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
						<MenuList
							visible={visible}
							setVisible={() => setVisible(!visible)}
						/>
					</TouchableOpacity>
				)}

				<TouchableOpacity onPress={() => navigation.toggleDrawer()}>
					<Menu color={themeClrs.colors.text} size={24} />
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
