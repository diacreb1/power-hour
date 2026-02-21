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
        <div className="animate-pulse-soft">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <Header title="Settings" subtitle="Customize your experience" />

      <main className="px-5 space-y-6">
        {/* Appearance */}
        <section>
          <h2 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
            Appearance
          </h2>
          <Card>
            <p className="text-sm font-medium mb-3">Theme</p>
            <div className="flex gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all haptic',
                    settings.theme === value
                      ? 'bg-[hsl(var(--primary))] text-white'
                      : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.1)]'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* Workday Hours */}
        <section>
          <h2 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
            Day Planning
          </h2>
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
              <span className="font-medium">Workday Hours</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block">
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
                <label className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block">
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
          <h2 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
            Data
          </h2>

          <div className="space-y-3">
            <Card
              className="flex items-center gap-4 cursor-pointer"
              onClick={exportData}
            >
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--sage-light))] flex items-center justify-center">
                <Download className="w-5 h-5 text-[hsl(var(--sage))]" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Download a backup of all your data
                </p>
              </div>
            </Card>

            <Card
              className="flex items-center gap-4 cursor-pointer"
              onClick={importData}
            >
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
                <Upload className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Import Data</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Restore from a backup file
                </p>
              </div>
            </Card>

            <Card
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => setShowClearConfirm(true)}
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-500">Clear All Data</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Delete all your plans, goals, and habits
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
            About
          </h2>

          <Card variant="gold">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--primary))] flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Power Hour</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Based on &ldquo;Power Hour - Plan with God&rdquo; by Diacre Bayishime
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-3">
                  A faith-based daily planner to help you start each day with intention,
                  focus on what matters, and end with gratitude.
                </p>
              </div>
            </div>
          </Card>

          <div className="text-center mt-6 text-sm text-[hsl(var(--muted-foreground))]">
            <p>Version 1.0.0</p>
            <p className="mt-1">Made with ❤️ and prayer</p>
          </div>
        </section>

        {/* Clear Data Confirmation */}
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[hsl(var(--background))] rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-2">Clear All Data?</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
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
                <button
                  onClick={clearAllData}
                  className="btn flex-1 bg-red-500 hover:bg-red-600"
                >
                  Delete All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
