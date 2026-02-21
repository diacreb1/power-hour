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
        {relevantHours.map((hour, index) => {
          const block = getBlockForHour(hour);
          const isPast = hour < currentHour;
          const isCurrent = hour === currentHour;

          return (
            <motion.div
              key={hour}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.03,
                ease: [0.25, 0.1, 0.25, 1] 
              }}
              className={cn(
                'flex items-center gap-3 p-4 rounded-2xl transition-all duration-300',
                isCurrent
                  ? 'bg-gradient-to-r from-[hsl(var(--primary)/0.08)] to-[hsl(var(--primary)/0.04)] ring-1 ring-[hsl(var(--primary)/0.15)]'
                  : 'bg-[hsl(var(--muted)/0.5)] hover:bg-[hsl(var(--muted)/0.8)]',
                isPast && 'opacity-50'
              )}
            >
              {/* Time label */}
              <div className="w-16 flex items-center gap-2 flex-shrink-0">
                {isCurrent && (
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <span
                  className={cn(
                    'text-sm font-semibold tabular-nums',
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
                <motion.button
                  onClick={() => toggleBlock(hour)}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 haptic flex-shrink-0',
                    block.completed
                      ? 'bg-gradient-to-br from-[hsl(var(--sage))] to-[hsl(158_40%_42%)] shadow-[0_2px_6px_hsl(var(--sage)/0.3)]'
                      : 'border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--sage))] hover:bg-[hsl(var(--sage)/0.05)]'
                  )}
                >
                  <AnimatePresence mode="wait">
                    {block.completed && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}

              {/* Task input */}
              <input
                type="text"
                value={block?.task || ''}
                onChange={(e) => updateBlock(hour, e.target.value)}
                placeholder={isCurrent ? 'What are you working on now?' : 'Add task...'}
                className={cn(
                  'flex-1 bg-transparent text-[15px] outline-none placeholder:text-[hsl(var(--muted-foreground)/0.5)]',
                  block?.completed && 'line-through text-[hsl(var(--muted-foreground))]',
                  isCurrent && 'placeholder:text-[hsl(var(--primary)/0.5)]'
                )}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Expand/collapse button */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors haptic rounded-xl hover:bg-[hsl(var(--muted)/0.5)]"
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
      </motion.button>
    </div>
  );
}
