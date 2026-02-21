'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GratitudeListProps {
  items: string[];
  onChange: (items: string[]) => void;
  maxItems?: number;
}

export function GratitudeList({ items, onChange, maxItems = 3 }: GratitudeListProps) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim() || items.length >= maxItems) return;
    onChange([...items, newItem.trim()]);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={`${item}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="group flex items-start gap-3 p-3 rounded-xl bg-[hsl(var(--sage-light))]"
          >
            <Heart className="w-4 h-4 text-[hsl(var(--sage))] flex-shrink-0 mt-0.5 fill-current" />
            <span className="flex-1 text-sm leading-relaxed">{item}</span>
            <button
              onClick={() => removeItem(index)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[hsl(var(--sage)/0.2)] rounded transition-all haptic"
            >
              <X className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length < maxItems && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="I'm grateful for..."
            className="input flex-1"
          />
          <button
            onClick={addItem}
            disabled={!newItem.trim()}
            className="btn btn-secondary w-12 h-12 p-0 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-2">
          What are you thankful for today?
        </p>
      )}
    </div>
  );
}
