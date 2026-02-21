'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, GripVertical, Check } from 'lucide-react';
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
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {priorities.map((priority, index) => (
            <Reorder.Item
              key={priority.id}
              value={priority}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="group"
            >
              <div
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--muted))] transition-all duration-200',
                  priority.completed && 'opacity-60'
                )}
              >
                <GripVertical
                  className="w-4 h-4 text-[hsl(var(--muted-foreground))] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                />

                <span className="w-6 h-6 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center text-xs font-semibold text-[hsl(var(--primary))]">
                  {index + 1}
                </span>

                <button
                  onClick={() => togglePriority(priority.id)}
                  className={cn(
                    'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all haptic',
                    priority.completed
                      ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))]'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'
                  )}
                >
                  {priority.completed && <Check className="w-4 h-4 text-white" />}
                </button>

                <span
                  className={cn(
                    'flex-1 text-sm',
                    priority.completed && 'line-through text-[hsl(var(--muted-foreground))]'
                  )}
                >
                  {priority.text}
                </span>

                <button
                  onClick={() => removePriority(priority.id)}
                  className="opacity-0 group-hover:opacity-100 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-all text-sm haptic"
                >
                  Remove
                </button>
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {priorities.length < maxItems && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPriority()}
            placeholder={`Add priority ${priorities.length + 1} of ${maxItems}...`}
            className="input flex-1"
          />
          <button
            onClick={addPriority}
            disabled={!newPriority.trim()}
            className="btn w-12 h-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {priorities.length === 0 && (
        <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">
          What are your top {maxItems} priorities for today?
        </p>
      )}
    </div>
  );
}
