import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskStatus, TaskPriority, TaskCategory } from '../types';

interface FilterState {
  search: string;
  category: TaskCategory | 'all';
  priority: TaskPriority | 'all';
  assignee: string | 'all';
}

interface TaskStore {
  tasks: Task[];
  filters: FilterState;
  activeView: 'kanban' | 'list';

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;

  // Filter actions
  setSearch: (search: string) => void;
  setFilterCategory: (category: TaskCategory | 'all') => void;
  setFilterPriority: (priority: TaskPriority | 'all') => void;
  setFilterAssignee: (assignee: string | 'all') => void;
  clearFilters: () => void;

  // View
  setView: (view: 'kanban' | 'list') => void;

  // Selectors
  getTasksByStatus: (status: TaskStatus) => Task[];
  getFilteredTasks: () => Task[];
}

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'ניקיון הכללי של הבית',
    description: 'ניקוי יסודי של כל חדרי הבית לפני פסח',
    status: 'todo',
    priority: 'high',
    category: 'cleaning',
    assignee: 'אמא',
    dueDate: '2026-04-08',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'קניית מצות',
    description: 'לקנות מצות שמורות ורגילות לכל ימי החג',
    status: 'todo',
    priority: 'high',
    category: 'shopping',
    assignee: 'אבא',
    dueDate: '2026-04-09',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'הכנת קערת הסדר',
    description: 'להכין את כל המרכיבים לקערת הסדר: זרוע, ביצה, מרור, חרוסת, כרפס וחזרת',
    status: 'inprogress',
    priority: 'high',
    category: 'ceremony',
    assignee: 'אמא',
    dueDate: '2026-04-12',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'הזמנת אורחים לסדר',
    description: 'לשלוח הזמנות לסבא וסבתא, דודים ודודות',
    status: 'done',
    priority: 'medium',
    category: 'guests',
    assignee: 'שרה',
    dueDate: '2026-04-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'בדיקת חמץ',
    description: 'בדיקת חמץ לאור הנר בליל י"ג ניסן',
    status: 'todo',
    priority: 'high',
    category: 'ceremony',
    assignee: 'אבא',
    dueDate: '2026-04-11',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'הכנת ארוחות חג',
    description: 'תכנון ובישול ארוחות לכל ימי החג',
    status: 'inprogress',
    priority: 'medium',
    category: 'food',
    assignee: 'אמא',
    dueDate: '2026-04-12',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'הכנת משחקים לילדים לסדר',
    description: 'להכין פעילויות ומשחקים לילדים בזמן הסדר',
    status: 'todo',
    priority: 'low',
    category: 'kids',
    assignee: 'שרה',
    dueDate: '2026-04-12',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'החלפת כלים לפסח',
    description: 'להוציא ולהכין את כלי הפסח',
    status: 'done',
    priority: 'high',
    category: 'cleaning',
    assignee: 'דוד',
    dueDate: '2026-04-07',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const applyFilters = (tasks: Task[], filters: FilterState): Task[] => {
  return tasks.filter((task) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!task.title.toLowerCase().includes(q) && !task.description?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filters.category !== 'all' && task.category !== filters.category) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.assignee !== 'all' && task.assignee !== filters.assignee) return false;
    return true;
  });
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: DEFAULT_TASKS,
      filters: {
        search: '',
        category: 'all',
        priority: 'all',
        assignee: 'all',
      },
      activeView: 'kanban',

      addTask: (taskData) => {
        const now = new Date().toISOString();
        const task: Task = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },

      moveTask: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
      setFilterCategory: (category) => set((state) => ({ filters: { ...state.filters, category } })),
      setFilterPriority: (priority) => set((state) => ({ filters: { ...state.filters, priority } })),
      setFilterAssignee: (assignee) => set((state) => ({ filters: { ...state.filters, assignee } })),
      clearFilters: () =>
        set({ filters: { search: '', category: 'all', priority: 'all', assignee: 'all' } }),

      setView: (view) => set({ activeView: view }),

      getTasksByStatus: (status) => {
        const { tasks, filters } = get();
        return applyFilters(tasks, filters).filter((t) => t.status === status);
      },

      getFilteredTasks: () => {
        const { tasks, filters } = get();
        return applyFilters(tasks, filters);
      },
    }),
    {
      name: 'gotin-passover-tasks',
    }
  )
);
