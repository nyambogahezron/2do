import { Todo, ShoppingItem, Note } from '../store/models';

// Validator for Todo items
export const validateTodoForm = (data: Partial<Todo>): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Title is required
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Title is required';
  }

  // If priority is provided, validate it
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.priority = 'Invalid priority level';
  }

  // Validate dueDate is a future date if provided
  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = 'Invalid date format';
    }
  }

  return errors;
};

// Validator for Shopping items
export const validateShoppingItem = (data: {
  name?: string;
  quantity?: number;
  price?: number;
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Name is required
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Item name is required';
  }

  // Quantity must be a positive number
  if (data.quantity !== undefined) {
    if (isNaN(data.quantity) || data.quantity <= 0) {
      errors.quantity = 'Quantity must be a positive number';
    }
  }

  // Price must be a non-negative number if provided
  if (data.price !== undefined) {
    if (isNaN(data.price) || data.price < 0) {
      errors.price = 'Price must be a non-negative number';
    }
  }

  return errors;
};

// Validator for Shopping lists
export const validateShoppingList = (name?: string): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Name is required
  if (!name || name.trim() === '') {
    errors.name = 'List name is required';
  }

  return errors;
};

// Validator for Notes
export const validateNoteForm = (data: Partial<Note>): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Title is required
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Title is required';
  }

  // Content is required
  if (!data.content || data.content.trim() === '') {
    errors.content = 'Content is required';
  }

  // Validate image URLs if provided
  if (data.images && Array.isArray(data.images)) {
    if (data.images.some(img => typeof img !== 'string' || img.trim() === '')) {
      errors.images = 'All image URLs must be valid strings';
    }
  }

  // Validate links if provided
  if (data.links && Array.isArray(data.links)) {
    try {
      data.links.forEach(link => new URL(link));
    } catch (error) {
      errors.links = 'All links must be valid URLs';
    }
  }

  return errors;
};

// URL validator
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
