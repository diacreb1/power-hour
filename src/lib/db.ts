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

// Database
const db = new Dexie('PowerHourDB') as Dexie & {
  dayPlans: EntityTable<DayPlan, 'id'>;
  goals: EntityTable<Goal, 'id'>;
  habits: EntityTable<Habit, 'id'>;
  scriptures: EntityTable<Scripture, 'id'>;
  settings: EntityTable<Settings, 'id'>;
};

db.version(1).stores({
  dayPlans: '++id, date',
  goals: '++id, category',
  habits: '++id',
  scriptures: '++id, savedAt',
  settings: '++id',
});

export { db };

// Helper functions
export async function getTodayPlan(): Promise<DayPlan | undefined> {
  const today = new Date().toISOString().split('T')[0];
  return db.dayPlans.where('date').equals(today).first();
}

export async function getOrCreateTodayPlan(): Promise<DayPlan> {
  const today = new Date().toISOString().split('T')[0];
  let plan = await db.dayPlans.where('date').equals(today).first();
  
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
    const id = await db.dayPlans.add(newPlan as DayPlan);
    plan = { ...newPlan, id } as DayPlan;
  }
  
  return plan;
}

export async function updateDayPlan(id: number, updates: Partial<DayPlan>): Promise<void> {
  await db.dayPlans.update(id, { ...updates, updatedAt: new Date() });
}

export async function getWeekPlans(startDate: Date): Promise<DayPlan[]> {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return db.dayPlans.where('date').anyOf(dates).toArray();
}

export async function getSettings(): Promise<Settings> {
  let settings = await db.settings.toCollection().first();
  if (!settings) {
    const defaultSettings: Omit<Settings, 'id'> = {
      theme: 'system',
      workdayStart: 6,
      workdayEnd: 22,
      notificationsEnabled: false,
    };
    const id = await db.settings.add(defaultSettings as Settings);
    settings = { ...defaultSettings, id } as Settings;
  }
  return settings;
}

export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  const settings = await getSettings();
  await db.settings.update(settings.id!, updates);
}
