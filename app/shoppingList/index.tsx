import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useStore, useTable } from 'tinybase/ui-react';
import { Ionicons } from '@expo/vector-icons';
import { 
	SHOPPING_LISTS_TABLE,
	SHOPPING_ITEMS_TABLE,
	createShoppingList,
	getAllShoppingLists,
	getItemsByListId,
	createShoppingItem,
	updateShoppingItem,
	deleteShoppingItem,
	deleteShoppingList,
	getTotalItems,
	getTotalPrice
} from '@/store/shopping';

// Add type definitions
interface ShoppingItem {
	id: string;
	listId: string;
	name: string;
	quantity: number;
	price: number;
	checked: boolean;
	createdAt: number;
	updatedAt: number;
}

export default function ShoppingList() {
	const store = useStore();
	const [selectedListId, setSelectedListId] = useState<string | null>(null);
	const [newListTitle, setNewListTitle] = useState('');
	const [newItemName, setNewItemName] = useState('');
	const [newItemQuantity, setNewItemQuantity] = useState('1');
	const [newItemPrice, setNewItemPrice] = useState('0');

	// Use useTable hook instead of useStore for better reactivity
	const shoppingLists = useTable(SHOPPING_LISTS_TABLE);
	
	// Subscribe to shopping items using useTable
	const allItems = useTable(SHOPPING_ITEMS_TABLE);
	
	// Filter items for the selected list
	const shoppingItems = React.useMemo(() => {
		if (!selectedListId || !allItems) return {};
		return Object.entries(allItems).reduce((acc, [id, item]: [string, any]) => {
			if (item.listId === selectedListId) {
				acc[id] = item;
			}
			return acc;
		}, {} as Record<string, ShoppingItem>);
	}, [selectedListId, allItems]);

	// Calculate totals
	const totalItems = React.useMemo(() => {
		if (!shoppingItems) return 0;
		return Object.values(shoppingItems).reduce((sum, item) => 
			sum + (Number(item.quantity) || 0), 0);
	}, [shoppingItems]);

	const totalPrice = React.useMemo(() => {
		if (!shoppingItems) return 0;
		return Object.values(shoppingItems).reduce((sum, item) => {
			const quantity = Number(item.quantity) || 0;
			const price = Number(item.price) || 0;
			return sum + (quantity * price);
		}, 0);
	}, [shoppingItems]);

	// Create a new shopping list
	const handleAddList = () => {
		if (!store || !newListTitle.trim()) {
			Alert.alert('Error', 'Please enter a list title');
			return;
		}
		
		const listId = createShoppingList(store, newListTitle);
		setNewListTitle('');
		setSelectedListId(listId);
	};

	// Create a new shopping item
	const handleAddItem = () => {
		if (!store || !selectedListId) return;
		
		if (!newItemName.trim()) {
			Alert.alert('Error', 'Please enter an item name');
			return;
		}
		
		try {
			createShoppingItem(
				store,
				selectedListId,
				newItemName,
				Number(newItemQuantity) || 1,
				Number(newItemPrice) || 0
			);
			
			setNewItemName('');
			setNewItemQuantity('1');
			setNewItemPrice('0');
		} catch (error) {
			console.error('Error adding item:', error);
			Alert.alert('Error', 'Failed to add item');
		}
	};

	// Toggle item checked status
	const toggleItemChecked = (itemId: string, currentValue: boolean) => {
		if (!store) return;
		updateShoppingItem(store, itemId, { checked: !currentValue });
	};

	// Delete a shopping item
	const handleDeleteItem = (itemId: string) => {
		Alert.alert(
			'Delete Item',
			'Are you sure you want to delete this item?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ 
					text: 'Delete', 
					onPress: () => deleteShoppingItem(store, itemId),
					style: 'destructive'
				}
			]
		);
	};

	// Delete a shopping list
	const handleDeleteList = (listId: string) => {
		Alert.alert(
			'Delete List',
			'Are you sure you want to delete this list and all its items?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ 
					text: 'Delete', 
					onPress: () => {
						deleteShoppingList(store, listId);
						if (selectedListId === listId) {
							setSelectedListId(null);
						}
					},
					style: 'destructive'
				}
			]
		);
	};

	// Render a shopping list item with proper typing
	const renderItem = ({ item }: { item: ShoppingItem }) => (
		<View style={styles.itemContainer}>
			<TouchableOpacity 
				style={styles.checkBox}
				onPress={() => toggleItemChecked(item.id, item.checked)}
			>
				{item.checked ? 
					<Ionicons name="checkmark-circle" size={24} color="green" /> : 
					<Ionicons name="ellipse-outline" size={24} color="gray" />}
			</TouchableOpacity>
			
			<View style={styles.itemDetails}>
				<Text style={[styles.itemName, item.checked && styles.checkedText]}>
					{item.name}
				</Text>
				<Text style={styles.itemInfo}>
					Qty: {item.quantity || 0} × ${(item.price || 0).toFixed(2)} = ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
				</Text>
			</View>
			
			<TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
				<Ionicons name="trash-outline" size={24} color="red" />
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Shopping Lists</Text>
			
			{/* Shopping Lists Section */}
			<View style={styles.section}>
				<View style={styles.addContainer}>
					<TextInput
						style={styles.input}
						placeholder="New shopping list..."
						value={newListTitle}
						onChangeText={setNewListTitle}
					/>
					<TouchableOpacity style={styles.addButton} onPress={handleAddList}>
						<Text style={styles.buttonText}>Add List</Text>
					</TouchableOpacity>
				</View>
				
				<View style={styles.listsContainer}>
					{shoppingLists && Object.entries(shoppingLists).map(([id, list]: [string, any]) => (
						<TouchableOpacity
							key={id}
							style={[
								styles.listItem,
								selectedListId === id && styles.selectedListItem
							]}
							onPress={() => setSelectedListId(id)}
						>
							<Text style={styles.listTitle}>{list?.title || 'Untitled'}</Text>
							<TouchableOpacity onPress={() => handleDeleteList(id)}>
								<Ionicons name="close-circle" size={20} color="red" />
							</TouchableOpacity>
						</TouchableOpacity>
					))}
				</View>
			</View>
			
			{/* Selected List Items Section */}
			{selectedListId && (
				<View style={styles.section}>
					<Text style={styles.subtitle}>
						{shoppingLists[selectedListId]?.title || 'Items'} 
					</Text>
					
					{/* New Item Form */}
					<View style={styles.addItemContainer}>
						<TextInput
							style={styles.itemInput}
							placeholder="Item name"
							value={newItemName}
							onChangeText={setNewItemName}
						/>
						<TextInput
							style={styles.quantityInput}
							placeholder="Qty"
							value={newItemQuantity}
							onChangeText={setNewItemQuantity}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.priceInput}
							placeholder="Price"
							value={newItemPrice}
							onChangeText={setNewItemPrice}
							keyboardType="numeric"
						/>
						<TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
							<Ionicons name="add" size={24} color="white" />
						</TouchableOpacity>
					</View>
					
					{/* Items List */}
					<FlatList
						data={Object.values(shoppingItems)}
						renderItem={renderItem}
						keyExtractor={(item: ShoppingItem) => item.id}
						style={styles.listContainer}
						ListEmptyComponent={
							<Text style={styles.emptyText}>No items in this list</Text>
						}
					/>
					
					{/* Summary */}
					<View style={styles.summary}>
						<Text style={styles.summaryText}>
							Total Items: {totalItems}
						</Text>
						<Text style={styles.summaryText}>
							Total Price: ${totalPrice.toFixed(2)}
						</Text>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f8f8f8',
		marginTop: 48
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center'
	},
	subtitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 12
	},
	section: {
		backgroundColor: 'white',
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2
	},
	addContainer: {
		flexDirection: 'row',
		marginBottom: 16
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 4,
		padding: 8,
		marginRight: 8
	},
	addButton: {
		backgroundColor: '#007AFF',
		borderRadius: 4,
		paddingHorizontal: 12,
		paddingVertical: 8,
		justifyContent: 'center'
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold'
	},
	listsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8
	},
	listItem: {
		backgroundColor: '#f0f0f0',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 4,
		marginBottom: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		minWidth: 150
	},
	selectedListItem: {
		backgroundColor: '#e0f0ff',
		borderWidth: 1,
		borderColor: '#007AFF'
	},
	listTitle: {
		fontSize: 16,
		marginRight: 8
	},
	addItemContainer: {
		flexDirection: 'row',
		marginBottom: 16
	},
	itemInput: {
		flex: 3,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 4,
		padding: 8,
		marginRight: 8
	},
	quantityInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 4,
		padding: 8,
		marginRight: 8
	},
	priceInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 4,
		padding: 8,
		marginRight: 8
	},
	addItemButton: {
		backgroundColor: '#007AFF',
		borderRadius: 4,
		width: 40,
		justifyContent: 'center',
		alignItems: 'center'
	},
	listContainer: {
		maxHeight: 300,
		marginBottom: 16
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	checkBox: {
		marginRight: 8
	},
	itemDetails: {
		flex: 1,
		marginRight: 8
	},
	itemName: {
		fontSize: 16,
		marginBottom: 4
	},
	checkedText: {
		textDecorationLine: 'line-through',
		color: '#888'
	},
	itemInfo: {
		fontSize: 14,
		color: '#666'
	},
	emptyText: {
		textAlign: 'center',
		color: '#888',
		padding: 16
	},
	summary: {
		borderTopWidth: 1,
		borderTopColor: '#eee',
		paddingTop: 16,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	summaryText: {
		fontSize: 16,
		fontWeight: 'bold'
	}
});
