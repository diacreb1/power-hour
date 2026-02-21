import Dexie, { type EntityTable } from 'dexie';

// Types
export interface DayPlan {
  id?: number;
  date: string; // YYYY-MM-DD
  morningIntention: string;
  morningPrayer: string;
  priorities: Priority[];
  timeBlocks: TimeBlock[];
  eveningReflection: string;
  gratitude: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Priority {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface TimeBlock {
  id: string;
  hour: number; // 0-23
  task: string;
  completed: boolean;
}

export interface Goal {
  id?: number;
  title: string;
  description: string;
  category: 'spiritual' | 'personal' | 'professional' | 'health' | 'relationships';
  targetDate?: string;
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  text: string;
  completed: boolean;
}

export interface Habit {
  id?: number;
  title: string;
  icon: string;
  frequency: 'daily' | 'weekly';
  targetDays?: number[]; // 0-6 for weekly habits
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
  createdAt: Date;
}

export interface Scripture {
  id?: number;
  verse: string;
  reference: string;
  reflection?: string;
  savedAt: Date;
}

export interface Settings {
  id?: number;
  theme: 'light' | 'dark' | 'system';
  workdayStart: number;
  workdayEnd: number;
  notificationsEnabled: boolean;
  morningReminderTime?: string;
  eveningReminderTime?: string;
}

type PowerHourDB = Dexie & {
  dayPlans: EntityTable<DayPlan, 'id'>;
  goals: EntityTable<Goal, 'id'>;
  habits: EntityTable<Habit, 'id'>;
  scriptures: EntityTable<Scripture, 'id'>;
  settings: EntityTable<Settings, 'id'>;
};

// Database - lazy initialization for SSR safety
let _db: PowerHourDB | null = null;

function getDB(): PowerHourDB {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is not available on the server');
  }
  
  if (!_db) {
    _db = new Dexie('PowerHourDB') as PowerHourDB;

    _db.version(1).stores({
      dayPlans: '++id, date',
      goals: '++id, category',
      habits: '++id',
      scriptures: '++id, savedAt',
      settings: '++id',
    });
  }
  
  return _db;
}

// Proxy to lazily access the database
export const db = new Proxy({} as PowerHourDB, {
  get(_, prop) {
    const database = getDB();
    const value = database[prop as keyof PowerHourDB];
    if (typeof value === 'function') {
      return value.bind(database);
    }
    return value;
  }
});

// Helper functions
export async function getTodayPlan(): Promise<DayPlan | undefined> {
  const database = getDB();
  const today = new Date().toISOString().split('T')[0];
  return database.dayPlans.where('date').equals(today).first();
}

export async function getOrCreateTodayPlan(): Promise<DayPlan> {
  const database = getDB();
  const today = new Date().toISOString().split('T')[0];
  let plan = await database.dayPlans.where('date').equals(today).first();
  
  if (!plan) {
    const newPlan: Omit<DayPlan, 'id'> = {
      date: today,
      morningIntention: '',
      morningPrayer: '',
      priorities: [],
      timeBlocks: [],
      eveningReflection: '',
      gratitude: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const id = await database.dayPlans.add(newPlan as DayPlan);
    plan = { ...newPlan, id } as DayPlan;
  }
  
  return plan;
}

export async function updateDayPlan(id: number, updates: Partial<DayPlan>): Promise<void> {
  const database = getDB();
  await database.dayPlans.update(id, { ...updates, updatedAt: new Date() });
}

export async function getWeekPlans(startDate: Date): Promise<DayPlan[]> {
  const database = getDB();
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return database.dayPlans.where('date').anyOf(dates).toArray();
}

export async function getSettings(): Promise<Settings> {
  const database = getDB();
  let settings = await database.settings.toCollection().first();
  if (!settings) {
    const defaultSettings: Omit<Settings, 'id'> = {
      theme: 'system',
      workdayStart: 6,
      workdayEnd: 22,
      notificationsEnabled: false,
    };
    const id = await database.settings.add(defaultSettings as Settings);
    settings = { ...defaultSettings, id } as Settings;
  }
  return settings;
}

export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  const database = getDB();
  const settings = await getSettings();
  await database.settings.update(settings.id!, updates);
}
