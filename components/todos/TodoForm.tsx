import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, HelperText, useTheme, Text, SegmentedButtons, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../context/StoreContext';
import { TABLES, Todo } from '../../models/schema';
import { v4 as uuidv4 } from 'uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCurrentTimestamp } from '../../utils/dateUtils';

interface TodoFormProps {
  todo?: Todo;
  onSave?: (formData?: any) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSave }) => {
  const { store } = useStore();
  const navigation = useNavigation();
  const theme = useTheme();
  const isEditing = !!todo;

  // Form state
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(todo?.priority || 'medium');
  const [category, setCategory] = useState(todo?.category || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo?.dueDate ? new Date(todo.dueDate) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Input validation
  const [titleError, setTitleError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!store || !validateForm()) return;

    try {
      setIsSubmitting(true);
      const timestamp = getCurrentTimestamp();
      
      if (isEditing && todo) {
        // Update existing todo
        store.setRow(TABLES.TODOS, todo.id, {
          ...todo,
          title,
          description,
          priority,
          category: category || undefined,
          dueDate: dueDate?.toISOString(),
          updatedAt: timestamp,
        });
      } else {
        // Create new todo
        const newTodoId = uuidv4();
        store.setRow(TABLES.TODOS, newTodoId, {
          title,
          description: description || undefined,
          completed: false,
          priority,
          category: category || undefined,
          dueDate: dueDate?.toISOString(),
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      if (onSave) {
        onSave({
          title,
          description,
          priority,
          category,
          dueDate: dueDate?.toISOString()
        });
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving todo:', error);
      Alert.alert('Error', 'Failed to save todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Family']; // Predefined categories

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <TextInput
          label="Title *"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          error={!!titleError}
          style={styles.input}
        />
        {!!titleError && <HelperText type="error">{titleError}</HelperText>}

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>Priority</Text>
        <SegmentedButtons
          value={priority}
          onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
          buttons={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          style={styles.segmentedButton}
        />

        <Text style={styles.sectionTitle}>Category</Text>
        <TextInput
          label="Category"
          value={category}
          onChangeText={setCategory}
          mode="outlined"
          style={styles.input}
        />
        
        <View style={styles.categoryChips}>
          {categories.map((cat) => (
            <Chip 
              key={cat}
              style={styles.chip}
              onPress={() => setCategory(cat)}
              selected={category === cat}
            >
              {cat}
            </Chip>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Due Date</Text>
        <View style={styles.dateContainer}>
          <Button 
            mode="outlined" 
            onPress={() => setShowDatePicker(true)}
            icon="calendar"
            style={styles.dateButton}
          >
            {dueDate ? dueDate.toLocaleDateString() : 'Set Due Date'}
          </Button>
          
          {dueDate && (
            <Button 
              mode="text" 
              onPress={() => setDueDate(undefined)}
              textColor={theme.colors.error}
            >
              Clear
            </Button>
          )}
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
          >
            {isEditing ? 'Update' : 'Create'} Todo
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {
              if (onSave) {
                onSave({
                  title,
                  description,
                  priority,
                  category,
                  dueDate: dueDate?.toISOString()
                });
              } else {
                navigation.goBack();
              }
            }}
            style={[styles.button, styles.cancelButton]}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 8,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateButton: {
    flex: 1,
    marginRight: 8,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 24,
  },
});

export default TodoForm;
