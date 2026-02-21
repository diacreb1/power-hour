'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, X, Sparkles } from 'lucide-react';
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
            initial={{ opacity: 0, x: -16, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-[hsl(var(--sage-light))] to-[hsl(var(--sage-medium)/0.3)] border border-[hsl(var(--sage)/0.1)]"
          >
            {/* Heart icon with pulse effect on hover */}
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-xl bg-[hsl(var(--sage)/0.15)] flex items-center justify-center flex-shrink-0"
            >
              <Heart className="w-4 h-4 text-[hsl(var(--sage))] fill-current" />
            </motion.div>
            
            {/* Gratitude text */}
            <span className="flex-1 text-[15px] leading-relaxed pt-1">{item}</span>
            
            {/* Remove button */}
            <motion.button
              onClick={() => removeItem(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[hsl(var(--sage)/0.15)] rounded-lg transition-all haptic"
            >
              <X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add new gratitude input */}
      {items.length < maxItems && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="I'm grateful for..."
            className="input flex-1"
          />
          <motion.button
            onClick={addItem}
            disabled={!newItem.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-secondary btn-icon w-14 h-14 disabled:opacity-40"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[hsl(var(--sage)/0.1)] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[hsl(var(--sage))]" />
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            What are you thankful for today?
          </p>
        </motion.div>
      )}
    </div>
  );
}
