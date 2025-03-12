import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from 'react-native-paper';
import { ErrorDisplayProps } from '../../types';

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, retry }) => {
  return (
    <View style={styles.container}>
      <Icon source="alert-circle-outline" size={80} color="#ff5252" />
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{error.message}</Text>
      {retry && (
        <Button 
          mode="contained" 
          onPress={retry}
          style={styles.button}
          icon="refresh"
        >
          Try Again
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    color: '#666666',
  },
  button: {
    marginTop: 16,
  },
});