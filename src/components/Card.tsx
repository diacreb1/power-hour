'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'sage' | 'lavender';
  delay?: number;
  onClick?: () => void;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const variantStyles = {
  default: '',
  gold: 'bg-[hsl(var(--gold-light))] border-[hsl(var(--gold)/0.2)]',
  sage: 'bg-[hsl(var(--sage-light))] border-[hsl(var(--sage)/0.2)]',
  lavender: 'bg-[hsl(var(--lavender-light))] border-[hsl(var(--lavender)/0.2)]',
};

export function Card({ children, className, variant = 'default', delay = 0, onClick }: CardProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'card p-5',
        variantStyles[variant],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ icon, title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center text-[hsl(var(--primary))]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          {subtitle && (
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardSection({ children, className }: CardSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}
