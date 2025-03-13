import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Menu, useTheme } from 'react-native-paper';
import { List } from 'lucide-react-native';

type MenuListProps = {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MenuList({ visible, setVisible }: MenuListProps) {
	const theme = useTheme();

	const closeMenu = () => setVisible(false);
	return (
		<View style={styles.popupMenu}>
			<Menu
				style={{ backgroundColor: theme.colors.surface, marginTop: 75 }}
				visible={visible}
				onDismiss={closeMenu}
				anchor={<List color={theme.dark ? '#fff' : '#000'} size={22} />}
			>
				<Menu.Item
					leadingIcon='format-list-bulleted'
					onPress={() => {}}
					title='list'
				/>
				<Menu.Item leadingIcon='grid' onPress={() => {}} title='Grid' />
			</Menu>
		</View>
	);
}

const styles = StyleSheet.create({
	popupMenu: {
		flex: 1,
		justifyContent: 'center',
	},
	menuItem: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	menuText: {
		color: '#fff',
		fontSize: 16,
	},
	menuActive: {
		color: 'yellow',
	},
});
