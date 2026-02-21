'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Monitor,
  Clock,
  Bell,
  Download,
  Upload,
  Trash2,
  Info,
  Heart,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { getSettings, updateSettings, db, type Settings } from '@/lib/db';
import { cn, formatTime } from '@/lib/utils';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (!settings) return;

    // Apply theme
    const root = document.documentElement;
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings?.theme]);

  const handleThemeChange = async (theme: Settings['theme']) => {
    if (!settings?.id) return;
    await updateSettings({ theme });
    setSettings((prev) => (prev ? { ...prev, theme } : prev));
  };

  const handleWorkdayChange = async (key: 'workdayStart' | 'workdayEnd', value: number) => {
    if (!settings?.id) return;
    await updateSettings({ [key]: value });
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const exportData = async () => {
    const data = {
      dayPlans: await db.dayPlans.toArray(),
      goals: await db.goals.toArray(),
      habits: await db.habits.toArray(),
      scriptures: await db.scriptures.toArray(),
      settings: await db.settings.toArray(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `power-hour-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Clear existing data
        await db.dayPlans.clear();
        await db.goals.clear();
        await db.habits.clear();
        await db.scriptures.clear();

        // Import new data
        if (data.dayPlans) await db.dayPlans.bulkAdd(data.dayPlans);
        if (data.goals) await db.goals.bulkAdd(data.goals);
        if (data.habits) await db.habits.bulkAdd(data.habits);
        if (data.scriptures) await db.scriptures.bulkAdd(data.scriptures);

        alert('Data imported successfully!');
        window.location.reload();
      } catch {
        alert('Failed to import data. Please check the file format.');
      }
    };
    input.click();
  };

  const clearAllData = async () => {
    await db.dayPlans.clear();
    await db.goals.clear();
    await db.habits.clear();
    await db.scriptures.clear();
    setShowClearConfirm(false);
    alert('All data cleared.');
    window.location.reload();
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center shimmer" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <Header title="Settings" subtitle="Customize your experience" />

      <main className="px-5 space-y-8">
        {/* Appearance */}
        <section>
          <h2 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">
            Appearance
          </h2>
          <Card>
            <p className="text-[15px] font-semibold mb-4">Theme</p>
            <div className="flex gap-3">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <motion.button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all duration-300 haptic',
                    settings.theme === value
                      ? 'bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.9)] text-white shadow-[0_4px_12px_hsl(var(--primary)/0.3)]'
                      : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.08)]'
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-semibold">{label}</span>
                </motion.button>
              ))}
            </div>
          </Card>
        </section>

        {/* Workday Hours */}
        <section>
          <h2 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">
            Day Planning
          </h2>
          <Card>
            <div className="flex items-center gap-4 mb-5">
              <div className="icon-badge icon-badge-primary">
                <Clock className="w-5 h-5" />
              </div>
              <span className="font-semibold text-[16px]">Workday Hours</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
                  Start
                </label>
                <select
                  value={settings.workdayStart}
                  onChange={(e) => handleWorkdayChange('workdayStart', parseInt(e.target.value))}
                  className="input"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 4).map((hour) => (
                    <option key={hour} value={hour}>
                      {formatTime(hour)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
                  End
                </label>
                <select
                  value={settings.workdayEnd}
                  onChange={(e) => handleWorkdayChange('workdayEnd', parseInt(e.target.value))}
                  className="input"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 14).map((hour) => (
                    <option key={hour} value={hour}>
                      {formatTime(hour)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">
            Data
          </h2>

          <div className="space-y-3">
            <Card
              className="flex items-center gap-4 cursor-pointer active:scale-[0.99]"
              onClick={exportData}
            >
              <div className="icon-badge icon-badge-sage">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[15px]">Export Data</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Download a backup of all your data
                </p>
              </div>
            </Card>

            <Card
              className="flex items-center gap-4 cursor-pointer active:scale-[0.99]"
              onClick={importData}
            >
              <div className="icon-badge icon-badge-primary">
                <Upload className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[15px]">Import Data</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Restore from a backup file
                </p>
              </div>
            </Card>

            <Card
              className="flex items-center gap-4 cursor-pointer active:scale-[0.99]"
              onClick={() => setShowClearConfirm(true)}
            >
              <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[15px] text-red-500">Clear All Data</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Delete all your plans, goals, and habits
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-4">
            About
          </h2>

          <Card variant="gold" className="relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[hsl(var(--gold)/0.15)] to-transparent rounded-bl-full" />
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--primary))] flex items-center justify-center shadow-[0_4px_12px_hsl(var(--gold)/0.3)] flex-shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl tracking-tight">Power Hour</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1.5 leading-relaxed">
                  Based on &ldquo;Power Hour - Plan with God&rdquo; by Diacre Bayishime
                </p>
                <div className="divider my-4" />
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  A faith-based daily planner to help you start each day with intention,
                  focus on what matters, and end with gratitude.
                </p>
              </div>
            </div>
          </Card>

          <div className="text-center mt-8 space-y-1.5">
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Version 1.0.0</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Made with <Heart className="w-3.5 h-3.5 inline text-red-400 fill-current" /> and prayer
            </p>
          </div>
        </section>

        {/* Clear Data Confirmation Modal */}
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[hsl(var(--background))] rounded-3xl p-7 max-w-sm w-full shadow-2xl"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Clear All Data?</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-7 leading-relaxed">
                This will permanently delete all your plans, goals, habits, and saved
                scriptures. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={clearAllData}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn flex-1 bg-red-500 hover:bg-red-600 shadow-[0_4px_12px_hsl(0_72%_51%/0.3)]"
                >
                  Delete All
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
