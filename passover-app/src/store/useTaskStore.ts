import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Task, TaskStatus, TaskPriority, TaskCategory,
  FamilyMember, AppView, Badge,
} from '../types';
import { DEFAULT_BADGES as BADGE_TEMPLATES } from '../types';

interface FilterState {
  search: string;
  category: TaskCategory | 'all';
  priority: TaskPriority | 'all';
  assigneeId: string | 'all';
}

interface TaskStore {
  tasks: Task[];
  familyMembers: FamilyMember[];
  currentMemberId: string;
  profileMemberId: string | null;
  filters: FilterState;
  activeView: AppView;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;

  // Family member actions
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'points' | 'badges' | 'tasksDone'>) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  awardPoints: (memberId: string, points: number) => void;

  // Filter actions
  setSearch: (s: string) => void;
  setFilterCategory: (c: TaskCategory | 'all') => void;
  setFilterPriority: (p: TaskPriority | 'all') => void;
  setFilterAssignee: (id: string | 'all') => void;
  clearFilters: () => void;

  // Navigation
  setView: (view: AppView) => void;
  setProfileMember: (id: string | null) => void;

  // Selectors
  getTasksByStatus: (status: TaskStatus) => Task[];
  getFilteredTasks: () => Task[];
  getMemberById: (id: string) => FamilyMember | undefined;
  getLeaderboard: () => FamilyMember[];
}

function makeBadges(): Badge[] {
  return BADGE_TEMPLATES.map(b => ({ ...b, earned: false }));
}

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: 'm1', name: 'מיכל גוטין', color: '#890045', role: 'leader', points: 1850, tasksDone: 24, badges: [
    ...makeBadges().map((b, i) => ({ ...b, earned: i < 3, earnedAt: i < 3 ? new Date().toISOString() : undefined }))
  ]},
  { id: 'm2', name: 'יונתן גוטין', color: '#004484', role: 'participant', points: 1420, tasksDone: 18, badges: makeBadges().map((b, i) => ({ ...b, earned: i < 2 })) },
  { id: 'm3', name: 'דניאל גוטין', color: '#005bae', role: 'participant', points: 1280, tasksDone: 15, badges: makeBadges().map((b, i) => ({ ...b, earned: i < 1 })) },
  { id: 'm4', name: 'סבא אברהם', color: '#345681', role: 'participant', points: 950, tasksDone: 12, badges: makeBadges() },
  { id: 'm5', name: 'סבתא שרה', color: '#3f608b', role: 'participant', points: 880, tasksDone: 10, badges: makeBadges() },
  { id: 'm6', name: 'רועי גוטין', color: '#FFB1C7', role: 'participant', points: 420, tasksDone: 5, badges: makeBadges() },
];

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'ניקיון יסודי של המטבח', description: 'ניקוי מגרות, ארונות ופינות - הכנה להכשרה', status: 'inprogress', priority: 'high', category: 'cleaning', assigneeId: 'm2', dueDate: '2026-04-08', points: 92, progress: 65, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'קניית מצות שמורה עבודת יד', description: 'איסוף המארז מהמאפייה בשכונה הירוקה', status: 'todo', priority: 'high', category: 'shopping', assigneeId: 'm3', dueDate: '2026-04-09', points: 85, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'בדיקת מלאי יין ל-4 כוסות', description: 'לוודא שיש מספיק יין מובחר לכל המשתתפים', status: 'todo', priority: 'medium', category: 'ceremony', assigneeId: 'm4', dueDate: '2026-04-10', points: 40, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', title: 'הכנת קערת הסדר', description: 'כל המרכיבים: זרוע, ביצה, מרור, חרוסת, כרפס', status: 'todo', priority: 'high', category: 'ceremony', assigneeId: 'm1', dueDate: '2026-04-12', points: 120, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', title: 'עיצוב הגדת המשפחה', description: 'עיצוב והדפסה של ההגדה המיוחדת של משפחת גוטין', status: 'inprogress', priority: 'medium', category: 'ceremony', assigneeId: 'm1', dueDate: '2026-04-11', points: 300, progress: 65, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', title: 'הזמנת שולחן וכיסאות לאורחים', description: 'סידור מקומות ישיבה לכל המשתתפים בסדר', status: 'done', priority: 'medium', category: 'guests', assigneeId: 'm5', dueDate: '2026-04-07', points: 30, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', title: 'הכנת חרוסת לפי המתכון הסודי', status: 'todo', priority: 'medium', category: 'food', assigneeId: 'm3', dueDate: '2026-04-12', points: 75, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '8', title: 'הכנת פעילות לילדים בסדר', description: 'משחקים ופעילויות לשמור על הילדים ערניים', status: 'todo', priority: 'low', category: 'kids', assigneeId: 'm1', dueDate: '2026-04-12', points: 100, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '9', title: 'בדיקת חמץ בליל י"ג ניסן', status: 'todo', priority: 'high', category: 'ceremony', assigneeId: 'm2', dueDate: '2026-04-11', points: 150, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '10', title: 'הכנת חרוסת בלאדי', status: 'done', priority: 'medium', category: 'food', assigneeId: 'm5', dueDate: '2026-04-06', points: 60, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '11', title: 'החלפת כלים לפסח', description: 'הוצאת כלי הפסח מהאחסון וסידורם', status: 'done', priority: 'high', category: 'cleaning', assigneeId: 'm6', dueDate: '2026-04-07', points: 80, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '12', title: 'רכישת 4 סוגי יינות מובחרים', status: 'done', priority: 'medium', category: 'shopping', assigneeId: 'm4', dueDate: '2026-04-05', points: 50, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

