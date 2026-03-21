export type TaskStatus = 'todo' | 'inprogress' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory =
  | 'cleaning'
  | 'food'
  | 'shopping'
  | 'guests'
  | 'ceremony'
  | 'kids'
  | 'general';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  emoji: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'לעשות', emoji: '📋' },
  { id: 'inprogress', title: 'בתהליך', emoji: '⏳' },
  { id: 'done', title: 'הושלם', emoji: '✅' },
];

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  cleaning: 'ניקיון',
  food: 'אוכל ובישול',
  shopping: 'קניות',
  guests: 'אורחים',
  ceremony: 'הסדר והטקס',
  kids: 'ילדים',
  general: 'כללי',
};

export const CATEGORY_EMOJIS: Record<TaskCategory, string> = {
  cleaning: '🧹',
  food: '🍽️',
  shopping: '🛒',
  guests: '👨‍👩‍👧‍👦',
  ceremony: '🕍',
  kids: '🎉',
  general: '📌',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'גבוהה',
  medium: 'בינונית',
  low: 'נמוכה',
};

export const FAMILY_MEMBERS = [
  'אבא',
  'אמא',
  'שרה',
  'דוד',
  'רחל',
  'יוסף',
  'מרים',
];
