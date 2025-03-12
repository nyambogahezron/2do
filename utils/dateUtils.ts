/**
 * Formats a date string to a user-friendly format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Jan 1, 2023")
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * Formats a date string to include time
 * @param dateString ISO date string
 * @returns Formatted date and time string (e.g., "Jan 1, 2023, 12:00 PM")
 */
export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

/**
 * Checks if a date is in the past
 * @param dateString ISO date string
 * @returns true if date is in the past
 */
export const isPastDue = (dateString?: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
};

/**
 * Checks if a date is today
 * @param dateString ISO date string
 * @returns true if date is today
 */
export const isToday = (dateString?: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Formats a relative time (e.g., "2 days ago", "in 3 days")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export const getRelativeTimeString = (dateString?: string): string => {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

/**
 * Convert a date to ISO string for storage
 * @param date Date object
 * @returns ISO formatted string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Get current timestamp in ISO format
 * @returns Current date/time in ISO format
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
