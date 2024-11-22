import { List } from '@/app/context/ListContext';

/**
 * Groups an array of lists into sub-arrays of specified size.
 * @param lists - The array of lists to group.
 * @param size - The number of lists per group.
 * @returns An array of grouped lists.
 */
export const groupLists = (lists: List[], size: number = 2): List[][] => {
  const grouped: List[][] = [];
  for (let i = 0; i < lists.length; i += size) {
    grouped.push(lists.slice(i, i + size));
  }
  return grouped;
};