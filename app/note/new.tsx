import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import NoteEditor from '../../components/notes/NoteEditor';
import { getStore } from '../../store';
import { TABLES } from '../../lib/Tables';

export default function NewNoteScreen() {
	const store = getStore();
	const theme = useTheme();
	const [error, setError] = useState<string | null>(null);

	const handleCreateNote = (formData: any) => {
		if (!store) {
			setError('Store is not initialized');
			return;
		}

		try {
			const notesTable = store.getTable(TABLES.NOTES);
			if (!notesTable) {
				setError('Notes table not found');
				return;
			}

			const now = new Date().toISOString();
			const newId = uuidv4();

			notesTable[newId] = {
				title: formData.title,
				content: formData.content,
				tags: formData.tags || [],
				createdAt: now,
				updatedAt: now,
			};

			// Navigate back to the notes list
			router.back();
		} catch (error) {
			console.error('Error creating note:', error);
			setError('Failed to create note');
		}
	};

	return (
		<ScrollView style={styles.container}>
			<Card style={styles.card}>
				<Card.Content>
					<Text variant='titleLarge' style={styles.title}>
						Create New Note
					</Text>

					{error && <Text style={styles.errorText}>{error}</Text>}

					<NoteEditor onSave={handleCreateNote} />
				</Card.Content>
			</Card>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	card: {
		marginBottom: 16,
	},
	title: {
		fontWeight: 'bold',
		marginBottom: 16,
	},
	errorText: {
		color: 'red',
		marginBottom: 16,
	},
});
