import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import {
	Text,
	Card,
	Checkbox,
	Button,
	FAB,
	Dialog,
	Portal,
	TextInput,
	useTheme,
	Divider,
} from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useStore } from '../../context/StoreContext';
import {
	TABLES,
	ShoppingList as ShoppingListType,
	ShoppingItem,
} from '../../models/schema';
import { RootStackParamList } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { EmptyState } from '../ui/EmptyState';
import { LoadingIndicator } from '../ui/LoadingIndicator';
import ShoppingItems from './ShoppingItem';
import { getCurrentTimestamp } from '../../utils/dateUtils';

type ShoppingListRouteProp = RouteProp<
	RootStackParamList,
	'ShoppingListDetail'
>;

const ShoppingList: React.FC = () => {
	const { store } = useStore();
	const route = useRoute<ShoppingListRouteProp>();
	const navigation = useNavigation();
	const theme = useTheme();
	const { id } = route.params;

	const [list, setList] = useState<ShoppingListType | null>(null);
	const [items, setItems] = useState<ShoppingItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogVisible, setDialogVisible] = useState(false);

	// New item form states
	const [itemName, setItemName] = useState('');
	const [itemQuantity, setItemQuantity] = useState('1');
	const [itemUnit, setItemUnit] = useState('');
	const [itemPrice, setItemPrice] = useState('');

	useEffect(() => {
		fetchListAndItems();

		if (store) {
			// Listen for changes to this list
			const listListener = () => fetchList();
			store.addRowListener(TABLES.SHOPPING_LISTS, id, listListener);

			// Listen for changes to all items (to catch new/deleted items)
			const itemsListener = () => fetchItems();
			store.addTableListener(TABLES.SHOPPING_ITEMS, itemsListener);

			return () => {
				store.removeRowListener(TABLES.SHOPPING_LISTS, id, listListener);
				store.removeTableListener(TABLES.SHOPPING_ITEMS, itemsListener);
			};
		}
	}, [id, store]);

	const fetchListAndItems = async () => {
		setLoading(true);
		await fetchList();
		await fetchItems();
		setLoading(false);
	};

	const fetchList = async () => {
		if (!store) return;

		try {
			const listData = store.getRow(TABLES.SHOPPING_LISTS, id);
			if (listData) {
				setList({ ...listData, id } as ShoppingListType);
			} else {
				Alert.alert('Error', 'Shopping list not found');
				navigation.goBack();
			}
		} catch (error) {
			console.error('Error fetching shopping list:', error);
			Alert.alert('Error', 'Failed to load shopping list');
		}
	};

	const fetchItems = async () => {
		if (!store) return;

		try {
			const itemsTable = store.getTable(TABLES.SHOPPING_ITEMS);
			if (!itemsTable) {
				setItems([]);
				return;
			}

			// Filter and convert items for this list
			const listItems = Object.entries(itemsTable)
				.filter(([_, item]) => item.listId === id)
				.map(([itemId, item]) => ({
					...item,
					id: itemId,
				})) as ShoppingItem[];

			// Sort by name
			listItems.sort((a, b) => {
				// First by purchased status
				if (a.purchased !== b.purchased) {
					return a.purchased ? 1 : -1;
				}
				// Then alphabetically
				return a.name.localeCompare(b.name);
			});

			setItems(listItems);
		} catch (error) {
			console.error('Error fetching shopping items:', error);
		}
	};

	const handleAddItem = () => {
		if (!store || !itemName.trim()) return;

		try {
			const timestamp = getCurrentTimestamp();
			const newItemId = uuidv4();

			store.setRow(TABLES.SHOPPING_ITEMS, newItemId, {
				listId: id,
				name: itemName.trim(),
				quantity: parseFloat(itemQuantity) || 1,
				unit: itemUnit.trim() || undefined,
				price: itemPrice ? parseFloat(itemPrice) : undefined,
				purchased: false,
				createdAt: timestamp,
				updatedAt: timestamp,
			});

			// Reset form
			setItemName('');
			setItemQuantity('1');
			setItemUnit('');
			setItemPrice('');
			setDialogVisible(false);
		} catch (error) {
			console.error('Error adding shopping item:', error);
			Alert.alert('Error', 'Failed to add item');
		}
	};

	const toggleItemPurchased = (itemId: string, isPurchased: boolean) => {
		if (!store) return;

		try {
			store.setCell(TABLES.SHOPPING_ITEMS, itemId, 'purchased', !isPurchased);
			store.setCell(
				TABLES.SHOPPING_ITEMS,
				itemId,
				'updatedAt',
				getCurrentTimestamp()
			);
		} catch (error) {
			console.error('Error toggling item purchased status:', error);
		}
	};

	const deleteItem = (itemId: string) => {
		if (!store) return;

		try {
			store.delRow(TABLES.SHOPPING_ITEMS, itemId);
		} catch (error) {
			console.error('Error deleting shopping item:', error);
		}
	};

	const calculateTotal = () => {
		return items
			.filter((item) => item.price)
			.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
	};

	if (loading) {
		return <LoadingIndicator message='Loading shopping list...' />;
	}

	if (!list) {
		return (
			<EmptyState
				message='Shopping list not found'
				icon='alert-circle'
				action={{
					label: 'Go Back',
					onPress: () => navigation.goBack(),
				}}
			/>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.listName}>{list.name}</Text>
				{items.length > 0 && (
					<Text style={styles.summary}>
						{items.filter((item) => item.purchased).length} of {items.length}{' '}
						items purchased
					</Text>
				)}
			</View>

			{items.length === 0 ? (
				<EmptyState
					message='This shopping list is empty'
					icon='shopping-cart'
					action={{
						label: 'Add Item',
						onPress: () => setDialogVisible(true),
					}}
				/>
			) : (
				<>
					<FlatList
						data={items}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<ShoppingItems
								item={item}
								onTogglePurchased={() =>
									toggleItemPurchased(item.id, item.purchased)
								}
								onDelete={() => deleteItem(item.id)}
							/>
						)}
						ItemSeparatorComponent={() => <Divider style={styles.divider} />}
						contentContainerStyle={styles.listContent}
					/>

					{/* Total section */}
					{calculateTotal() > 0 && (
						<Card style={styles.totalCard}>
							<Card.Content>
								<View style={styles.totalRow}>
									<Text style={styles.totalLabel}>Estimated Total:</Text>
									<Text style={styles.totalAmount}>
										${calculateTotal().toFixed(2)}
									</Text>
								</View>
							</Card.Content>
						</Card>
					)}
				</>
			)}

			<FAB
				style={[styles.fab, { backgroundColor: theme.colors.primary }]}
				icon='plus'
				onPress={() => setDialogVisible(true)}
			/>

			{/* Add Item Dialog */}
			<Portal>
				<Dialog
					visible={dialogVisible}
					onDismiss={() => setDialogVisible(false)}
				>
					<Dialog.Title>Add Item</Dialog.Title>
					<Dialog.Content>
						<TextInput
							label='Item Name'
							value={itemName}
							onChangeText={setItemName}
							mode='outlined'
							style={styles.input}
						/>
						<View style={styles.row}>
							<TextInput
								label='Quantity'
								value={itemQuantity}
								onChangeText={setItemQuantity}
								mode='outlined'
								keyboardType='numeric'
								style={[styles.input, styles.quantityInput]}
							/>
							<TextInput
								label='Unit (optional)'
								value={itemUnit}
								onChangeText={setItemUnit}
								mode='outlined'
								style={[styles.input, styles.unitInput]}
							/>
						</View>
						<TextInput
							label='Price (optional)'
							value={itemPrice}
							onChangeText={setItemPrice}
							mode='outlined'
							keyboardType='numeric'
							style={styles.input}
							placeholder='0.00'
						/>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setDialogVisible(false)}>Cancel</Button>
						<Button onPress={handleAddItem} disabled={!itemName.trim()}>
							Add
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	header: {
		marginBottom: 16,
	},
	listName: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	summary: {
		fontSize: 14,
		opacity: 0.7,
		marginTop: 4,
	},
	listContent: {
		paddingBottom: 80, // Space for FAB
	},
	divider: {
		marginVertical: 8,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
	input: {
		marginBottom: 12,
	},
	row: {
		flexDirection: 'row',
	},
	quantityInput: {
		flex: 1,
		marginRight: 8,
	},
	unitInput: {
		flex: 2,
	},
	totalCard: {
		marginTop: 16,
		marginBottom: 80, // Space for FAB
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: '500',
	},
	totalAmount: {
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default ShoppingList;
