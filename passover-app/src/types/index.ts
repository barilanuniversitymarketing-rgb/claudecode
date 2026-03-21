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

export type AppView = 'dashboard' | 'leaderboard' | 'management' | 'profile';
export type MemberRole = 'leader' | 'participant';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assigneeId?: string;
  dueDate?: string;
  points: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  points: number;
  earned: boolean;
  earnedAt?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  color: string;
  role: MemberRole;
  points: number;
  badges: Badge[];
  tasksDone: number;
}

export interface Column {
  id: TaskStatus;
  title: string;
  emoji: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'לביצוע', emoji: '📋' },
  { id: 'inprogress', title: 'בתהליך', emoji: '⏳' },
  { id: 'done', title: 'בוצע', emoji: '✅' },
];

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  cleaning: 'ניקיון',
  food: 'בישול',
  shopping: 'קניות',
  guests: 'אורחים',
  ceremony: 'הגדה וסדר',
  kids: 'ילדים',
  general: 'כללי',
};

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  cleaning: 'cleaning_services',
  food: 'restaurant',
  shopping: 'shopping_cart',
  guests: 'groups',
  ceremony: 'auto_stories',
  kids: 'child_care',
  general: 'checklist',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'דחוף',
  medium: 'חשוב',
  low: 'רגיל',
};

export const MEMBER_COLORS = [
  '#004484', '#890045', '#005bae', '#345681',
  '#FFB1C7', '#FFD9E2', '#AACBFD', '#D4E3FF',
  '#E6E8EA', '#C2C6D3', '#727783', '#254872',
];

export const DEFAULT_BADGES: Omit<Badge, 'earned' | 'earnedAt'>[] = [
  { id: 'haggadah', name: 'מומחה הגדה', icon: 'auto_stories', description: 'סיים 3 משימות בקטגוריית הגדה', points: 250 },
  { id: 'cleaning', name: 'אלוף ניקיון', icon: 'cleaning_services', description: 'סיים 3 משימות ניקיון', points: 300 },
  { id: 'early', name: 'משכים קום', icon: 'wb_sunny', description: 'סיים משימה 3 ימים לפני הזמן', points: 150 },
  { id: 'helper', name: 'עוזר מצטיין', icon: 'volunteer_activism', description: 'סיים 5 משימות ברצף', points: 500 },
  { id: 'hametz', name: 'מנקה חמץ', icon: 'search', description: 'סיים את משימת בדיקת החמץ', points: 200 },
  { id: 'chef', name: 'שף הבית', icon: 'skillet', description: 'סיים 3 משימות בישול', points: 350 },
];
