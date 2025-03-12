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

export default function SettingsScreen() {
	const theme = useTheme();
	const [darkMode, setDarkMode] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [syncEnabled, setSyncEnabled] = useState(false);
	const [clearDataDialogVisible, setClearDataDialogVisible] = useState(false);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
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
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: 'Settings',
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: theme.colors.surface,
					},
					headerTintColor: theme.colors.secondary,
					headerTitleStyle: { fontWeight: 'bold' },
					headerLeft: () => (
						<Ionicons
							onPress={() => router.canGoBack()}
							name='arrow-back'
							size={24}
							color={theme.colors.secondary}
							style={{ marginLeft: 16 }}
						/>
					),
				}}
			/>
			<ScrollView
				style={{
					marginTop: Platform.OS === 'ios' ? 0 : -50,
				}}
			>
				<List.Section>
					<List.Subheader>Appearance</List.Subheader>
					<List.Item
						title='Dark Mode'
						description='Enable dark theme'
						left={(props) => <List.Icon {...props} icon='theme-light-dark' />}
						right={(props) => (
							<Switch value={darkMode} onValueChange={toggleDarkMode} />
						)}
					/>
					<Divider />
					<List.Subheader style={{ marginTop: 20 }}>
						Notifications
					</List.Subheader>
					<List.Item
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
						title='Cloud Sync'
						description='Sync your data across devices'
						left={(props) => <List.Icon {...props} icon='cloud-sync' />}
						right={(props) => (
							<Switch value={syncEnabled} onValueChange={toggleSync} />
						)}
					/>
					<List.Item
						title='Export Data'
						description='Save your data as a file'
						left={(props) => <List.Icon {...props} icon='export' />}
						onPress={handleExportData}
					/>
					<List.Item
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
						title='Version'
						description='1.0.0'
						left={(props) => <List.Icon {...props} icon='information' />}
					/>
				</List.Section>
			</ScrollView>

			<Portal>
				<Dialog
					visible={clearDataDialogVisible}
					onDismiss={hideClearDataDialog}
				>
					<Dialog.Title>Clear All Data</Dialog.Title>
					<Dialog.Content>
						<Text variant='bodyMedium'>
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
