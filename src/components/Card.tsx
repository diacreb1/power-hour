'use client';

import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'sage' | 'lavender';
  delay?: number;
  onClick?: () => void;
  noPadding?: boolean;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const variantStyles = {
  default: '',
  gold: 'card-gold',
  sage: 'card-sage',
  lavender: 'card-lavender',
};

export function Card({ 
  children, 
  className, 
  variant = 'default', 
  delay = 0, 
  onClick,
  noPadding = false 
}: CardProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ 
        duration: 0.45, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      onClick={onClick}
      className={cn(
        'card',
        !noPadding && 'p-6',
        variantStyles[variant],
        onClick && 'cursor-pointer active:scale-[0.98]',
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
  iconVariant?: 'primary' | 'gold' | 'sage' | 'lavender';
}

const iconVariantStyles = {
  primary: 'icon-badge-primary',
  gold: 'icon-badge-gold',
  sage: 'icon-badge-sage',
  lavender: 'icon-badge-lavender',
};

export function CardHeader({ 
  icon, 
  title, 
  subtitle, 
  action,
  iconVariant = 'primary' 
}: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-4">
        {icon && (
          <div className={cn('icon-badge', iconVariantStyles[iconVariant])}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-[17px] tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">{subtitle}</p>
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

// Decorative divider for cards
export function CardDivider() {
  return <div className="divider" />;
}
