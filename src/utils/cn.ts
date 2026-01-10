import { type ClassValue, clsx } from 'clsx';

/**
 * Utility to merge class names conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
