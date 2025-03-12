import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';

type ShoppingListFormProps = {
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
};

export default function ShoppingListForm({ initialName = '', onSubmit, onCancel }: ShoppingListFormProps) {
  const [name, setName] = useState(initialName);
  const [nameError, setNameError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Please enter a list name');
      return;
    }
    
    onSubmit(name.trim());
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="List Name"
        value={name}
        onChangeText={text => {
          setName(text);
          if (nameError) setNameError('');
        }}
        mode="outlined"
        error={!!nameError}
        style={styles.input}
      />
      {nameError ? (
        <HelperText type="error" visible={!!nameError}>
          {nameError}
        </HelperText>
      ) : null}

      <View style={styles.buttonsContainer}>
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          {initialName ? 'Update' : 'Create'}
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});