function applyFilters(tasks: Task[], filters: FilterState): Task[] {
  return tasks.filter(t => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q)) return false;
    }
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    if (filters.assigneeId !== 'all' && t.assigneeId !== filters.assigneeId) return false;
    return true;
  });
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: DEFAULT_TASKS,
      familyMembers: DEFAULT_MEMBERS,
      currentMemberId: 'm2',
      profileMemberId: null,
      filters: { search: '', category: 'all', priority: 'all', assigneeId: 'all' },
      activeView: 'dashboard',

      addTask: (taskData) => {
        const now = new Date().toISOString();
        const task: Task = { ...taskData, id: `t-${Date.now()}`, createdAt: now, updatedAt: now };
        set(s => ({ tasks: [...s.tasks, task] }));
      },

      updateTask: (id, updates) => {
        set(s => ({
          tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
        }));
      },

      deleteTask: (id) => set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

      moveTask: (id, status) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;
        const wasntDone = task.status !== 'done';
        const nowDone = status === 'done';
        set(s => ({
          tasks: s.tasks.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)
        }));
        // Award points when task moves to done
        if (wasntDone && nowDone && task.assigneeId) {
          get().awardPoints(task.assigneeId, task.points);
        }
      },

      addFamilyMember: (memberData) => {
        const member: FamilyMember = {
          ...memberData,
          id: `m-${Date.now()}`,
          points: 0,
          tasksDone: 0,
          badges: makeBadges(),
        };
        set(s => ({ familyMembers: [...s.familyMembers, member] }));
      },

      updateFamilyMember: (id, updates) => {
        set(s => ({
          familyMembers: s.familyMembers.map(m => m.id === id ? { ...m, ...updates } : m)
        }));
      },

      deleteFamilyMember: (id) => set(s => ({
        familyMembers: s.familyMembers.filter(m => m.id !== id)
      })),

      awardPoints: (memberId, points) => {
        set(s => ({
          familyMembers: s.familyMembers.map(m =>
            m.id === memberId
              ? { ...m, points: m.points + points, tasksDone: m.tasksDone + 1 }
              : m
          )
        }));
      },

      setSearch: (search) => set(s => ({ filters: { ...s.filters, search } })),
      setFilterCategory: (category) => set(s => ({ filters: { ...s.filters, category } })),
      setFilterPriority: (priority) => set(s => ({ filters: { ...s.filters, priority } })),
      setFilterAssignee: (assigneeId) => set(s => ({ filters: { ...s.filters, assigneeId } })),
      clearFilters: () => set({ filters: { search: '', category: 'all', priority: 'all', assigneeId: 'all' } }),

      setView: (view) => set({ activeView: view }),
      setProfileMember: (id) => set({ profileMemberId: id, activeView: id ? 'profile' : 'dashboard' }),

      getTasksByStatus: (status) => {
        const { tasks, filters } = get();
        return applyFilters(tasks, filters).filter(t => t.status === status);
      },

      getFilteredTasks: () => {
        const { tasks, filters } = get();
        return applyFilters(tasks, filters);
      },

      getMemberById: (id) => get().familyMembers.find(m => m.id === id),

      getLeaderboard: () => [...get().familyMembers].sort((a, b) => b.points - a.points),
    }),
    { name: 'gotin-passover-2026' }
  )
);
