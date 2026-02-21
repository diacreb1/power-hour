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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-40 glass pt-safe"
    >
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            {showGreeting ? (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm font-medium text-[hsl(var(--muted-foreground))]"
                >
                  {getGreeting()}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-semibold tracking-tight mt-0.5"
                >
                  {formatDate(today)}
                </motion.h1>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
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
