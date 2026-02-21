'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, GripVertical, Check, Sparkles } from 'lucide-react';
import { type Priority } from '@/lib/db';
import { generateId, cn } from '@/lib/utils';

interface PriorityListProps {
  priorities: Priority[];
  onChange: (priorities: Priority[]) => void;
  maxItems?: number;
}

export function PriorityList({ priorities, onChange, maxItems = 3 }: PriorityListProps) {
  const [newPriority, setNewPriority] = useState('');

  const addPriority = () => {
    if (!newPriority.trim() || priorities.length >= maxItems) return;

    const priority: Priority = {
      id: generateId(),
      text: newPriority.trim(),
      completed: false,
      order: priorities.length,
    };

    onChange([...priorities, priority]);
    setNewPriority('');
  };

  const togglePriority = (id: string) => {
    onChange(
      priorities.map((p) =>
        p.id === id ? { ...p, completed: !p.completed } : p
      )
    );
  };

  const removePriority = (id: string) => {
    onChange(priorities.filter((p) => p.id !== id));
  };

  const handleReorder = (reordered: Priority[]) => {
    onChange(reordered.map((p, i) => ({ ...p, order: i })));
  };

  return (
    <div className="space-y-3">
      <Reorder.Group
        axis="y"
        values={priorities}
        onReorder={handleReorder}
        className="space-y-2.5"
      >
        <AnimatePresence mode="popLayout">
          {priorities.map((priority, index) => (
            <Reorder.Item
              key={priority.id}
              value={priority}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="group"
            >
              <div
                className={cn(
                  'flex items-center gap-3 p-4 rounded-2xl bg-[hsl(var(--muted)/0.6)] border border-transparent transition-all duration-300',
                  priority.completed && 'opacity-60 bg-[hsl(var(--sage-light))] border-[hsl(var(--sage)/0.15)]',
                  !priority.completed && 'hover:bg-[hsl(var(--muted))]'
                )}
              >
                {/* Drag handle */}
                <GripVertical
                  className="w-4 h-4 text-[hsl(var(--muted-foreground)/0.4)] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                />

                {/* Priority number badge */}
                <span className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300',
                  priority.completed 
                    ? 'bg-[hsl(var(--sage)/0.2)] text-[hsl(var(--sage))]'
                    : 'bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]'
                )}>
                  {index + 1}
                </span>

                {/* Checkbox with satisfying animation */}
                <motion.button
                  onClick={() => togglePriority(priority.id)}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 haptic flex-shrink-0',
                    priority.completed
                      ? 'bg-gradient-to-br from-[hsl(var(--sage))] to-[hsl(158_40%_42%)] border-[hsl(var(--sage))] shadow-[0_2px_8px_hsl(var(--sage)/0.3)]'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--sage))] hover:bg-[hsl(var(--sage)/0.05)]'
                  )}
                >
                  <AnimatePresence mode="wait">
                    {priority.completed && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Priority text */}
                <span
                  className={cn(
                    'flex-1 text-[15px] transition-all duration-300',
                    priority.completed && 'line-through text-[hsl(var(--muted-foreground))]'
                  )}
                >
                  {priority.text}
                </span>

                {/* Remove button */}
                <motion.button
                  onClick={() => removePriority(priority.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="opacity-0 group-hover:opacity-100 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-all text-xs font-medium px-2 py-1 rounded-lg hover:bg-[hsl(var(--destructive)/0.1)] haptic"
                >
                  Remove
                </motion.button>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {/* Add new priority input */}
      {priorities.length < maxItems && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPriority()}
            placeholder={`Add priority ${priorities.length + 1} of ${maxItems}...`}
            className="input flex-1"
          />
          <motion.button
            onClick={addPriority}
            disabled={!newPriority.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-icon w-14 h-14 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}

      {/* Empty state */}
      {priorities.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            What are your top {maxItems} priorities for today?
          </p>
        </motion.div>
      )}
    </div>
  );
}
