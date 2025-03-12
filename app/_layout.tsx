import React from 'react';
import { Provider } from 'tinybase/ui-react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { initializeStore } from '../store';
import { Store } from 'tinybase/store';

export default function Layout() {
	const [store, setStore] = React.useState<Store | undefined>(undefined);

	React.useEffect(() => {
		(async () => {
			const store = await initializeStore();
			setStore(store);
		})();
	}, []);

	return (
		<ThemeProvider>
			<Provider store={store}>
				<Stack>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen name='settings' options={{ headerShown: true }} />
				</Stack>
			</Provider>
		</ThemeProvider>
	);
}
