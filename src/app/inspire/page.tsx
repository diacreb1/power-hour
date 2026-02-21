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
        <button
          onClick={() => setShowSaved(!showSaved)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors haptic',
            showSaved
              ? 'bg-[hsl(var(--primary))] text-white'
              : 'bg-[hsl(var(--muted))]'
          )}
        >
          <Heart className={cn('w-4 h-4', showSaved && 'fill-current')} />
          {savedVerses.length}
        </button>
      </Header>

      <main className="px-5 space-y-6">
        {/* Main Scripture Card */}
        {!showSaved && (
          <motion.div
            key={currentVerse.reference}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              variant="gold"
              className="relative overflow-hidden min-h-[280px] flex flex-col"
            >
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[hsl(var(--gold)/0.15)] to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[hsl(var(--gold)/0.1)] to-transparent rounded-tr-full" />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Theme badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[hsl(var(--gold))]" />
                  <span className="text-sm font-medium text-[hsl(var(--gold))] capitalize">
                    {currentVerse.theme}
                  </span>
                </div>

                {/* Verse */}
                <blockquote className="flex-1 text-xl leading-relaxed font-light italic text-[hsl(var(--foreground))]">
                  &ldquo;{currentVerse.verse}&rdquo;
                </blockquote>

                {/* Reference */}
                <p className="text-base font-semibold text-[hsl(var(--foreground))] mt-4">
                  — {currentVerse.reference}
                </p>
              </div>
            </Card>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={getRandomVerse}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.1)] transition-colors haptic"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm font-medium">New Verse</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={saveVerse}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl transition-colors haptic',
                  isSaved
                    ? 'bg-[hsl(var(--primary))] text-white'
                    : 'bg-[hsl(var(--muted))]'
                )}
              >
                <Heart className={cn('w-5 h-5', isSaved && 'fill-current')} />
                <span className="text-sm font-medium">
                  {isSaved ? 'Saved' : 'Save'}
                </span>
              </motion.button>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={shareVerse}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.1)] transition-colors haptic"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verses..."
            className="input pl-12"
          />
        </div>

        {/* Theme filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => setSearchQuery(theme)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors haptic',
                searchQuery === theme
                  ? 'bg-[hsl(var(--primary))] text-white'
                  : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground)/0.1)]'
              )}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Saved Verses or All Verses */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            {showSaved ? 'Saved Verses' : 'All Verses'}
          </h2>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {showSaved ? (
                savedVerses.length === 0 ? (
                  <Card className="text-center py-8">
                    <Heart className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
                    <p className="text-[hsl(var(--muted-foreground))]">
                      No saved verses yet
                    </p>
                  </Card>
                ) : (
                  savedVerses.map((scripture, index) => (
                    <motion.div
                      key={scripture.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="cursor-pointer"
                        onClick={() => {
                          setCurrentVerse({
                            verse: scripture.verse,
                            reference: scripture.reference,
                            theme: '',
                          });
                          setShowSaved(false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-relaxed line-clamp-2">
                              &ldquo;{scripture.verse}&rdquo;
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 font-medium">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card
                      className="cursor-pointer"
                      onClick={() => setCurrentVerse(verse)}
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-relaxed line-clamp-2">
                            &ldquo;{verse.verse}&rdquo;
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium">
                              — {verse.reference}
                            </p>
                            <span className="px-2 py-0.5 bg-[hsl(var(--muted))] rounded text-[10px] text-[hsl(var(--muted-foreground))] capitalize">
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
