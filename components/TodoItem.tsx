import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, Clock, Tag } from 'lucide-react-native';
import { Todo } from '../lib/store';
import { formatDate, priorityColors } from '../lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onPress: () => void;
}

export function TodoItem({ todo, onToggle, onPress }: TodoItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <TouchableOpacity
        style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
        onPress={onToggle}>
        {todo.completed && <Check size={16} color="#fff" />}
      </TouchableOpacity>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            todo.completed && styles.completedTitle,
          ]}>
          {todo.title}
        </Text>
        <View style={styles.meta}>
          {todo.dueDate && (
            <View style={styles.metaItem}>
              <Clock size={12} color="#888" />
              <Text style={styles.metaText}>
                {formatDate(todo.dueDate)}
              </Text>
            </View>
          )}
          {todo.category && (
            <View style={styles.metaItem}>
              <Tag size={12} color="#888" />
              <Text style={styles.metaText}>{todo.category}</Text>
            </View>
          )}
          <View
            style={[
              styles.priority,
              { backgroundColor: priorityColors[todo.priority] },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  priority: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});