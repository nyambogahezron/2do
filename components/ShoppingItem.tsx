import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, Checkbox } from 'react-native-paper'
import { useTheme } from '../context/ThemeContext'
import { Feather } from '@expo/vector-icons'
import Animated, { FadeInDown, Layout } from 'react-native-reanimated'

import { ShoppingItem as ShoppingItemType } from '../store/models'

type ShoppingItemProps = {
	item: ShoppingItemType
	onToggleComplete: () => void
	onDelete: () => void
	index?: number
}

export default function ShoppingItem({
	item,
	onToggleComplete,
	onDelete,
	index = 0,
}: ShoppingItemProps) {
	const { themeClrs } = useTheme()

	return (
		<Animated.View
			entering={FadeInDown.delay(index * 50).springify()}
			layout={Layout.springify()}
			style={{ marginBottom: 8 }}
		>
			<Surface
				style={[
					styles.container,
					{
						backgroundColor: themeClrs.colors.surface,
						borderColor: themeClrs.colors.border || 'transparent',
						borderWidth: 1,
					},
					item.checked && styles.purchasedContainer,
				]}
			>
				<View style={styles.leftContainer}>
					<Checkbox
						status={item.checked ? 'checked' : 'unchecked'}
						onPress={onToggleComplete}
						color={themeClrs.colors.primary}
					/>
				</View>

				<TouchableOpacity
					style={styles.contentContainer}
					onPress={onToggleComplete}
					activeOpacity={0.7}
				>
					<View style={styles.titleRow}>
						<Text
							style={[
								styles.title,
								{ color: themeClrs.colors.text },
								item.checked && styles.purchasedText,
							]}
							numberOfLines={1}
						>
							{item.name}
						</Text>
					</View>

					<View style={styles.metaRow}>
						<Text
							style={[
								styles.quantity,
								{ color: themeClrs.colors.outline || '#666' },
								item.checked && styles.purchasedText,
							]}
						>
							Qty: {item.quantity}
						</Text>

						{item.price !== undefined && item.price > 0 && (
							<View
								style={[
									styles.priceTag,
									{ backgroundColor: themeClrs.colors.secondaryContainer },
								]}
							>
								<Text
									style={[
										styles.price,
										{ color: themeClrs.colors.onSecondaryContainer },
										item.checked && styles.purchasedText,
									]}
								>
									${(item.price * item.quantity).toFixed(2)}
								</Text>
							</View>
						)}
					</View>
				</TouchableOpacity>

				<TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
					<Feather name='trash-2' size={18} color={themeClrs.colors.error} />
				</TouchableOpacity>
			</Surface>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderRadius: 12,
		elevation: 2,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
	},
	purchasedContainer: {
		opacity: 0.6,
		elevation: 0,
	},
	leftContainer: {
		justifyContent: 'center',
		padding: 4,
	},
	contentContainer: {
		flex: 1,
		padding: 12,
		paddingLeft: 4,
		justifyContent: 'center',
	},
	titleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		flex: 1,
	},
	purchasedText: {
		textDecorationLine: 'line-through',
		opacity: 0.8,
	},
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 2,
		gap: 12,
	},
	quantity: {
		fontSize: 14,
		fontWeight: '500',
	},
	priceTag: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	price: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	deleteButton: {
		padding: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
})
