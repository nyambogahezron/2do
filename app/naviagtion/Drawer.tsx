import React from 'react';
import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Title, Drawer } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import {
	ListTodo,
	NotebookText,
	Settings,
	ShoppingCart,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../_layout';

const height = Dimensions.get('window').height;
interface CustomDrawerContentProps extends DrawerContentComponentProps {}

export default function DrawerContent(props: CustomDrawerContentProps) {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const routes = props.state.routeNames;
	const routeCurrentIndex = props.state.index;
	const active = routes[routeCurrentIndex];

	console.log('active', active);
	const isActivate = (routeName: string) => {
		return active === routeName;
	};

	return (
		<DrawerContentScrollView
			{...props}
			style={{ paddingTop: 0, borderRadius: 0 }}
		>
			<View style={styles.drawerContent}>
				{/* Header Section */}
				<View style={styles.userInfoSection}>
					<Title style={styles.title}>TODO</Title>
				</View>

				{/* Drawer Items */}
				<Drawer.Section>
					<DrawerItem
						icon={({ color, size }) => (
							<ListTodo
								color={active === 'Home' ? '#f1c40f' : color}
								size={size}
							/>
						)}
						label='Todos'
						labelStyle={{ color: active === 'Home' ? '#333' : '#888' }}
						onPress={() => navigation.navigate('Home')}
						activeTintColor={active === 'Home' ? 'yellow' : 'black'}
						pressColor='transparent'
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<ShoppingCart
								color={active === 'ShoppingList' ? '#f1c40f' : color}
								size={size}
							/>
						)}
						label='Shopping List'
						labelStyle={{ color: active === 'ShoppingList' ? '#333' : '#888' }}
						onPress={() => navigation.navigate('ShoppingList')}
						activeTintColor='yellow'
						pressColor='transparent'
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<NotebookText
								color={active === 'Notes' ? '#f1c40f' : color}
								size={size}
							/>
						)}
						label='Notes'
						labelStyle={{ color: active === 'Notes' ? '#333' : '#888' }}
						onPress={() => navigation.navigate('Notes')}
						activeTintColor='yellow'
						pressColor='transparent'
					/>
				</Drawer.Section>
				<Drawer.Section>
					<DrawerItem
						icon={({ color, size }) => (
							<Icon name='palette' color={color} size={size} />
						)}
						label='Theme'
						onPress={() => {}}
						activeTintColor='yellow'
						pressColor='transparent'
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<Icon name='widgets' color={color} size={size} />
						)}
						label='Widget'
						onPress={() => {}}
						activeTintColor='yellow'
						pressColor='transparent'
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<Icon name='heart-outline' color={color} size={size} />
						)}
						label='Donate'
						onPress={() => {}}
						activeTintColor='yellow'
						pressColor='transparent'
					/>
				</Drawer.Section>
				{/* Bottom Section */}

				<Drawer.Section showDivider={false} style={{ marginTop: 20 }}>
					<DrawerItem
						icon={({ color, size }) => (
							<Icon name='account' color={color} size={size} />
						)}
						label='Profile'
						onPress={() => {}}
						activeTintColor='yellow'
						pressColor='transparent'
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<Settings
								color={active === 'Settings' ? '#f1c40f' : color}
								size={size}
							/>
						)}
						label='Settings'
						labelStyle={{ color: active === 'Settings' ? '#333' : '#888' }}
						onPress={() => navigation.navigate('Settings')}
						activeTintColor='yellow'
						pressColor='transparent'
					/>
				</Drawer.Section>
			</View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
		backgroundColor: '#f4f4f4',
		height: height,
		width: '100%',
	},
	userInfoSection: { paddingLeft: 20, marginBottom: 20, marginTop: 20 },

	title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
	homeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	homeText: { fontSize: 24, fontWeight: 'bold' },
});
