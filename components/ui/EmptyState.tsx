import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from 'react-native-paper';
import { EmptyStateProps } from '../../types';

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  icon = 'information-outline',
  action
}) => {
  return (
    <View style={styles.container}>
      <Icon source={icon} size={80} color="#cccccc" />
      <Text style={styles.message}>{message}</Text>
      {action && (
        <Button 
          mode="contained" 
          onPress={action.onPress}
          style={styles.button}
        >
          {action.label}
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