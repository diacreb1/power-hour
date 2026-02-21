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
        <div className="flex items-start gap-4">
          <div className="icon-badge icon-badge-gold flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="scripture-text text-[15px] leading-relaxed text-[hsl(var(--foreground))] line-clamp-2">
              &ldquo;{verse.verse}&rdquo;
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 font-medium tracking-wide">
              — {verse.reference}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="gold" className="overflow-hidden relative">
      {/* Decorative corner flourishes */}
      <div className="flourish-corner flourish-corner-tr" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[hsl(var(--gold)/0.06)] to-transparent rounded-tr-full" />
      
      {/* Subtle decorative line */}
      <div className="absolute top-6 right-6 w-12 h-px bg-gradient-to-r from-[hsl(var(--gold)/0.3)] to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <Sparkles className="w-5 h-5 text-[hsl(var(--gold))]" />
          <span className="text-sm font-semibold tracking-wide text-[hsl(var(--gold))]">
            Daily Scripture
          </span>
        </div>

        {/* Scripture quote - Large, elegant serif */}
        <blockquote className="scripture-text text-[22px] leading-[1.5] text-[hsl(var(--foreground))]">
          &ldquo;{verse.verse}&rdquo;
        </blockquote>

        {/* Decorative divider */}
        <div className="divider-ornate my-5">
          <span className="ornament">✦</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-[hsl(var(--foreground)/0.8)] tracking-tight">
            {verse.reference}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl hover:bg-[hsl(var(--gold)/0.1)] transition-colors haptic group"
            aria-label="Save verse"
          >
            <Heart className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--gold))] transition-colors" />
          </motion.button>
        </div>
      </motion.div>
    </Card>
  );
}
