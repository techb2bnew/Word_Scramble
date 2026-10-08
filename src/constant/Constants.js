// Plain values for the word game: timings, scoring, copy and the word list.
// Nothing in a screen should be a literal string or number — it lives here.

export const SCREENS = {
  SPLASH: 'splash',
  ONBOARDING: 'onboarding',
  ROLE: 'role',
  GAME: 'game',
};

// Keys under which the app remembers things between launches.
export const STORAGE_KEYS = {
  ONBOARDING_SEEN: 'onboardingSeen',
  BEST_SCORE: 'bestScore',
  // + the role id: how many levels of that role are cleared (0 to 6).
  PROGRESS_PREFIX: 'progress_',
};

// Vibration in milliseconds. A number is one buzz; an array alternates
// wait / buzz / wait / buzz. (iOS ignores the pattern and gives one short buzz.)
export const VIBRATE_TAP = 10;
export const VIBRATE_RIGHT = 40;
export const VIBRATE_WRONG = [0, 90, 60, 90];

// The celebration after the last level. Several animations take turns, a
// different one each time: how many pieces fall in the confetti and the letter
// rain, and how many sparks one firework throws.
export const DONE_CONFETTI_COUNT = 32;
export const DONE_RAIN_COUNT = 14;
export const DONE_BURST_DOTS = 12;
export const DONE_SPARKLE_COUNT = 10;

// How the cards on the role screen come in: how long each takes, and the wait
// between one and the next.
export const ROLE_ENTER_DURATION = 450;
export const ROLE_ENTER_STAGGER = 140;
export const ROLE_CLOUD_DURATION = 28000;
export const DEAL_STAGGER = 14;
export const DEAL_SPRING_FRICTION = 6;

// The privacy policy page. Both stores ask for this link, and the app shows it too.
export const PRIVACY_POLICY_URL = 'https://samsara.b2bcampus.com/privacy/word-haul';

export const SPLASH_DURATION = 2200;
export const SPLASH_FADE_DURATION = 800;
export const SPLASH_SPRING_FRICTION = 4;
export const SPLASH_START_SCALE = 0.3;

export const POINTS_PER_WORD = 10;

// How many times the Help button can be used in one level.
export const HELP_LIMIT = 3;

// Word-match game: the letters the player sees are shown; the words they have to
// spell stay hidden in WORDS.
// The grid of covered boxes: its size, the letters used to fill the boxes that
// are not part of the hidden word, and how long a box takes to flip open.
export const GRID_COLUMNS = 5;
export const GRID_ROWS = 9;
// Letters and the two digits that appear in words (3PL, W9), so a digit in the
// grid does not give a word away.
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ39';

// A grid hides the letters of some of the level's words, up to this many
// letters in all; the rest of the boxes are filled with random ones. A level has
// more words than fit, so it plays over several grids.
export const EMBED_LETTER_BUDGET = 24;
export const CARD_FLIP_DURATION = 350;

// A box already used in the word being spelled, and a listed word that no longer
// matches what has been spelled, are both shown faded by this much.
export const USED_CARD_OPACITY = 0.4;
export const DIMMED_CHIP_OPACITY = 0.3;

// A rack slot no word can reach any more, given the letters spelled so far.
export const SLOT_FADED_OPACITY = 0.25;

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
    emoji: '🚛',
    title: 'Pick Your Role',
    text: 'Play as a Truck Dispatcher or a Freight Broker. Each role has its own 6 levels and its own progress.',
  },
  {
    id: '2',
    emoji: '🧩',
    title: 'Find the Hidden Terms',
    text: 'A grid of covered boxes hides the freight and dispatch terms of your level. Find every one to clear it.',
  },
  {
    id: '3',
    emoji: '👆',
    title: 'Tap to Uncover',
    text: 'Tap a box to uncover its letter. It drops into the row below, and the glowing slots show how long a word can still get.',
  },
  {
    id: '4',
    emoji: '🏆',
    title: 'Spell It Right',
    text: 'A word you spell turns green and stays open. If the letters match no word, that box closes again and you carry on from there.',
  },
  {
    id: '5',
    emoji: '💡',
    title: 'Need a Hand?',
    text: 'Tap Help to ring the boxes whose letter can come next. You get 3 helps in every level. Clear all 6 levels to finish your role!',
  },
];

// Onboarding demos. DEMO_WORD must be one of DEMO_WORDS, and DEMO_WRONG a start
// that none of them has.
// Words the demo's glow and fade are worked out from, and how many slots it shows.
export const DEMO_WORDS = ['ETA', 'ETD', 'ELD', 'EIR', 'POD', 'FTL'];
export const DEMO_RACK_LENGTH = 6;
export const DEMO_WORD = 'ETD';
export const DEMO_WRONG = 'ES';
export const DEMO_STEP_DURATION = 800;
// How long the Help demo keeps its rings on, and off.
export const DEMO_HELP_DURATION = 1500;

export const TEXTS = {
  appName: 'Word Haul',
  splashSub: 'HAUL',
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
  help: 'Help',
  helpIcon: '💡',
  helpOverTitle: 'No Help Left',
  helpOverMessage: 'Your help chances are over.',
  helpNoneTitle: 'No Hint',
  helpNoneMessage: 'No box left can continue this word.',
  ok: 'OK',
  chooseRole: 'Choose Your Role',
  chooseRoleSub: 'Each role has its own 6 levels.',
  roleStart: 'Start',
  roleContinue: 'Continue',
  rolePlayAgain: 'Play again',
  roleFooter: 'You can switch role any time with the back arrow.',
  privacyPolicy: 'Privacy Policy',
  levelOf: 'of',
  levelWord: 'Level',
  allDone: 'All levels completed',
  words: 'words',
  back: '‹',
  trophy: '🏆',
  levelCompleteTitle: 'Complete!',
  levelCompleteMessage: 'You found every term in this level.',
  nextLevel: 'Next Level',
  doneTitle: 'You Have Completed All Levels!',
  doneScore: 'Final score',
  backToRoles: 'Back to Roles',
  winTitle: 'Well Done!',
  nextWord: 'Next Word',
};

// Letters roaming the play area, in points per second. Each letter gets a
// random speed in this range and a random direction.
export const BUBBLE_MIN_SPEED = 65;
export const BUBBLE_MAX_SPEED = 120;
// A frame longer than this (app was paused, JS was busy) is treated as this
// long, so letters never jump through each other or a wall.
export const BUBBLE_MAX_FRAME_SECONDS = 0.032;
export const BUBBLE_PLACE_TRIES = 60;
