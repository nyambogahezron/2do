import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text, Checkbox, useTheme, Divider } from 'react-native-paper';
import { Todo } from '../../models/schema';
import { useStore } from '../../context/StoreContext';
import { TABLES } from '../../models/schema';
import { formatDate, isPastDue } from '../../utils/dateUtils';
import { Feather } from '@expo/vector-icons';

interface TodoListProps {
  todos: Todo[];
  onPress: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onPress }) => {
  const { store } = useStore();
  const theme = useTheme();

  const toggleTodoCompletion = (id: string, completed: boolean) => {
    if (!store) return;
    
    try {
      store.setCell(TABLES.TODOS, id, 'completed', !completed);
      store.setCell(TABLES.TODOS, id, 'updatedAt', new Date().toISOString());
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.highPriority;
      case 'medium':
        return theme.colors.mediumPriority;
      case 'low':
        return theme.colors.lowPriority;
      default:
        return theme.colors.backdrop;
    }
  };

  const renderTodoItem = ({ item }: { item: Todo }) => {
    const priorityColor = getPriorityColor(item.priority);
    const dueDateColor = item.dueDate && isPastDue(item.dueDate) && !item.completed
      ? theme.colors.error
      : theme.colors.text;

    return (
      <Card 
        style={styles.card} 
        onPress={() => onPress(item.id)}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Checkbox
              status={item.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleTodoCompletion(item.id, item.completed)}
            />
            <View style={styles.textContainer}>
              <Text 
                style={[
                  styles.todoTitle,
                  item.completed && styles.completedText,
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              
              {item.description && (
                <Text 
                  style={[styles.description, item.completed && styles.completedText]} 
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
              )}
              
              <View style={styles.metadataContainer}>
                {item.dueDate && (
                  <View style={styles.metadata}>
                    <Feather name="calendar" size={14} color={dueDateColor} />
                    <Text style={[styles.metadataText, { color: dueDateColor }]}>
                      {formatDate(item.dueDate)}
                    </Text>
                  </View>
                )}
                
                {item.category && (
                  <View style={styles.metadata}>
                    <Feather name="tag" size={14} color={theme.colors.text} />
                    <Text style={styles.metadataText}>{item.category}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          <View 
            style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} 
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <FlatList
      data={todos}
      renderItem={renderTodoItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 80, // Space for FAB
  },
  card: {
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 8,
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  metadataContainer: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  metadataText: {
    fontSize: 12,
    marginLeft: 4,
  },
  separator: {
    height: 8,
  },
});

export default TodoList;
