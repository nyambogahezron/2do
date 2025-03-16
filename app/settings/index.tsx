import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import {
	List,
	Switch,
	Divider,
	Button,
	Dialog,
	Portal,
	Text,
	useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme as ThemeContext } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
	const theme = useTheme();
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [syncEnabled, setSyncEnabled] = useState(false);
	const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);
	const { toggleTheme, theme: currentTheme, themeClrs } = ThemeContext();

	const toggleDarkMode = () => {
		toggleTheme();
	};

	const toggleNotifications = () => {
		setNotificationsEnabled(!notificationsEnabled);
		// Here you would handle notification permissions
	};

	const toggleSync = () => {
		setSyncEnabled(!syncEnabled);
		// Here you would handle cloud sync setup
	};

	const showClearDataDialog = () => {
		setClearDataDialogVisible(true);
	};

	const hideClearDataDialog = () => {
		setClearDataDialogVisible(false);
	};

	const handleClearAllData = async () => {};

	const handleExportData = () => {};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar
				style={currentTheme === 'light' ? 'dark' : 'light'}
				backgroundColor={themeClrs.colors.background}
			/>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: 'Settings',
					headerTitleAlign: 'center',
					headerShadowVisible: false,
					headerStyle: {
						backgroundColor: themeClrs.colors.background,
					},
					headerTintColor: themeClrs.colors.secondary,
					headerTitleStyle: {
						fontWeight: 'bold',
						color: themeClrs.colors.text,
					},
					headerLeft: () => (
						<Ionicons
							onPress={() => router.back()}
							name='arrow-back'
							size={24}
							color={themeClrs.colors.secondary}
							style={{ marginLeft: 16 }}
						/>
					),
				}}
			/>
			<ScrollView
				style={{
					marginTop: Platform.OS === 'ios' ? 0 : -50,
					paddingHorizontal: 8,
					backgroundColor: themeClrs.colors.background,
				}}
			>
				<List.Section>
					<List.Subheader>Appearance</List.Subheader>
					<List.Item
						titleStyle={{
							color: themeClrs.colors.textGrey,
							marginBottom: 10,
						}}
						title='Dark Mode'
						description='Enable dark theme'
						left={(props) => <List.Icon {...props} icon='theme-light-dark' />}
						right={(props) => (
							<Switch
								value={currentTheme === 'light' ? false : true}
								onValueChange={toggleDarkMode}
							/>
						)}
					/>
					<Divider />
					<List.Subheader style={{ marginTop: 20 }}>
						Notifications
					</List.Subheader>
					<List.Item
						titleStyle={{
							color: themeClrs.colors.textGrey,
							marginBottom: 10,
						}}
						title='Enable Notifications'
						description='Get reminded of upcoming tasks'
						left={(props) => <List.Icon {...props} icon='bell-outline' />}
						right={(props) => (
							<Switch
								value={notificationsEnabled}
								onValueChange={toggleNotifications}
							/>
						)}
					/>
					<Divider />
					<List.Subheader style={{ marginTop: 20 }}>Data</List.Subheader>
					<List.Item
						titleStyle={{ color: themeClrs.colors.textGrey, marginBottom: 10 }}
						title='Cloud Sync'
						description='Sync your data across devices'
						left={(props) => <List.Icon {...props} icon='cloud-sync-outline' />}
						right={(props) => (
							<Switch value={syncEnabled} onValueChange={toggleSync} />
						)}
					/>
					<List.Item
						titleStyle={{ color: themeClrs.colors.textGrey, marginBottom: 10 }}
						title='Export Data'
						description='Save your data as a file'
						left={(props) => <List.Icon {...props} icon='export' />}
						onPress={handleExportData}
					/>
					<List.Item
						titleStyle={{ color: themeClrs.colors.textGrey, marginBottom: 10 }}
						title='Clear All Data'
						description='Remove all your data from this device'
						left={(props) => (
							<List.Icon {...props} icon='delete' color={theme.colors.error} />
						)}
						onPress={showClearDataDialog}
					/>
				</List.Section>
				<List.Section>
					<List.Subheader style={{ marginTop: 20 }}>About</List.Subheader>
					<List.Item
						titleStyle={{
							color: themeClrs.colors.textGrey,
							marginBottom: 10,
						}}
						title='Version'
						description='1.0.0'
						left={(props) => (
							<List.Icon {...props} icon='information-outline' />
						)}
					/>

					<List.Item
						titleStyle={{
							color: themeClrs.colors.textGrey,
							marginBottom: 10,
						}}
						title='Share App'
						left={(props) => (
							<List.Icon {...props} icon='share-variant-outline' />
						)}
					/>
					<List.Item
						titleStyle={{
							color: themeClrs.colors.textGrey,
							marginBottom: 10,
						}}
						title='Rate us'
						left={(props) => <List.Icon {...props} icon='star-plus-outline' />}
					/>
				</List.Section>
			</ScrollView>

			<Portal>
				<Dialog
					visible={clearDataDialogVisible}
					onDismiss={hideClearDataDialog}
					style={{ backgroundColor: theme.colors.background, borderRadius: 10 }}
				>
					<Dialog.Title style={{ color: themeClrs.colors.textGrey }}>
						Clear All Data
					</Dialog.Title>
					<Dialog.Content>
						<Text variant='bodyMedium' style={{ color: themeClrs.colors.text }}>
							This will permanently delete all your todos, shopping lists, and
							notes. This action cannot be undone.
						</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideClearDataDialog}>Cancel</Button>
						<Button onPress={handleClearAllData} textColor={theme.colors.error}>
							Clear Data
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
