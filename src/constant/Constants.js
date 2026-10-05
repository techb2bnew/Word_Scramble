// Plain values for the word game: timings, scoring, copy and the word list.
// Nothing in a screen should be a literal string or number — it lives here.

export const SCREENS = {
  SPLASH: 'splash',
  ONBOARDING: 'onboarding',
  GAME: 'game',
};

// Keys under which the app remembers things between launches.
export const STORAGE_KEYS = {
  ONBOARDING_SEEN: 'onboardingSeen',
  BEST_SCORE: 'bestScore',
};

// Vibration in milliseconds. A number is one buzz; an array alternates
// wait / buzz / wait / buzz. (iOS ignores the pattern and gives one short buzz.)
export const VIBRATE_TAP = 10;
export const VIBRATE_RIGHT = 40;
export const VIBRATE_WRONG = [0, 90, 60, 90];

export const SPLASH_DURATION = 2200;
export const SPLASH_FADE_DURATION = 800;
export const SPLASH_SPRING_FRICTION = 4;
export const SPLASH_START_SCALE = 0.3;

export const POINTS_PER_WORD = 10;

// Word-match game: the letters the player sees are shown; the words they have to
// spell stay hidden in WORDS.
// The grid of covered boxes: its size, the letters used to fill the boxes that
// are not part of the hidden word, and how long a box takes to flip open.
export const GRID_COLUMNS = 5;
export const GRID_ROWS = 9;
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const CARD_FLIP_DURATION = 350;

// The glint that crosses a covered box: how long a pass takes, and the range the
// wait before the next one is picked from (each box picks its own, so the grid
// sparkles unevenly rather than all at once).
export const SHIMMER_DURATION = 900;
export const SHIMMER_MIN_PAUSE = 1800;
export const SHIMMER_MAX_PAUSE = 5000;

// Horizontal shake of the answer row on a wrong word.
export const SHAKE_STEPS = [10, -10, 8, -8, 4, 0];
export const SHAKE_STEP_DURATION = 60;
export const CROSS_SPRING_FRICTION = 4;

// The hidden words: freight and dispatch terms. Capital letters A-Z only.
// Do not put a word that is the start of another one here (CAT and CATALOG): the
// shorter one would win as soon as it is spelled.
export const WORDS = [
  // Freight terms
  'POD', 'FMCSA', 'FTL', 'LTL', 'FCL', 'LCL', 'HOS', 'ETA', 'ETD', 'EIR',
  'SSL', 'TONU', 'RC', 'BOL', 'DOT', 'MC', 'HQ', 'HC', 'HAZMAT', 'RGN',
  'GVW', 'FSC',
  // Dispatch terms (the ones not already above)
  'ELD', 'CP', 'NOA', 'RPM', 'COI', 'CDL',
];

export const SPLASH_LOGO_LETTERS = ['W', 'O', 'R', 'D'];

export const ONBOARDING_SLIDES = [
  {
    id: '1',
    emoji: '🧩',
    title: 'Find the Hidden Word',
    text: 'A grid of covered boxes hides the letters of a secret word.',
  },
  {
    id: '2',
    emoji: '👆',
    title: 'Tap to Uncover',
    text: 'Tap a box to uncover its letter. Each letter drops into the row below.',
  },
  {
    id: '3',
    emoji: '🏆',
    title: 'Spell It Right',
    text: 'If your letters stop matching any word, you lose. Spell a whole word to score points!',
  },
];

// Onboarding demos. The word is only ever shown spelled out inside the demo; the
// wrong example is a start that no word has.
export const DEMO_WORD = 'HAZMAT';
export const DEMO_WRONG = 'HAX';
export const DEMO_STEP_DURATION = 800;

export const TEXTS = {
  appName: 'Word Scramble',
  splashSub: 'SCRAMBLE',
  skip: 'Skip',
  next: 'Next',
  startPlaying: 'Start Playing',
  score: 'SCORE',
  best: 'BEST',
  hint: 'Tap the letters to form the word',
  letters: 'letters',
  shuffle: 'Shuffle',
  shuffleIcon: '🔀',
  undo: 'Undo',
  undoIcon: '⌫',
  cross: '✕',
  tick: '✓',
  wrongTitle: 'Wrong Word!',
  wrongMessage: 'Try again. Your score will be reset.',
  startAgain: 'Start Again',
  winTitle: 'Well Done!',
  nextWord: 'Next Word',
  matchHint: 'Tap a box to uncover its letter',
};

// Letters roaming the play area, in points per second. Each letter gets a
// random speed in this range and a random direction.
export const BUBBLE_MIN_SPEED = 65;
export const BUBBLE_MAX_SPEED = 120;
// A frame longer than this (app was paused, JS was busy) is treated as this
// long, so letters never jump through each other or a wall.
export const BUBBLE_MAX_FRAME_SECONDS = 0.032;
export const BUBBLE_PLACE_TRIES = 60;
