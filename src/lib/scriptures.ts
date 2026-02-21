// Daily scripture verses for inspiration
export interface DailyVerse {
  verse: string;
  reference: string;
  theme: string;
}

export const dailyVerses: DailyVerse[] = [
  {
    verse: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11",
    theme: "hope"
  },
  {
    verse: "Commit your work to the LORD, and your plans will be established.",
    reference: "Proverbs 16:3",
    theme: "planning"
  },
  {
    verse: "The heart of man plans his way, but the LORD establishes his steps.",
    reference: "Proverbs 16:9",
    theme: "guidance"
  },
  {
    verse: "Trust in the LORD with all your heart, and do not lean on your own understanding.",
    reference: "Proverbs 3:5",
    theme: "trust"
  },
  {
    verse: "This is the day that the LORD has made; let us rejoice and be glad in it.",
    reference: "Psalm 118:24",
    theme: "gratitude"
  },
  {
    verse: "I can do all things through him who strengthens me.",
    reference: "Philippians 4:13",
    theme: "strength"
  },
  {
    verse: "Be still and know that I am God.",
    reference: "Psalm 46:10",
    theme: "peace"
  },
  {
    verse: "The LORD is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
    theme: "provision"
  },
  {
    verse: "But seek first the kingdom of God and his righteousness, and all these things will be added to you.",
    reference: "Matthew 6:33",
    theme: "priorities"
  },
  {
    verse: "Whatever you do, work heartily, as for the Lord and not for men.",
    reference: "Colossians 3:23",
    theme: "work"
  },
  {
    verse: "Come to me, all who labor and are heavy laden, and I will give you rest.",
    reference: "Matthew 11:28",
    theme: "rest"
  },
  {
    verse: "The LORD is my light and my salvation; whom shall I fear?",
    reference: "Psalm 27:1",
    theme: "courage"
  },
  {
    verse: "And we know that for those who love God all things work together for good.",
    reference: "Romans 8:28",
    theme: "faith"
  },
  {
    verse: "Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go.",
    reference: "Joshua 1:9",
    theme: "courage"
  },
  {
    verse: "Delight yourself in the LORD, and he will give you the desires of your heart.",
    reference: "Psalm 37:4",
    theme: "desire"
  },
  {
    verse: "But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles.",
    reference: "Isaiah 40:31",
    theme: "patience"
  },
  {
    verse: "Give thanks in all circumstances; for this is the will of God in Christ Jesus for you.",
    reference: "1 Thessalonians 5:18",
    theme: "gratitude"
  },
  {
    verse: "The fear of the LORD is the beginning of wisdom, and the knowledge of the Holy One is insight.",
    reference: "Proverbs 9:10",
    theme: "wisdom"
  },
  {
    verse: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.",
    reference: "Philippians 4:6",
    theme: "peace"
  },
  {
    verse: "So teach us to number our days that we may get a heart of wisdom.",
    reference: "Psalm 90:12",
    theme: "time"
  },
  {
    verse: "Create in me a clean heart, O God, and renew a right spirit within me.",
    reference: "Psalm 51:10",
    theme: "renewal"
  },
  {
    verse: "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning.",
    reference: "Lamentations 3:22-23",
    theme: "mercy"
  },
  {
    verse: "Let all that you do be done in love.",
    reference: "1 Corinthians 16:14",
    theme: "love"
  },
  {
    verse: "In all your ways acknowledge him, and he will make straight your paths.",
    reference: "Proverbs 3:6",
    theme: "guidance"
  },
  {
    verse: "Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself.",
    reference: "Matthew 6:34",
    theme: "present"
  },
  {
    verse: "He has made everything beautiful in its time.",
    reference: "Ecclesiastes 3:11",
    theme: "timing"
  },
  {
    verse: "The LORD bless you and keep you; the LORD make his face to shine upon you.",
    reference: "Numbers 6:24-25",
    theme: "blessing"
  },
  {
    verse: "And let the peace of Christ rule in your hearts.",
    reference: "Colossians 3:15",
    theme: "peace"
  },
  {
    verse: "May the God of hope fill you with all joy and peace in believing.",
    reference: "Romans 15:13",
    theme: "joy"
  },
  {
    verse: "Great is thy faithfulness!",
    reference: "Lamentations 3:23",
    theme: "faithfulness"
  },
  {
    verse: "Be strong in the Lord and in the strength of his might.",
    reference: "Ephesians 6:10",
    theme: "strength"
  }
];

export function getDailyVerse(date?: Date): DailyVerse {
  const d = date || new Date();
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return dailyVerses[dayOfYear % dailyVerses.length];
}

export function getVerseByTheme(theme: string): DailyVerse | undefined {
  return dailyVerses.find(v => v.theme === theme);
}
