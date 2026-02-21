'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Circle, Calendar, Sparkles, Heart } from 'lucide-react';
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
        <motion.button
          onClick={goToToday}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 text-sm font-semibold text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)] rounded-xl haptic transition-all duration-300 hover:bg-[hsl(var(--primary)/0.15)]"
        >
          Today
        </motion.button>
      </Header>

      <main className="px-5 space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between gap-2">
          <motion.button
            onClick={goToPreviousWeek}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors haptic"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center py-2.5 px-3.5 rounded-2xl transition-all duration-300 haptic min-w-[48px]',
                    isSelected
                      ? 'bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.9)] text-white shadow-[0_4px_12px_hsl(var(--primary)/0.3)]'
                      : isToday(date)
                      ? 'bg-[hsl(var(--primary)/0.1)] ring-1 ring-[hsl(var(--primary)/0.2)]'
                      : 'hover:bg-[hsl(var(--muted))]'
                  )}
                >
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wider',
                    isSelected ? 'opacity-80' : 'opacity-60'
                  )}>
                    {formatDayName(date)}
                  </span>
                  <span className="text-xl font-bold mt-0.5">{format(date, 'd')}</span>
                  
                  {/* Indicator dot */}
                  <div className="h-2 mt-1.5 flex items-center justify-center">
                    {allComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          'w-2 h-2 rounded-full',
                          isSelected ? 'bg-white' : 'bg-[hsl(var(--sage))]'
                        )}
                      />
                    ) : hasContent ? (
                      <div
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isSelected ? 'bg-white/60' : 'bg-[hsl(var(--muted-foreground)/0.4)]'
                        )}
                      />
                    ) : null}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <motion.button
            onClick={goToNextWeek}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors haptic"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Selected Day Summary */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-xl tracking-tight">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              {isToday(selectedDate) && (
                <span className="text-xs text-[hsl(var(--primary))] font-semibold mt-0.5 inline-block">Today</span>
              )}
            </div>
            
            {totalPriorities > 0 && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl',
                  completedPriorities === totalPriorities 
                    ? 'bg-[hsl(var(--sage)/0.15)]'
                    : 'bg-[hsl(var(--muted))]'
                )}
              >
                <span className="text-sm font-bold tabular-nums">
                  {completedPriorities}/{totalPriorities}
                </span>
                {completedPriorities === totalPriorities && (
                  <Check className="w-4 h-4 text-[hsl(var(--sage))]" strokeWidth={3} />
                )}
              </motion.div>
            )}
          </div>

          {selectedPlan ? (
            <div className="space-y-5">
              {/* Morning Intention */}
              {selectedPlan.morningIntention && (
                <div className="p-4 bg-gradient-to-r from-[hsl(var(--gold-light))] to-[hsl(var(--gold-medium)/0.3)] rounded-2xl border border-[hsl(var(--gold)/0.1)]">
                  <p className="text-xs font-semibold text-[hsl(var(--gold))] mb-2 tracking-wide">
                    Intention
                  </p>
                  <p className="text-[15px] leading-relaxed line-clamp-2">
                    {selectedPlan.morningIntention}
                  </p>
                </div>
              )}

              {/* Priorities */}
              {selectedPlan.priorities.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] tracking-wide">
                    Priorities
                  </p>
                  {selectedPlan.priorities.map((priority) => (
                    <motion.div
                      key={priority.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl',
                        priority.completed 
                          ? 'bg-[hsl(var(--sage-light))]' 
                          : 'bg-[hsl(var(--muted)/0.5)]'
                      )}
                    >
                      {priority.completed ? (
                        <div className="w-5 h-5 rounded-lg bg-[hsl(var(--sage))] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                      )}
                      <span
                        className={cn(
                          'text-[15px]',
                          priority.completed && 'line-through text-[hsl(var(--muted-foreground))]'
                        )}
                      >
                        {priority.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Gratitude */}
              {selectedPlan.gratitude.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-[hsl(var(--sage-light))] to-[hsl(var(--sage-medium)/0.3)] rounded-2xl border border-[hsl(var(--sage)/0.1)]">
                  <p className="text-xs font-semibold text-[hsl(var(--sage))] mb-2 tracking-wide flex items-center gap-1.5">
                    <Heart className="w-3 h-3 fill-current" />
                    Gratitude
                  </p>
                  {selectedPlan.gratitude.map((item, i) => (
                    <p key={i} className="text-[15px] leading-relaxed">
                      • {item}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center">
                <Calendar className="w-7 h-7 text-[hsl(var(--muted-foreground))]" />
              </div>
              <p className="text-[15px] text-[hsl(var(--muted-foreground))]">No plan for this day</p>
              {isToday(selectedDate) && (
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5">
                  Start planning on the Today tab
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Week Stats */}
        <Card className="bg-gradient-to-br from-[hsl(var(--primary)/0.04)] via-transparent to-[hsl(var(--gold)/0.04)]">
          <h3 className="font-semibold text-lg tracking-tight mb-5">This Week</h3>
          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 rounded-2xl bg-[hsl(var(--primary)/0.08)]"
            >
              <p className="text-3xl font-bold text-gradient-primary">
                {Array.from(plans.values()).reduce(
                  (acc, p) => acc + p.priorities.filter((pr) => pr.completed).length,
                  0
                )}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium mt-1">Completed</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center p-4 rounded-2xl bg-[hsl(var(--gold)/0.1)]"
            >
              <p className="text-3xl font-bold text-gradient-gold">
                {Array.from(plans.values()).filter((p) => p.morningIntention).length}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium mt-1">Days Planned</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-4 rounded-2xl bg-[hsl(var(--sage)/0.1)]"
            >
              <p className="text-3xl font-bold" style={{ color: 'hsl(var(--sage))' }}>
                {Array.from(plans.values()).reduce(
                  (acc, p) => acc + p.gratitude.length,
                  0
                )}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium mt-1">Gratitudes</p>
            </motion.div>
          </div>
        </Card>
      </main>
    </div>
  );
}
