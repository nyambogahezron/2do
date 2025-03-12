import { Store } from 'tinybase';
import { Todo } from './models';

export const setupTodoModel = (store: Store): void => {
  // Ensure todos table exists
  if (!store.getTable('todos')) {
    store.setTable('todos', {});
  }
};

export const addTodo = (
  store: Store,
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): string => {
  const id = Date.now().toString();
  const timestamp = Date.now();

  store.setRow('todos', id, {
    id,
    ...todo,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return id;
};

export const updateTodo = (
  store: Store,
  id: string,
  updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
): void => {
  const todo = store.getRow('todos', id);
  if (todo) {
    store.setPartialRow('todos', id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }
};

export const deleteTodo = (store: Store, id: string): void => {
  store.delRow('todos', id);
};

export const toggleTodoCompletion = (store: Store, id: string): void => {
  const todo = store.getRow('todos', id);
  if (todo) {
    store.setPartialRow('todos', id, {
      completed: !todo.completed,
      updatedAt: Date.now(),
    });
  }
};

export const getTodosByCategory = (store: Store, categoryId: string): Record<string, Todo> => {
  const todos = store.getTable('todos');
  if (!todos) return {};

  return Object.entries(todos).reduce((filtered, [id, todo]) => {
    if (todo.categoryId === categoryId) {
      filtered[id] = todo as Todo;
    }
    return filtered;
  }, {} as Record<string, Todo>);
};

export const getTodosByPriority = (store: Store, priority: Todo['priority']): Record<string, Todo> => {
  const todos = store.getTable('todos');
  if (!todos) return {};

  return Object.entries(todos).reduce((filtered, [id, todo]) => {
    if (todo.priority === priority) {
      filtered[id] = todo as Todo;
    }
    return filtered;
  }, {} as Record<string, Todo>);
};

export const getCompletedTodos = (store: Store): Record<string, Todo> => {
  const todos = store.getTable('todos');
  if (!todos) return {};

  return Object.entries(todos).reduce((filtered, [id, todo]) => {
    if (todo.completed) {
      filtered[id] = todo as Todo;
    }
    return filtered;
  }, {} as Record<string, Todo>);
};

export const getIncompleteTodos = (store: Store): Record<string, Todo> => {
  const todos = store.getTable('todos');
  if (!todos) return {};

  return Object.entries(todos).reduce((filtered, [id, todo]) => {
    if (!todo.completed) {
      filtered[id] = todo as Todo;
    }
    return filtered;
  }, {} as Record<string, Todo>);
};

export const getOverdueTodos = (store: Store): Record<string, Todo> => {
  const todos = store.getTable('todos');
  if (!todos) return {};

  const now = Date.now();
  return Object.entries(todos).reduce((filtered, [id, todo]) => {
    if (!todo.completed && todo.dueDate && todo.dueDate < now) {
      filtered[id] = todo as Todo;
    }
    return filtered;
  }, {} as Record<string, Todo>);
};
