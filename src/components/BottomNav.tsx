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
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade at top */}
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-[hsl(var(--background)/0.8)] to-transparent pointer-events-none" />
      
      {/* Main nav bar with premium glass effect */}
      <div className="glass-strong border-t border-[hsl(var(--border)/0.5)] shadow-[0_-4px_20px_hsl(var(--shadow-color)/0.05)]">
        <div className="flex items-center justify-around h-[72px] max-w-lg mx-auto px-3 pb-safe">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 haptic',
                  isActive
                    ? 'text-[hsl(var(--primary))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[hsl(var(--primary)/0.12)] to-[hsl(var(--primary)/0.06)]"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -top-0.5 w-1 h-1 rounded-full bg-[hsl(var(--primary))]"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                  />
                )}
                
                <Icon
                  className={cn(
                    'relative z-10 transition-all duration-300',
                    isActive ? 'scale-110' : 'scale-100'
                  )}
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span
                  className={cn(
                    'relative z-10 text-[10px] mt-1 font-medium tracking-wide transition-all duration-300',
                    isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
