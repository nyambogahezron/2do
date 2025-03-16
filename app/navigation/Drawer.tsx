import React from 'react';
import {
	DrawerContentScrollView,
	DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Title, Drawer } from 'react-native-paper';
import CustomDrawerItem from './CustomDrawerItem';

const height = Dimensions.get('window').height;
interface CustomDrawerContentProps extends DrawerContentComponentProps {}

export default function DrawerContent(props: CustomDrawerContentProps) {
	const routes = props.state.routeNames;

	const routeCurrentIndex = props.state.index;
	const active = routes[routeCurrentIndex];

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
					<CustomDrawerItem label='Profile' route='Profile' active={active} />
					<CustomDrawerItem label='Settings' route='Settings' active={active} />
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
});
