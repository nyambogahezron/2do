import React from 'react';
import {
	FlatList,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
} from 'react-native'
import { Chip } from 'react-native-paper'
import { useTheme } from '../../context/ThemeContext'
import { formatDate } from '../../utils/dateUtils'
import { Note } from '../../store/models'
import Animated, { FadeInDown, Layout } from 'react-native-reanimated'

interface NotesListProps {
	notes: Note[]
	onPress: (id: string) => void
}

const NotesList: React.FC<NotesListProps> = ({ notes, onPress }) => {
	const { themeClrs } = useTheme()

	const renderNoteItem = ({ item, index }: { item: Note; index: number }) => {
		// Strip HTML tags for preview (basic)
		const contentPreview =
			item.content
				.replace(/<[^>]*>/g, ' ')
				.replace(/\s+/g, ' ')
				.trim()
				.substring(0, 100) + (item.content.length > 100 ? '...' : '')

		return (
			<Animated.View
				entering={FadeInDown.delay(index * 50).springify()}
				layout={Layout.springify()}
				style={[
					styles.cardContainer,
					{
						backgroundColor: themeClrs.colors.surface,
						borderColor: themeClrs.colors.outlineVariant || '#e0e0e0', // Fallback
					},
				]}
			>
				<TouchableOpacity
					onPress={() => onPress(item.id)}
					activeOpacity={0.7}
					style={styles.cardContent}
				>
					<Text
						style={[styles.noteTitle, { color: themeClrs.colors.text }]}
						numberOfLines={1}
					>
						{item.title}
					</Text>

					<Text
						style={[
							styles.notePreview,
							{ color: themeClrs.colors.onSurfaceVariant },
						]}
						numberOfLines={2}
					>
						{contentPreview}
					</Text>

					<View style={styles.noteFooter}>
						<Text
							style={[styles.noteDate, { color: themeClrs.colors.outline }]}
						>
							{formatDate(item.updatedAt)}
						</Text>

						{item.tags &&
							(() => {
								const parsedTags =
									typeof item.tags === 'string'
										? JSON.parse(item.tags)
										: item.tags
								return (
									parsedTags.length > 0 && (
										<View style={styles.tagsContainer}>
											{parsedTags
												.slice(0, 2)
												.map((tag: string, index: number) => (
													<View
														key={index}
														style={[
															styles.miniTag,
															{
																backgroundColor:
																	themeClrs.colors.secondaryContainer ||
																	'#f0f0f0',
															},
														]}
													>
														<Text
															style={[
																styles.miniTagText,
																{
																	color:
																		themeClrs.colors.onSecondaryContainer ||
																		'#333',
																},
															]}
														>
															{tag}
														</Text>
													</View>
												))}
											{parsedTags.length > 2 && (
												<Text
													style={[
														styles.moreTags,
														{ color: theme.colors.outline },
													]}
												>
													+{parsedTags.length - 2}
												</Text>
											)}
										</View>
									)
								)
							})()}
					</View>
				</TouchableOpacity>
			</Animated.View>
		)
	}

	return (
		<FlatList
			data={notes}
			renderItem={renderNoteItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContainer}
			ItemSeparatorComponent={() => <View style={styles.separator} />}
		/>
	)
}

const styles = StyleSheet.create({
	listContainer: {
		padding: 16,
		paddingBottom: 100, // Space for FAB
	},
	cardContainer: {
		borderRadius: 16,
		borderWidth: 1,
		overflow: 'hidden',
		// Shadow/Elevation
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	cardContent: {
		padding: 16,
	},
	noteTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 6,
		letterSpacing: 0.2,
		fontFamily: 'Inter_600SemiBold', // If available
	},
	notePreview: {
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 12,
		fontFamily: 'Inter_400Regular', // If available
	},
	noteFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 4,
	},
	noteDate: {
		fontSize: 12,
		fontWeight: '500',
	},
	tagsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	miniTag: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	miniTagText: {
		fontSize: 10,
		fontWeight: '600',
	},
	moreTags: {
		fontSize: 10,
		fontWeight: '500',
	},
	separator: {
		height: 12,
	},
})

export default NotesList;
