import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Checkbox, IconButton, useTheme } from 'react-native-paper';
import { ShoppingItem as ShoppingItemType } from '../../models/schema';

interface ShoppingItemProps {
  item: ShoppingItemType;
  onTogglePurchased: () => void;
  onDelete: () => void;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({ 
  item, 
  onTogglePurchased, 
  onDelete 
}) => {
  const theme = useTheme();

  const formatPrice = (price?: number) => {
    if (price === undefined) return '';
    return `$${price.toFixed(2)}`;
  };

  const formatQuantity = (quantity: number, unit?: string) => {
    return `${quantity}${unit ? ' ' + unit : ''}`;
  };

  return (
    <Card style={[styles.card, item.purchased && styles.purchasedCard]}>
      <Card.Content style={styles.cardContent}>
        <Checkbox
          status={item.purchased ? 'checked' : 'unchecked'}
          onPress={onTogglePurchased}
        />
        
        <View style={styles.itemDetails}>
          <Text 
            style={[
              styles.itemName,
              item.purchased && styles.purchasedText
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          
          <View style={styles.itemMeta}>
            <Text style={styles.quantity}>
              {formatQuantity(item.quantity, item.unit)}
            </Text>
            
            {item.price !== undefined && (
              <Text style={styles.price}>
                {formatPrice(item.price)} {item.quantity > 1 && `(${formatPrice(item.price * item.quantity)})`}
              </Text>
            )}
          </View>
        </View>
        
        <IconButton
          icon="delete"
          size={20}
          onPress={onDelete}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
  },
  purchasedCard: {
    opacity: 0.7,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  purchasedText: {
    textDecorationLine: 'line-through',
  },
  itemMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  quantity: {
    fontSize: 14,
    opacity: 0.7,
    marginRight: 12,
  },
  price: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default ShoppingItem;
