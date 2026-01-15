import React from 'react';
import {
	DrawerContentScrollView,
	DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Title, Drawer } from 'react-native-paper';
import CustomDrawerItem from './CustomDrawerItem';

import { useTheme } from '@/context/ThemeContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const height = Dimensions.get('window').height;
interface CustomDrawerContentProps extends DrawerContentComponentProps {}

export default function DrawerContent(props: CustomDrawerContentProps) {
	const routes = props.state.routeNames;
	const { themeClrs } = useTheme()

	const routeCurrentIndex = props.state.index;
	const active = routes[routeCurrentIndex];

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={{ paddingTop: 0 }}
			style={{
				flex: 1,
				backgroundColor: themeClrs.colors.surface,
			}}
		>
			<SafeAreaView
				edges={['top']}
				style={{
					backgroundColor: themeClrs.colors.surface,
					flex: 1,
				}}
			>
				<View style={styles.drawerContent}>
					{/* Header Section */}
					<View style={styles.userInfoSection}>
						<Title
							style={[styles.title, { color: themeClrs.colors.onSurface }]}
						>
							TODO
						</Title>
					</View>

					{/* Drawer Items */}
					<Drawer.Section>
						<CustomDrawerItem label='Todos' route='Home' active={active} />
						<CustomDrawerItem
							label='Shopping List'
							route='ShoppingList'
							active={active}
						/>
						<CustomDrawerItem label='Notes' route='Notes' active={active} />
					</Drawer.Section>
					<Drawer.Section>
						<CustomDrawerItem label='Theme' route='Theme' active={active} />
						<CustomDrawerItem label='Widget' route='Widget' active={active} />
						<CustomDrawerItem label='Donate' route='Donate' active={active} />
					</Drawer.Section>
					{/* Bottom Section */}
					<Drawer.Section showDivider={false} style={{ marginTop: 20 }}>
						<CustomDrawerItem
							label='Settings'
							route='Settings'
							active={active}
						/>
					</Drawer.Section>
				</View>
			</SafeAreaView>
		</DrawerContentScrollView>
	)
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		paddingLeft: 20,
		marginBottom: 20,
		marginTop: 20,
		justifyContent: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		fontFamily: 'sans-serif-medium', // Or a custom font if available
	},
})
