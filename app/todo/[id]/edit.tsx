import { router, Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useRow } from 'tinybase/ui-react';
import TodoForm from '@/components/todos/TodoForm';
import CustomHeader from '@/components/ui/CustomHeader';

const TODO_TABLE = 'todo';

export default function EditTodoScreen() {
    const { id } = useLocalSearchParams();
    const { themeClrs } = useTheme();
    const todoData = useRow(TODO_TABLE, id as string);

    const handleCancel = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: themeClrs.colors.background }]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: themeClrs.colors.background,
                    },
                    header: () => (
                        <CustomHeader
                            title="Edit Todo"
                            onBack={handleCancel}
                        />
                    ),
                }}
            />
            
            <TodoForm 
                initialData={todoData}
                onCancel={handleCancel}
                isEditing={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
}); 