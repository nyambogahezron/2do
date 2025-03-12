import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';

import { Note } from '../store/models';
import { validateNoteForm } from '../utils/validation';

type NoteFormProps = {
  initialData?: Partial<Note>;
  onSubmit: (data: { title: string; content: string }) => void;
  onCancel: () => void;
};

export default function NoteForm({ initialData, onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const errors = validateNoteForm({ title, content });
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
    });
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
        label="Content"
        value={content}
        onChangeText={text => {
          setContent(text);
          if (formErrors.content) {
            const newErrors = { ...formErrors };
            delete newErrors.content;
            setFormErrors(newErrors);
          }
        }}
        mode="outlined"
        multiline
        numberOfLines={10}
        style={styles.contentInput}
        error={!!formErrors.content}
      />
      {formErrors.content && (
        <HelperText type="error" visible={!!formErrors.content}>
          {formErrors.content}
        </HelperText>
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
  contentInput: {
    marginBottom: 16,
    height: 200,
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
