'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, RefreshCw, Share2, Sparkles, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { dailyVerses, getDailyVerse, type DailyVerse } from '@/lib/scriptures';
import { db, type Scripture } from '@/lib/db';
import { cn } from '@/lib/utils';

export default function InspirePage() {
  const [currentVerse, setCurrentVerse] = useState<DailyVerse>(getDailyVerse());
  const [savedVerses, setSavedVerses] = useState<Scripture[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    db.scriptures.orderBy('savedAt').reverse().toArray().then(setSavedVerses);
  }, []);

  useEffect(() => {
    const saved = savedVerses.some(
      (s) => s.verse === currentVerse.verse && s.reference === currentVerse.reference
    );
    setIsSaved(saved);
  }, [currentVerse, savedVerses]);

  const getRandomVerse = () => {
    let newVerse: DailyVerse;
    do {
      newVerse = dailyVerses[Math.floor(Math.random() * dailyVerses.length)];
    } while (newVerse.verse === currentVerse.verse);
    setCurrentVerse(newVerse);
  };

  const saveVerse = async () => {
    if (isSaved) {
      // Remove from saved
      const existing = savedVerses.find(
        (s) => s.verse === currentVerse.verse && s.reference === currentVerse.reference
      );
      if (existing?.id) {
        await db.scriptures.delete(existing.id);
        setSavedVerses(savedVerses.filter((s) => s.id !== existing.id));
      }
    } else {
      // Add to saved
      const scripture: Omit<Scripture, 'id'> = {
        verse: currentVerse.verse,
        reference: currentVerse.reference,
        savedAt: new Date(),
      };
      const id = await db.scriptures.add(scripture as Scripture);
      setSavedVerses([{ ...scripture, id } as Scripture, ...savedVerses]);
    }
  };

  const shareVerse = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Scripture',
          text: `"${currentVerse.verse}" — ${currentVerse.reference}`,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  const filteredVerses = searchQuery
    ? dailyVerses.filter(
        (v) =>
          v.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.theme.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dailyVerses;

  const themes = [...new Set(dailyVerses.map((v) => v.theme))];

  return (
    <div className="min-h-screen pb-28">
      <Header title="Inspire" subtitle="Daily scripture & wisdom">
        <motion.button
          onClick={() => setShowSaved(!showSaved)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 haptic',
            showSaved
              ? 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.9)] text-white shadow-[0_2px_8px_hsl(var(--primary)/0.3)]'
              : 'bg-[hsl(var(--muted))]'
          )}
        >
          <Heart className={cn('w-4 h-4', showSaved && 'fill-current')} />
          {savedVerses.length}
        </motion.button>
      </Header>

      <main className="px-5 space-y-6">
        {/* Main Scripture Card */}
        {!showSaved && (
          <motion.div
            key={currentVerse.reference}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Card
              variant="gold"
              className="relative overflow-hidden min-h-[300px] flex flex-col"
            >
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[hsl(var(--gold)/0.12)] to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[hsl(var(--gold)/0.08)] to-transparent rounded-tr-full" />
              <div className="absolute top-8 right-8 w-16 h-px bg-gradient-to-r from-[hsl(var(--gold)/0.4)] to-transparent" />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Theme badge */}
                <div className="flex items-center gap-2.5 mb-5">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--gold))]" />
                  <span className="text-sm font-semibold text-[hsl(var(--gold))] capitalize tracking-wide">
                    {currentVerse.theme}
                  </span>
                </div>

                {/* Verse - Large elegant serif typography */}
                <blockquote className="flex-1 scripture-text text-[24px] leading-[1.45] text-[hsl(var(--foreground))]">
                  &ldquo;{currentVerse.verse}&rdquo;
                </blockquote>

                {/* Decorative divider */}
                <div className="divider-ornate my-5">
                  <span className="ornament">✦</span>
                </div>

                {/* Reference */}
                <p className="text-lg font-semibold text-[hsl(var(--foreground)/0.85)] tracking-tight">
                  {currentVerse.reference}
                </p>
              </div>
            </Card>

            {/* Action buttons - Premium styling */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={getRandomVerse}
                className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.08)] transition-all duration-300 haptic shadow-sm"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm font-semibold">New Verse</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveVerse}
                className={cn(
                  'flex items-center gap-2.5 px-5 py-3.5 rounded-2xl transition-all duration-300 haptic',
                  isSaved
                    ? 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.9)] text-white shadow-[0_4px_12px_hsl(var(--primary)/0.3)]'
                    : 'bg-[hsl(var(--muted))] shadow-sm'
                )}
              >
                <Heart className={cn('w-5 h-5', isSaved && 'fill-current')} />
                <span className="text-sm font-semibold">
                  {isSaved ? 'Saved' : 'Save'}
                </span>
              </motion.button>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareVerse}
                  className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.08)] transition-all duration-300 haptic shadow-sm"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">Share</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verses..."
            className="input pl-14"
          />
        </div>

        {/* Theme filters */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {themes.map((theme) => (
            <motion.button
              key={theme}
              onClick={() => setSearchQuery(theme)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 haptic',
                searchQuery === theme
                  ? 'bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.9)] text-white shadow-[0_2px_8px_hsl(var(--primary)/0.25)]'
                  : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.08)]'
              )}
            >
              {theme}
            </motion.button>
          ))}
        </div>

        {/* Saved Verses or All Verses */}
        <section>
          <h2 className="text-lg font-semibold mb-4 tracking-tight">
            {showSaved ? 'Saved Verses' : 'All Verses'}
          </h2>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {showSaved ? (
                savedVerses.length === 0 ? (
                  <Card className="text-center py-10">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center">
                      <Heart className="w-7 h-7 text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <p className="text-[hsl(var(--muted-foreground))]">
                      No saved verses yet
                    </p>
                  </Card>
                ) : (
                  savedVerses.map((scripture, index) => (
                    <motion.div
                      key={scripture.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ delay: index * 0.04, duration: 0.35 }}
                    >
                      <Card
                        className="cursor-pointer active:scale-[0.98]"
                        onClick={() => {
                          setCurrentVerse({
                            verse: scripture.verse,
                            reference: scripture.reference,
                            theme: '',
                          });
                          setShowSaved(false);
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="icon-badge icon-badge-gold flex-shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="scripture-text text-[15px] leading-relaxed line-clamp-2">
                              &ldquo;{scripture.verse}&rdquo;
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 font-semibold tracking-wide">
                              — {scripture.reference}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )
              ) : (
                filteredVerses.map((verse, index) => (
                  <motion.div
                    key={`${verse.reference}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.025, duration: 0.35 }}
                  >
                    <Card
                      className="cursor-pointer active:scale-[0.98]"
                      onClick={() => setCurrentVerse(verse)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="icon-badge icon-badge-gold flex-shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="scripture-text text-[15px] leading-relaxed line-clamp-2">
                            &ldquo;{verse.verse}&rdquo;
                          </p>
                          <div className="flex items-center gap-2.5 mt-2">
                            <p className="text-xs text-[hsl(var(--muted-foreground))] font-semibold">
                              — {verse.reference}
                            </p>
                            <span className="px-2.5 py-1 bg-[hsl(var(--muted))] rounded-lg text-[10px] font-semibold text-[hsl(var(--muted-foreground))] capitalize tracking-wide">
                              {verse.theme}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
