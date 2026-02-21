'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sun, CalendarDays, Target, BookOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Sun, label: 'Today' },
  { href: '/week', icon: CalendarDays, label: 'Week' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/inspire', icon: BookOpen, label: 'Inspire' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[hsl(var(--border))]">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 haptic',
                isActive
                  ? 'text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-2xl bg-[hsl(var(--primary)/0.1)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={cn(
                  'relative z-10 transition-transform duration-200',
                  isActive ? 'scale-110' : ''
                )}
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  'relative z-10 text-xs mt-1 font-medium',
                  isActive ? 'opacity-100' : 'opacity-0'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
