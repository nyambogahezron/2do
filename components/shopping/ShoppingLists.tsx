import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, useTheme, IconButton, Divider } from 'react-native-paper';
import { useStore } from '../../context/StoreContext';
import { TABLES, ShoppingList } from '../../models/schema';
import { formatDate } from '../../utils/dateUtils';
import { EmptyState } from '../ui/EmptyState';

interface ShoppingListsProps {
  onSelectList: (id: string) => void;
  onCreateList: () => void;
}

const ShoppingLists: React.FC<ShoppingListsProps> = ({ 
  onSelectList, 
  onCreateList 
}) => {
  const { store } = useStore();
  const theme = useTheme();
  
  const [lists, setLists] = useState<ShoppingList[]>([]);

  useEffect(() => {
    fetchLists();
    
    if (store) {
      const listener = () => fetchLists();
      store.addTableListener(TABLES.SHOPPING_LISTS, listener);
      return () => {
        store.removeTableListener(TABLES.SHOPPING_LISTS, listener);
      };
    }
  }, [store]);

  const fetchLists = () => {
    if (!store) return;
    
    try {
      const listsTable = store.getTable(TABLES.SHOPPING_LISTS);
      if (!listsTable) {
        setLists([]);
        return;
      }

      // Convert table to array
      const listsArray = Object.entries(listsTable).map(([id, data]) => ({
        ...data,
        id,
      })) as ShoppingList[];

      // Sort by createdAt descending (newest first)
      listsArray.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setLists(listsArray);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    }
  };

  const deleteList = (id: string) => {
    if (!store) return;
    
    try {
      // First, delete all items in this list
      const itemsTable = store.getTable(TABLES.SHOPPING_ITEMS);
      if (itemsTable) {
        Object.entries(itemsTable).forEach(([itemId, item]) => {
          if (item.listId === id) {
            store.delRow(TABLES.SHOPPING_ITEMS, itemId);
          }
        });
      }
      
      // Then delete the list itself
      store.delRow(TABLES.SHOPPING_LISTS, id);
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  if (lists.length === 0) {
    return (
      <EmptyState
        message="You don't have any shopping lists yet"
        icon="shopping-cart"
        action={{
          label: "Create a shopping list",
          onPress: onCreateList
        }}
      />
    );
  }

  return (
    <FlatList
      data={lists}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Card 
          style={styles.card} 
          onPress={() => onSelectList(item.id)}
        >
          <Card.Content style={styles.cardContent}>
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.listDate}>Created: {formatDate(item.createdAt)}</Text>
            </View>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => deleteList(item.id)}
            />
          </Card.Content>
        </Card>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: '500',
  },
  listDate: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  separator: {
    height: 8,
  },
});

export default ShoppingLists;
