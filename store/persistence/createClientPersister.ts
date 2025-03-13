import * as SQLite from 'expo-sqlite';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite/with-schemas';
import { MergeableStore, OptionalSchemas } from 'tinybase/with-schemas';

// On a mobile client, use Expo's SQLite API to persist the store.
export const createClientPersister = <Schemas extends OptionalSchemas>(
	storeId: string,
	store: MergeableStore<Schemas>,
	initialValues: Record<string, any>[] = []
) => {
	const persister = createExpoSqlitePersister(
		store,
		SQLite.openDatabaseSync(storeId + '.db')
	);

	// Set initial values if provided
	initialValues.forEach((value) => {
		store.setRow('todos', value.id, value);
	});

	console.log('Initial values set:', store.getTable('todos'));

	return persister;
};
