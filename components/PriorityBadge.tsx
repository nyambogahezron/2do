import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Todo } from '../store/models';

type PriorityBadgeProps = {
  priority: Todo['priority'];
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  let backgroundColor = '#4CAF50'; // Default green for low priority
  let textColor = '#fff';
  let label = 'Low';
  
  if (priority === 'medium') {
    backgroundColor = '#FFC107'; // Yellow for medium
    textColor = '#000'; // Black text for better contrast
    label = 'Medium';
  } else if (priority === 'high') {
    backgroundColor = '#FF5252'; // Red for high
    label = 'High';
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
