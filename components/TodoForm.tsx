import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText, Subheading, RadioButton, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Todo } from '../store/models';
import { validateTodoForm } from '../utils/validation';

type TodoFormProps = {
  initialData?: Partial<Todo>;
  onSubmit: (data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
};

export default function TodoForm({ initialData, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Todo['priority']>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState<Date | null>(
    initialData?.dueDate ? new Date(initialData.dueDate) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const errors = validateTodoForm({ title });
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onSubmit({
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate ? dueDate.getTime() : undefined,
      completed: initialData?.completed || false,
      categoryId: initialData?.categoryId,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={text => {
          setTitle(text);
          if (formErrors.title) {
            const newErrors = { ...formErrors };
            delete newErrors.title;
            setFormErrors(newErrors);
          }
        }}
        mode="outlined"
        error={!!formErrors.title}
        style={styles.input}
      />
      {formErrors.title && (
        <HelperText type="error" visible={!!formErrors.title}>
          {formErrors.title}
        </HelperText>
      )}

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Subheading style={styles.sectionTitle}>Priority</Subheading>
      <View style={styles.priorityContainer}>
        <View style={styles.priorityOption}>
          <RadioButton
            value="low"
            status={priority === 'low' ? 'checked' : 'unchecked'}
            onPress={() => setPriority('low')}
          />
          <Text>Low</Text>
        </View>
        
        <View style={styles.priorityOption}>
          <RadioButton
            value="medium"
            status={priority === 'medium' ? 'checked' : 'unchecked'}
            onPress={() => setPriority('medium')}
          />
          <Text>Medium</Text>
        </View>
        
        <View style={styles.priorityOption}>
          <RadioButton
            value="high"
            status={priority === 'high' ? 'checked' : 'unchecked'}
            onPress={() => setPriority('high')}
          />
          <Text>High</Text>
        </View>
      </View>

      <Subheading style={styles.sectionTitle}>Due Date</Subheading>
      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        {dueDate ? dueDate.toLocaleDateString() : 'Set due date'}
      </Button>
      {dueDate && (
        <Button
          mode="text"
          onPress={() => setDueDate(null)}
          style={styles.clearButton}
        >
          Clear date
        </Button>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={styles.buttonsContainer}>
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          {initialData?.id ? 'Update' : 'Create'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    marginBottom: 8,
  },
  clearButton: {
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
