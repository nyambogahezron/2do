import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

import { Note, Category } from '../store/models';
import { formatDate } from '../utils/dateUtils';

type NoteItemProps = {
  note: Note;
  category?: Category;
  onPress: () => void;
  onDelete: () => void;
};

export default function NoteItem({ note, category, onPress, onDelete }: NoteItemProps) {
  const theme = useTheme();
  
  // Calculate if the note has links or images
  const hasLinks = note.links && note.links.length > 0;
  const hasImages = note.images && note.images.length > 0;

  return (
    <Surface style={[
      styles.container, 
      { backgroundColor: theme.colors.surface }
    ]}>
      <TouchableOpacity 
        style={styles.contentContainer}
        onPress={onPress}
      >
        <View style={styles.titleRow}>
          <Text 
            style={styles.title}
            numberOfLines={1}
          >
            {note.title}
          </Text>
          <Text style={styles.date}>
            {formatDate(new Date(note.updatedAt))}
          </Text>
        </View>
        
        <Text 
          style={styles.content}
          numberOfLines={2}
        >
          {note.content}
        </Text>
        
        <View style={styles.metaRow}>
          {category && (
            <View 
              style={[
                styles.category,
                { backgroundColor: category.color + '20' } // Add transparency
              ]}
            >
              <View 
                style={[
                  styles.categoryDot,
                  { backgroundColor: category.color }
                ]} 
              />
              <Text style={styles.categoryText}>
                {category.name}
              </Text>
            </View>
          )}
          
          <View style={styles.attachmentsContainer}>
            {hasImages && (
              <View style={styles.attachment}>
                <Feather name="image" size={14} color={theme.colors.text} />
                <Text style={styles.attachmentText}>
                  {note.images?.length}
                </Text>
              </View>
            )}
            
            {hasLinks && (
              <View style={styles.attachment}>
                <Feather name="link" size={14} color={theme.colors.text} />
                <Text style={styles.attachmentText}>
                  {note.links?.length}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Feather name="trash-2" size={18} color="#FF5252" />
      </TouchableOpacity>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
  },
  attachmentsContainer: {
    flexDirection: 'row',
  },
  attachment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  attachmentText: {
    fontSize: 12,
    marginLeft: 2,
  },
  deleteButton: {
    padding: 12,
    justifyContent: 'center',
  },
});
