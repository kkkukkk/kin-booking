export type SortOption = 'date' | 'price' | 'name' | 'status';

export interface SortConfig {
  field: SortOption;
  direction: 'asc' | 'desc';
}

export const sortOptions: { value: string; label: string }[] = [
  { value: 'date', label: '날짜' },
  { value: 'price', label: '가격' },
  { value: 'name', label: '이름' },
  { value: 'status', label: '상태' }
];

export const sortLabels: Record<SortOption, string> = {
  date: '날짜',
  price: '가격', 
  name: '이름',
  status: '상태'
}; 