import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, List, Divider, useTheme, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useStore } from '../../context/StoreContext';
import { TABLES, Todo } from '../../models/schema';
import { RootStackParamList } from '../../types';
import { formatDateTime, isPastDue } from '../../utils/dateUtils';
import { LoadingIndicator } from '../ui/LoadingIndicator';
import { ErrorDisplay } from '../ui/ErrorDisplay';
import TodoForm from './TodoForm';

type TodoItemRouteProp = RouteProp<RootStackParamList, 'TodoDetail'>;
type TodoItemNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoDetail'>;

const TodoItem: React.FC = () => {
  const { store } = useStore();
  const theme = useTheme();
  const route = useRoute<TodoItemRouteProp>();
  const navigation = useNavigation<TodoItemNavigationProp>();
  const { id } = route.params;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadTodo();
    
    // Set up listener for changes to this specific todo
    if (store) {
      const listener = () => loadTodo();
      store.addRowListener(TABLES.TODOS, id, listener);
      return () => {
        store.removeRowListener(TABLES.TODOS, id, listener);
      };
    }
  }, [id, store]);

  const loadTodo = () => {
    if (!store) {
      setError(new Error('Store not initialized'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const todoData = store.getRow(TABLES.TODOS, id);
      
      if (!todoData) {
        setError(new Error('Todo not found'));
        setTodo(null);
      } else {
        setTodo({ ...todoData, id } as Todo);
        setError(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error loading todo'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = () => {
    if (!store || !todo) return;

    try {
      store.setCell(TABLES.TODOS, id, 'completed', !todo.completed);
      store.setCell(TABLES.TODOS, id, 'updatedAt', new Date().toISOString());
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      Alert.alert('Error', 'Failed to update todo status');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            if (!store) return;
            
            try {
              store.delRow(TABLES.TODOS, id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting todo:', error);
              Alert.alert('Error', 'Failed to delete todo');
            }
          }
        },
      ]
    );
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'No Priority';
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading todo..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} retry={loadTodo} />;
  }

  if (!todo) {
    return (
      <ErrorDisplay 
        error={new Error('Todo not found')} 
        retry={() => navigation.goBack()}
      />
    );
  }

  if (isEditing) {
    return <TodoForm todo={todo} onSave={() => setIsEditing(false)} />;
  }

  const dueDateColor = todo.dueDate && isPastDue(todo.dueDate) && !todo.completed
    ? theme.colors.error
    : theme.colors.text;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{todo.title}</Text>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => setIsEditing(true)}
            />
          </View>
          
          <View 
            style={[
              styles.priorityBadge, 
              { backgroundColor: getPriorityColor(todo.priority) }
            ]}
          >
            <Text style={styles.priorityText}>
              {getPriorityText(todo.priority)}
            </Text>
          </View>
          
          {todo.description && (
            <Text style={styles.description}>{todo.description}</Text>
          )}
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Status"
            description={todo.completed ? 'Completed' : 'Active'}
            left={props => <List.Icon {...props} icon={todo.completed ? "check-circle" : "circle-outline"} />}
          />
          
          {todo.dueDate && (
            <List.Item
              title="Due Date"
              description={formatDateTime(todo.dueDate)}
              descriptionStyle={{ color: dueDateColor }}
              left={props => <List.Icon {...props} icon="calendar" />}
            />
          )}
          
          {todo.category && (
            <List.Item
              title="Category"
              description={todo.category}
              left={props => <List.Icon {...props} icon="tag" />}
            />
          )}
          
          <List.Item
            title="Created"
            description={formatDateTime(todo.createdAt)}
            left={props => <List.Icon {...props} icon="clock" />}
          />
          
          <List.Item
            title="Last Updated"
            description={formatDateTime(todo.updatedAt)}
            left={props => <List.Icon {...props} icon="update" />}
          />
        </Card.Content>
        
        <Card.Actions style={styles.actions}>
          <Button 
            mode="contained" 
            onPress={handleToggleComplete}
            style={{ flex: 1, marginRight: 8 }}
          >
            {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          <Button 
            mode="outlined" 
            onPress={handleDelete}
            textColor={theme.colors.error}
            style={{ flex: 1 }}
          >
            Delete
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  priorityText: {
    color: 'white',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  actions: {
    justifyContent: 'space-between',
    padding: 16,
  },
});

export default TodoItem;
