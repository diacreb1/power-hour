'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Target,
  Heart,
  Briefcase,
  Dumbbell,
  Users,
  Sparkles,
  ChevronRight,
  Check,
  Flame,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { db, type Goal, type Habit } from '@/lib/db';
import { cn, getDateString, generateId } from '@/lib/utils';

const categoryIcons = {
  spiritual: Sparkles,
  personal: Heart,
  professional: Briefcase,
  health: Dumbbell,
  relationships: Users,
};

const categoryColors = {
  spiritual: { main: 'hsl(var(--lavender))', bg: 'hsl(var(--lavender)/0.12)' },
  personal: { main: 'hsl(var(--gold))', bg: 'hsl(var(--gold)/0.12)' },
  professional: { main: 'hsl(var(--primary))', bg: 'hsl(var(--primary)/0.12)' },
  health: { main: 'hsl(var(--sage))', bg: 'hsl(var(--sage)/0.12)' },
  relationships: { main: 'hsl(220 80% 58%)', bg: 'hsl(220 80% 58% / 0.12)' },
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<Goal['category']>('personal');
  const [newHabitTitle, setNewHabitTitle] = useState('');

  useEffect(() => {
    db.goals.toArray().then(setGoals);
    db.habits.toArray().then(setHabits);
  }, []);

  const addGoal = async () => {
    if (!newGoalTitle.trim()) return;

    const goal: Omit<Goal, 'id'> = {
      title: newGoalTitle.trim(),
      description: '',
      category: newGoalCategory,
      progress: 0,
      milestones: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const id = await db.goals.add(goal as Goal);
    setGoals([...goals, { ...goal, id } as Goal]);
    setNewGoalTitle('');
    setShowNewGoal(false);
  };

  const addHabit = async () => {
    if (!newHabitTitle.trim()) return;

    const habit: Omit<Habit, 'id'> = {
      title: newHabitTitle.trim(),
      icon: '⭐',
      frequency: 'daily',
      streak: 0,
      completedDates: [],
      createdAt: new Date(),
    };

    const id = await db.habits.add(habit as Habit);
    setHabits([...habits, { ...habit, id } as Habit]);
    setNewHabitTitle('');
    setShowNewHabit(false);
  };

  const toggleHabitToday = async (habit: Habit) => {
    const today = getDateString();
    const isCompletedToday = habit.completedDates.includes(today);

    let newCompletedDates: string[];
    let newStreak: number;

    if (isCompletedToday) {
      newCompletedDates = habit.completedDates.filter((d) => d !== today);
      newStreak = Math.max(0, habit.streak - 1);
    } else {
      newCompletedDates = [...habit.completedDates, today];
      newStreak = habit.streak + 1;
    }

    await db.habits.update(habit.id!, {
      completedDates: newCompletedDates,
      streak: newStreak,
    });

    setHabits(
      habits.map((h) =>
        h.id === habit.id
          ? { ...h, completedDates: newCompletedDates, streak: newStreak }
          : h
      )
    );
  };

  const today = getDateString();

  return (
    <div className="min-h-screen pb-28">
      <Header title="Goals & Habits" subtitle="Build your future" />

      <main className="px-5 space-y-8">
        {/* Habits Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold tracking-tight">Daily Habits</h2>
            <motion.button
              onClick={() => setShowNewHabit(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors haptic"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {habits.map((habit, index) => {
                const isCompletedToday = habit.completedDates.includes(today);
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Card
                      className={cn(
                        'flex items-center gap-4 cursor-pointer transition-all duration-300',
                        isCompletedToday && 'card-sage'
                      )}
                      onClick={() => toggleHabitToday(habit)}
                    >
                      {/* Checkbox */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                          'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 haptic flex-shrink-0',
                          isCompletedToday
                            ? 'bg-gradient-to-br from-[hsl(var(--sage))] to-[hsl(158_40%_42%)] shadow-[0_4px_12px_hsl(var(--sage)/0.3)]'
                            : 'border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--sage))]'
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {isCompletedToday && (
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <Check className="w-6 h-6 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-semibold text-[16px] transition-colors duration-300',
                            isCompletedToday && 'text-[hsl(var(--sage))]'
                          )}
                        >
                          {habit.title}
                        </p>
                        {habit.streak > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1.5 mt-1"
                          >
                            <Flame className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                              {habit.streak} day streak
                            </span>
                          </motion.div>
                        )}
                      </div>

                      <span className="text-3xl">{habit.icon}</span>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {habits.length === 0 && !showNewHabit && (
              <Card className="text-center py-10">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--sage)/0.1)] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[hsl(var(--sage))]" />
                </div>
                <p className="text-[hsl(var(--muted-foreground))]">
                  No habits yet. Add one to start building consistency.
                </p>
              </Card>
            )}

            {/* New Habit Form */}
            <AnimatePresence>
              {showNewHabit && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <input
                      type="text"
                      value={newHabitTitle}
                      onChange={(e) => setNewHabitTitle(e.target.value)}
                      placeholder="New habit..."
                      className="input mb-4"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowNewHabit(false)}
                        className="btn btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addHabit}
                        disabled={!newHabitTitle.trim()}
                        className="btn flex-1 disabled:opacity-40"
                      >
                        Add Habit
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* Goals Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold tracking-tight">Goals</h2>
            <motion.button
              onClick={() => setShowNewGoal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors haptic"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {goals.map((goal, index) => {
                const Icon = categoryIcons[goal.category];
                const colors = categoryColors[goal.category];

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Card className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.bg }}
                      >
                        <Icon className="w-6 h-6" style={{ color: colors.main }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[16px] truncate">{goal.title}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: colors.main }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[hsl(var(--muted-foreground))] tabular-nums">
                            {goal.progress}%
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {goals.length === 0 && !showNewGoal && (
              <Card className="text-center py-10">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
                  <Target className="w-7 h-7 text-[hsl(var(--primary))]" />
                </div>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Set your first goal
                </p>
              </Card>
            )}

            {/* New Goal Form */}
            <AnimatePresence>
              {showNewGoal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <input
                      type="text"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="What do you want to achieve?"
                      className="input mb-4"
                      autoFocus
                    />

                    <div className="flex flex-wrap gap-2.5 mb-4">
                      {(Object.keys(categoryIcons) as Goal['category'][]).map((cat) => {
                        const Icon = categoryIcons[cat];
                        const colors = categoryColors[cat];
                        const isSelected = newGoalCategory === cat;

                        return (
                          <motion.button
                            key={cat}
                            onClick={() => setNewGoalCategory(cat)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 haptic',
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-offset-[hsl(var(--background))]'
                                : 'opacity-60 hover:opacity-100'
                            )}
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.main,
                              ...(isSelected && { ringColor: colors.main }),
                            }}
                          >
                            <Icon className="w-4 h-4" />
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowNewGoal(false)}
                        className="btn btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addGoal}
                        disabled={!newGoalTitle.trim()}
                        className="btn flex-1 disabled:opacity-40"
                      >
                        Add Goal
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
