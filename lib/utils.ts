import { format } from 'date-fns';

export const createId = () => 
  Math.random().toString(36).substring(2) + Date.now().toString(36);

export const formatDate = (date: string) => 
  format(new Date(date), 'MMM dd, yyyy');

export const formatTime = (date: string) =>
  format(new Date(date), 'HH:mm');

export const priorityColors = {
  low: '#4CAF50',
  medium: '#FFC107',
  high: '#F44336',
};