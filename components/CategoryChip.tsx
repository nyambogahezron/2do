import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Category } from '../store/models';

type CategoryChipProps = {
  category: Category;
  onPress?: () => void;
};

export default function CategoryChip({ category, onPress }: CategoryChipProps) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component 
      style={[
        styles.chip,
        { backgroundColor: category.color + '20' } // Add transparency
      ]}
      onPress={onPress}
    >
      <View 
        style={[
          styles.dot,
          { backgroundColor: category.color }
        ]} 
      />
      <Text style={styles.text}>{category.name}</Text>
    </Component>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  text: {
    fontSize: 14,
  },
});
