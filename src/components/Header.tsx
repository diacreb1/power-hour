'use client';

import { motion } from 'framer-motion';
import { formatDate, getGreeting } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, showGreeting = false, children }: HeaderProps) {
  const today = new Date();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-0 z-40 glass-strong pt-safe"
    >
      {/* Subtle bottom border with gradient */}
      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border)/0.5)] to-transparent" />
      
      <div className="px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            {showGreeting ? (
              <>
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-sm font-medium text-[hsl(var(--muted-foreground))] tracking-wide"
                >
                  {getGreeting()}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="heading-display text-[26px] font-medium tracking-tight mt-1 text-gradient-gold"
                >
                  {formatDate(today)}
                </motion.h1>
              </>
            ) : (
              <>
                <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5 tracking-wide">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>
          {children}
        </div>
      </div>
    </motion.header>
  );
}
