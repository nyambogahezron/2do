import { useState, useEffect } from 'react';
import { eq,  desc } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import { todos, Todo, InsertTodo } from '@/db/schema';
import { db } from '@/db/connect';

export type { Todo, InsertTodo } from '@/db/schema';

export const getAllTodos = async (): Promise<Todo[]> => {
  try {
    const allTodos = await db.select()
      .from(todos)
      .orderBy(desc(todos.createdAt));
    return allTodos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const getTodoById = async (id: string): Promise<Todo | null> => {
  try {
    const result = await db.select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching todo:', error);
    throw error;
  }
};

export const addTodo = async (
  todoData: Omit<InsertTodo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = new Date().toISOString();
  const id = randomUUID();

  try {
    await db.insert(todos).values({
      id,
      text: todoData.text,
      done: todoData.done ?? false,
      priority: todoData.priority || 'medium',
      dueDate: todoData.dueDate || '',
      createdAt: now,
      updatedAt: now,
    });
    return id;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (
  id: string,
  updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
): Promise<void> => {
  const now = new Date().toISOString();

  try {
    await db.update(todos)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(todos.id, id));
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const toggleTodo = async (id: string): Promise<void> => {
  try {
    const todo = await getTodoById(id);
    if (todo) {
      await updateTodo(id, { done: !todo.done });
    }
  } catch (error) {
    console.error('Error toggling todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await db.delete(todos)
      .where(eq(todos.id, id));
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const useTodos = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);
      const allTodos = await getAllTodos();
      setTodosList(allTodos);
    } catch (error) {
      console.error('Error refreshing todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    todos: todosList,
    loading,
    refresh,
  };
};

export const useTodo = (id: string | null) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!id) {
      setTodo(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedTodo = await getTodoById(id);
      setTodo(fetchedTodo);
    } catch (error) {
      console.error('Error fetching todo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  return {
    todo,
    loading,
    refresh,
  };
};

export const useDeleteTodo = () => {
  const [deleting, setDeleting] = useState(false);

  const remove = async (id: string) => {
    try {
      setDeleting(true);
      await deleteTodo(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteTodo: remove,
    deleting,
  };
};

export const useAddTodo = () => {
  const [adding, setAdding] = useState(false);

  const add = async (todoData: Omit<InsertTodo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setAdding(true);
      const id = await addTodo(todoData);
      return id;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    } finally {
      setAdding(false);
    }
  };

  return {
    addTodo: add,
    adding,
  };
};

export const useUpdateTodo = () => {
  const [updating, setUpdating] = useState(false);

  const update = async (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    try {
      setUpdating(true);
      await updateTodo(id, updates);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateTodo: update,
    updating,
  };
};

export const useToggleTodoDone = (id: string) => {
  const [toggling, setToggling] = useState(false);

  const toggle = async () => {
    try {
      setToggling(true);
      await toggleTodo(id);
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw error;
    } finally {
      setToggling(false);
    }
  };

  return toggle;
};

