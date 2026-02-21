'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { getDailyVerse } from '@/lib/scriptures';
import { Card } from './Card';

interface ScriptureCardProps {
  compact?: boolean;
}

export function ScriptureCard({ compact = false }: ScriptureCardProps) {
  const verse = getDailyVerse();

  if (compact) {
    return (
      <Card variant="gold" className="overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--gold)/0.15)] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed text-[hsl(var(--foreground))] line-clamp-2">
              &ldquo;{verse.verse}&rdquo;
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 font-medium">
              — {verse.reference}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="gold" className="overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[hsl(var(--gold)/0.1)] to-transparent rounded-bl-full" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="relative"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[hsl(var(--gold))]" />
          <span className="text-sm font-medium text-[hsl(var(--gold))]">
            Daily Scripture
          </span>
        </div>

        <blockquote className="text-lg leading-relaxed text-[hsl(var(--foreground))] font-light italic">
          &ldquo;{verse.verse}&rdquo;
        </blockquote>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[hsl(var(--muted-foreground))] font-medium">
            — {verse.reference}
          </p>
          <button
            className="p-2 rounded-full hover:bg-[hsl(var(--gold)/0.1)] transition-colors haptic"
            aria-label="Save verse"
          >
            <Heart className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>
      </motion.div>
    </Card>
  );
}
