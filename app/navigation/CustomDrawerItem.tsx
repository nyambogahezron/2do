import React from 'react';
import { DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './screens';
import {
	ListTodo,
	NotebookText,
	ShoppingCart,
	Settings,
} from 'lucide-react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/context/ThemeContext'

interface CustomDrawerItemProps {
	label: string;
	route: string;
	active: string;
}

const CustomDrawerItem: React.FC<CustomDrawerItemProps> = ({
	label,
	route,
	active,
}) => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { themeClrs } = useTheme()

	const isActive = active === route
	const activeColor = themeClrs.colors.primary
	const inactiveColor = themeClrs.colors.onSurfaceVariant
	const iconClr = isActive ? activeColor : inactiveColor

	const getIcon = (route: string, color: string, size: number) => {
		switch (route) {
			case 'Home':
				return <ListTodo color={color} size={size} />
			case 'ShoppingList':
				return <ShoppingCart color={color} size={size} />
			case 'Notes':
				return <NotebookText color={color} size={size} />
			case 'Settings':
				return <Settings color={color} size={size} />
			case 'Theme':
				return <Icon name='palette' color={color} size={size} />
			case 'Widget':
				return <Icon name='widgets' color={color} size={size} />
			case 'Donate':
				return <Icon name='heart-outline' color={color} size={size} />
			case 'Profile':
				return <Icon name='account' color={color} size={size} />
			default:
				return null
		}
	}

	return (
		<DrawerItem
			icon={({ color, size }) => getIcon(route, iconClr, size)}
			label={label}
			labelStyle={{
				color: isActive ? activeColor : inactiveColor,
				fontWeight: isActive ? 'bold' : 'normal',
			}}
			onPress={() => navigation.navigate(route as keyof RootStackParamList)}
			activeTintColor={themeClrs.colors.secondary} // Background highlight color
			activeBackgroundColor={themeClrs.colors.secondary + '20'} // 20 hex = 12% opacity
			focused={isActive}
			style={{ borderRadius: 8 }}
		/>
	)
};

export default CustomDrawerItem;
