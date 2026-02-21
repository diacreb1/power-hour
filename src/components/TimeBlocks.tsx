'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { type TimeBlock } from '@/lib/db';
import { formatTime, generateId, cn } from '@/lib/utils';

interface TimeBlocksProps {
  timeBlocks: TimeBlock[];
  onChange: (blocks: TimeBlock[]) => void;
  startHour?: number;
  endHour?: number;
}

export function TimeBlocks({
  timeBlocks,
  onChange,
  startHour = 6,
  endHour = 22,
}: TimeBlocksProps) {
  const [expanded, setExpanded] = useState(false);
  const currentHour = new Date().getHours();
  
  // Generate all hours in range
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  
  // Determine which hours to show
  const relevantHours = expanded
    ? hours
    : hours.filter((h) => {
        // Show current hour and next 4 hours
        return h >= currentHour - 1 && h <= currentHour + 4;
      });

  const getBlockForHour = (hour: number) =>
    timeBlocks.find((b) => b.hour === hour);

  const updateBlock = (hour: number, task: string) => {
    const existing = getBlockForHour(hour);
    if (existing) {
      onChange(
        timeBlocks.map((b) =>
          b.hour === hour ? { ...b, task } : b
        )
      );
    } else {
      onChange([
        ...timeBlocks,
        { id: generateId(), hour, task, completed: false },
      ]);
    }
  };

  const toggleBlock = (hour: number) => {
    const block = getBlockForHour(hour);
    if (block) {
      onChange(
        timeBlocks.map((b) =>
          b.hour === hour ? { ...b, completed: !b.completed } : b
        )
      );
    }
  };

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {relevantHours.map((hour) => {
          const block = getBlockForHour(hour);
          const isPast = hour < currentHour;
          const isCurrent = hour === currentHour;

          return (
            <motion.div
              key={hour}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl transition-all',
                isCurrent
                  ? 'bg-[hsl(var(--primary)/0.1)] ring-1 ring-[hsl(var(--primary)/0.2)]'
                  : 'bg-[hsl(var(--muted))]',
                isPast && 'opacity-50'
              )}
            >
              {/* Time label */}
              <div className="w-16 flex items-center gap-2 flex-shrink-0">
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse-soft" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    isCurrent
                      ? 'text-[hsl(var(--primary))]'
                      : 'text-[hsl(var(--muted-foreground))]'
                  )}
                >
                  {formatTime(hour)}
                </span>
              </div>

              {/* Checkbox */}
              {block?.task && (
                <button
                  onClick={() => toggleBlock(hour)}
                  className={cn(
                    'w-5 h-5 rounded flex items-center justify-center transition-all haptic flex-shrink-0',
                    block.completed
                      ? 'bg-[hsl(var(--sage))]'
                      : 'border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--sage))]'
                  )}
                >
                  {block.completed && <Check className="w-3 h-3 text-white" />}
                </button>
              )}

              {/* Task input */}
              <input
                type="text"
                value={block?.task || ''}
                onChange={(e) => updateBlock(hour, e.target.value)}
                placeholder={isCurrent ? 'What are you working on now?' : 'Add task...'}
                className={cn(
                  'flex-1 bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]',
                  block?.completed && 'line-through text-[hsl(var(--muted-foreground))]'
                )}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Expand/collapse button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors haptic"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show all hours ({hours.length})
          </>
        )}
      </button>
    </div>
  );
}
