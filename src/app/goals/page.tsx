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
  spiritual: 'hsl(var(--lavender))',
  personal: 'hsl(var(--gold))',
  professional: 'hsl(var(--primary))',
  health: 'hsl(var(--sage))',
  relationships: 'hsl(220 90% 60%)',
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

      <main className="px-5 space-y-6">
        {/* Habits Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Daily Habits</h2>
            <button
              onClick={() => setShowNewHabit(true)}
              className="p-2 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors haptic"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {habits.map((habit) => {
                const isCompletedToday = habit.completedDates.includes(today);
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <Card
                      className={cn(
                        'flex items-center gap-4 cursor-pointer',
                        isCompletedToday && 'bg-[hsl(var(--sage-light))]'
                      )}
                      onClick={() => toggleHabitToday(habit)}
                    >
                      <button
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center transition-all haptic',
                          isCompletedToday
                            ? 'bg-[hsl(var(--sage))]'
                            : 'border-2 border-[hsl(var(--border))]'
                        )}
                      >
                        {isCompletedToday && <Check className="w-5 h-5 text-white" />}
                      </button>

                      <div className="flex-1">
                        <p
                          className={cn(
                            'font-medium',
                            isCompletedToday && 'text-[hsl(var(--sage))]'
                          )}
                        >
                          {habit.title}
                        </p>
                        {habit.streak > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                              {habit.streak} day streak
                            </span>
                          </div>
                        )}
                      </div>

                      <span className="text-2xl">{habit.icon}</span>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {habits.length === 0 && !showNewHabit && (
              <Card className="text-center py-8">
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
                >
                  <Card>
                    <input
                      type="text"
                      value={newHabitTitle}
                      onChange={(e) => setNewHabitTitle(e.target.value)}
                      placeholder="New habit..."
                      className="input mb-3"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowNewHabit(false)}
                        className="btn btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addHabit}
                        disabled={!newHabitTitle.trim()}
                        className="btn flex-1 disabled:opacity-50"
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

        {/* Goals Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Goals</h2>
            <button
              onClick={() => setShowNewGoal(true)}
              className="p-2 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors haptic"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {goals.map((goal) => {
                const Icon = categoryIcons[goal.category];
                const color = categoryColors[goal.category];

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <Card className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{goal.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                          <span className="text-xs text-[hsl(var(--muted-foreground))] font-medium">
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
              <Card className="text-center py-8">
                <Target className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
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
                >
                  <Card>
                    <input
                      type="text"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="What do you want to achieve?"
                      className="input mb-3"
                      autoFocus
                    />

                    <div className="flex flex-wrap gap-2 mb-3">
                      {(Object.keys(categoryIcons) as Goal['category'][]).map((cat) => {
                        const Icon = categoryIcons[cat];
                        const color = categoryColors[cat];
                        const isSelected = newGoalCategory === cat;

                        return (
                          <button
                            key={cat}
                            onClick={() => setNewGoalCategory(cat)}
                            className={cn(
                              'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all haptic',
                              isSelected
                                ? 'ring-2 ring-offset-2'
                                : 'opacity-60 hover:opacity-100'
                            )}
                            style={{
                              backgroundColor: `${color}15`,
                              color: color,
                              ...(isSelected && { ringColor: color }),
                            }}
                          >
                            <Icon className="w-4 h-4" />
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowNewGoal(false)}
                        className="btn btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addGoal}
                        disabled={!newGoalTitle.trim()}
                        className="btn flex-1 disabled:opacity-50"
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
