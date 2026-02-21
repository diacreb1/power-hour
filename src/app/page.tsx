'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Target, Clock, Moon, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card, CardHeader } from '@/components/Card';
import { ScriptureCard } from '@/components/ScriptureCard';
import { PriorityList } from '@/components/PriorityList';
import { TimeBlocks } from '@/components/TimeBlocks';
import { TextArea } from '@/components/TextArea';
import { GratitudeList } from '@/components/GratitudeList';
import { getOrCreateTodayPlan, updateDayPlan, type DayPlan, type Priority, type TimeBlock } from '@/lib/db';
import { getTimeOfDay } from '@/lib/utils';

export default function TodayPage() {
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const timeOfDay = getTimeOfDay();

  useEffect(() => {
    getOrCreateTodayPlan().then((p) => {
      setPlan(p);
      setLoading(false);
    });
  }, []);

  const savePlan = useCallback(
    async (updates: Partial<DayPlan>) => {
      if (!plan?.id) return;
      await updateDayPlan(plan.id, updates);
      setPlan((prev) => (prev ? { ...prev, ...updates } : prev));
    },
    [plan?.id]
  );

  const handlePrioritiesChange = (priorities: Priority[]) => {
    savePlan({ priorities });
  };

  const handleTimeBlocksChange = (timeBlocks: TimeBlock[]) => {
    savePlan({ timeBlocks });
  };

  const handleGratitudeChange = (gratitude: string[]) => {
    savePlan({ gratitude });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Sparkles className="w-8 h-8 text-[hsl(var(--primary))] animate-pulse-soft" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading your day...</p>
        </motion.div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen pb-28">
      <Header showGreeting />

      <main className="px-5 space-y-5 stagger-children">
        {/* Daily Scripture */}
        <ScriptureCard compact />

        {/* Morning Section */}
        {timeOfDay === 'morning' && (
          <Card delay={0.1}>
            <CardHeader
              icon={<Sunrise className="w-5 h-5" />}
              title="Morning Intention"
              subtitle="Start your day with purpose"
            />
            <TextArea
              value={plan.morningIntention}
              onChange={(value) => savePlan({ morningIntention: value })}
              placeholder="What is your intention for today? What do you hope to accomplish and how do you want to show up?"
              minRows={3}
            />
          </Card>
        )}

        {/* Morning Prayer */}
        {timeOfDay === 'morning' && (
          <Card variant="lavender" delay={0.15}>
            <CardHeader
              icon={<Sparkles className="w-5 h-5" />}
              title="Morning Prayer"
              subtitle="Commit your day to God"
            />
            <TextArea
              value={plan.morningPrayer}
              onChange={(value) => savePlan({ morningPrayer: value })}
              placeholder="Lord, I offer this day to You. Guide my steps, guard my heart, and help me to..."
              minRows={3}
            />
          </Card>
        )}

        {/* Top 3 Priorities */}
        <Card delay={0.2}>
          <CardHeader
            icon={<Target className="w-5 h-5" />}
            title="Top 3 Priorities"
            subtitle="Focus on what matters most"
          />
          <PriorityList
            priorities={plan.priorities}
            onChange={handlePrioritiesChange}
            maxItems={3}
          />
        </Card>

        {/* Time Blocks */}
        <Card delay={0.25}>
          <CardHeader
            icon={<Clock className="w-5 h-5" />}
            title="Time Blocks"
            subtitle="Plan your hours"
          />
          <TimeBlocks
            timeBlocks={plan.timeBlocks}
            onChange={handleTimeBlocksChange}
          />
        </Card>

        {/* Evening Section */}
        {timeOfDay === 'evening' && (
          <>
            <Card delay={0.3}>
              <CardHeader
                icon={<Moon className="w-5 h-5" />}
                title="Evening Reflection"
                subtitle="Review your day"
              />
              <TextArea
                value={plan.eveningReflection}
                onChange={(value) => savePlan({ eveningReflection: value })}
                placeholder="How did today go? What worked well? What could you improve tomorrow?"
                minRows={3}
              />
            </Card>

            <Card variant="sage" delay={0.35}>
              <CardHeader
                icon={<Sparkles className="w-5 h-5" />}
                title="Gratitude"
                subtitle="Count your blessings"
              />
              <GratitudeList
                items={plan.gratitude}
                onChange={handleGratitudeChange}
                maxItems={3}
              />
            </Card>
          </>
        )}

        {/* Show condensed evening section in morning/afternoon */}
        {timeOfDay !== 'evening' && (
          <Card variant="sage" delay={0.3} className="opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--sage)/0.15)] flex items-center justify-center">
                <Moon className="w-5 h-5 text-[hsl(var(--sage))]" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Evening Reflection</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Available this evening
                </p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
