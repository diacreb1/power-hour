'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Circle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { getWeekDates, formatDayName, formatShortDate, cn, getDateString } from '@/lib/utils';
import { db, type DayPlan } from '@/lib/db';
import { addDays, format, isToday, startOfWeek } from 'date-fns';

export default function WeekPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [plans, setPlans] = useState<Map<string, DayPlan>>(new Map());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDates = getWeekDates(weekStart);

  useEffect(() => {
    async function loadWeekPlans() {
      const dates = weekDates.map((d) => getDateString(d));
      const dayPlans = await db.dayPlans.where('date').anyOf(dates).toArray();
      const planMap = new Map(dayPlans.map((p) => [p.date, p]));
      setPlans(planMap);
    }
    loadWeekPlans();
  }, [weekStart]);

  const goToPreviousWeek = () => {
    setWeekStart((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setWeekStart((prev) => addDays(prev, 7));
  };

  const goToToday = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
    setSelectedDate(new Date());
  };

  const selectedPlan = plans.get(getDateString(selectedDate));
  const completedPriorities = selectedPlan?.priorities.filter((p) => p.completed).length || 0;
  const totalPriorities = selectedPlan?.priorities.length || 0;

  return (
    <div className="min-h-screen pb-28">
      <Header title="Week View" subtitle={format(weekStart, 'MMMM yyyy')}>
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm font-medium text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] rounded-lg haptic"
        >
          Today
        </button>
      </Header>

      <main className="px-5 space-y-5">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors haptic"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-1.5">
            {weekDates.map((date) => {
              const dateStr = getDateString(date);
              const plan = plans.get(dateStr);
              const isSelected = dateStr === getDateString(selectedDate);
              const hasContent = plan && (plan.priorities.length > 0 || plan.morningIntention);
              const allComplete =
                plan &&
                plan.priorities.length > 0 &&
                plan.priorities.every((p) => p.completed);

              return (
                <motion.button
                  key={dateStr}
                  onClick={() => setSelectedDate(date)}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center py-2 px-3 rounded-2xl transition-all haptic min-w-[44px]',
                    isSelected
                      ? 'bg-[hsl(var(--primary))] text-white'
                      : isToday(date)
                      ? 'bg-[hsl(var(--primary)/0.1)]'
                      : 'hover:bg-[hsl(var(--muted))]'
                  )}
                >
                  <span className="text-[10px] font-medium uppercase opacity-70">
                    {formatDayName(date)}
                  </span>
                  <span className="text-lg font-semibold">{format(date, 'd')}</span>
                  
                  {/* Indicator dot */}
                  <div className="h-1.5 mt-1">
                    {allComplete ? (
                      <div
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isSelected ? 'bg-white' : 'bg-[hsl(var(--sage))]'
                        )}
                      />
                    ) : hasContent ? (
                      <div
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isSelected ? 'bg-white/60' : 'bg-[hsl(var(--muted-foreground)/0.3)]'
                        )}
                      />
                    ) : null}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={goToNextWeek}
            className="p-2 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors haptic"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Day Summary */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              {isToday(selectedDate) && (
                <span className="text-xs text-[hsl(var(--primary))] font-medium">Today</span>
              )}
            </div>
            
            {totalPriorities > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--muted))] rounded-full">
                <span className="text-sm font-medium">
                  {completedPriorities}/{totalPriorities}
                </span>
                {completedPriorities === totalPriorities && (
                  <Check className="w-4 h-4 text-[hsl(var(--sage))]" />
                )}
              </div>
            )}
          </div>

          {selectedPlan ? (
            <div className="space-y-4">
              {/* Morning Intention */}
              {selectedPlan.morningIntention && (
                <div className="p-3 bg-[hsl(var(--muted))] rounded-xl">
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1">
                    Intention
                  </p>
                  <p className="text-sm leading-relaxed line-clamp-2">
                    {selectedPlan.morningIntention}
                  </p>
                </div>
              )}

              {/* Priorities */}
              {selectedPlan.priorities.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    Priorities
                  </p>
                  {selectedPlan.priorities.map((priority, index) => (
                    <div
                      key={priority.id}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-lg',
                        priority.completed && 'opacity-60'
                      )}
                    >
                      {priority.completed ? (
                        <Check className="w-4 h-4 text-[hsl(var(--sage))]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          priority.completed && 'line-through text-[hsl(var(--muted-foreground))]'
                        )}
                      >
                        {priority.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Gratitude */}
              {selectedPlan.gratitude.length > 0 && (
                <div className="p-3 bg-[hsl(var(--sage-light))] rounded-xl">
                  <p className="text-xs font-medium text-[hsl(var(--sage))] mb-2">
                    Gratitude
                  </p>
                  {selectedPlan.gratitude.map((item, i) => (
                    <p key={i} className="text-sm leading-relaxed">
                      • {item}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
              <p className="text-sm">No plan for this day</p>
              {isToday(selectedDate) && (
                <p className="text-xs mt-1">
                  Start planning on the Today tab
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Week Stats */}
        <Card className="bg-gradient-to-br from-[hsl(var(--primary)/0.05)] to-transparent">
          <h3 className="font-semibold mb-4">This Week</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[hsl(var(--primary))]">
                {Array.from(plans.values()).reduce(
                  (acc, p) => acc + p.priorities.filter((pr) => pr.completed).length,
                  0
                )}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[hsl(var(--gold))]">
                {Array.from(plans.values()).filter((p) => p.morningIntention).length}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Days Planned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[hsl(var(--sage))]">
                {Array.from(plans.values()).reduce(
                  (acc, p) => acc + p.gratitude.length,
                  0
                )}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Gratitudes</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
