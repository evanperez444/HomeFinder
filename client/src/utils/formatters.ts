/**
 * Format a price number to a human-readable currency string
 * @param price The price to format
 * @returns Formatted price string with dollar sign and commas
 */
export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Use Intl.NumberFormat for proper formatting with currency symbol
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

/**
 * Format a date to a human-readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date and time to a human-readable string
 * @param date The date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Convert number of days ago to a human-readable string
 * @param days Number of days ago
 * @returns Formatted string (e.g., "2 days ago", "Today", "1 day ago")
 */
export function formatDaysAgo(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

/**
 * Format square footage with commas for thousands and "sq ft" suffix
 * @param squareFeet The square footage to format
 * @returns Formatted square footage string
 */
export function formatSquareFeet(squareFeet: number): string {
  return `${squareFeet.toLocaleString()} sq ft`;
}

/**
 * Truncate long text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
