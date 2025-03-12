import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

type EmptyStateProps = {
  icon: string;
  message: string;
  suggestion: string;
};

export default function EmptyState({ icon, message, suggestion }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Feather
        name={icon}
        size={80}
        color={theme.colors.disabled}
        style={styles.icon}
      />
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
      <Text style={[styles.suggestion, { color: theme.colors.placeholder }]}>
        {suggestion}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});
