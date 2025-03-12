import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../context/StoreContext';
import { TABLES, ShoppingList } from '../../models/schema';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentTimestamp } from '../../utils/dateUtils';

interface ShoppingFormProps {
  list?: ShoppingList;
  onSave?: () => void;
}

const ShoppingForm: React.FC<ShoppingFormProps> = ({ list, onSave }) => {
  const { store } = useStore();
  const navigation = useNavigation();
  const theme = useTheme();
  const isEditing = !!list;

  // Form state
  const [name, setName] = useState(list?.name || '');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!store || !validateForm()) return;

    try {
      setIsSubmitting(true);
      const timestamp = getCurrentTimestamp();
      
      if (isEditing && list) {
        // Update existing list
        store.setRow(TABLES.SHOPPING_LISTS, list.id, {
          ...list,
          name,
          updatedAt: timestamp,
        });
      } else {
        // Create new list
        const newListId = uuidv4();
        store.setRow(TABLES.SHOPPING_LISTS, newListId, {
          name,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }

      if (onSave) {
        onSave();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving shopping list:', error);
      Alert.alert('Error', 'Failed to save shopping list');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="List Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        error={!!nameError}
        style={styles.input}
      />
      {!!nameError && <HelperText type="error">{nameError}</HelperText>}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.button}
        >
          {isEditing ? 'Update' : 'Create'} Shopping List
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={[styles.button, styles.cancelButton]}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </View>
    </View>
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
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 24,
  },
});

export default ShoppingForm;
