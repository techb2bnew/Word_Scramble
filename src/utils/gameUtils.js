import { WORDS, GRID_COLUMNS, GRID_ROWS, ALPHABET } from '../constant/Constants';

// Letters become { id, ch } so two identical letters (the H in SHUBHAM) can be
// told apart when one of them is tapped.
export const shuffleWord = (word) => {
  const tiles = word.split('').map((ch, id) => ({ id, ch }));
  const canDiffer = new Set(word).size > 1;
  let out;
  do {
    out = [...tiles];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    // Never hand the player the word already solved.
  } while (canDiffer && out.map((t) => t.ch).join('') === word);
  return out;
};

export const pickWord = (exclude) => {
  let word;
  do {
    word = WORDS[Math.floor(Math.random() * WORDS.length)];
  } while (word === exclude && WORDS.length > 1);
  return word;
};

export const randomBetween = (min, max) => min + Math.random() * (max - min);

const sameText = (a, b) => a.toLowerCase() === b.toLowerCase();

// Case does not matter, so a word typed in any case still matches.
export const leadsToAWord = (typed) =>
  WORDS.some((word) => word.toLowerCase().startsWith(typed.toLowerCase()));

export const isWholeWord = (typed) => WORDS.some((word) => sameText(word, typed));

const shuffleList = (list) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// How many rack slots the game needs. It is the longest hidden word, not the
// length of this round's word, so the slots do not give the word away.
export const longestWordLength = () => Math.max(...WORDS.map((word) => word.length));

// Sets up one round of the word-match game: a full grid of covered boxes. The
// letters of one hidden word are in it, so a round can always be finished, and
// every other box holds a random letter. All letters are capitals. The word
// itself is never shown.
export const dealRound = (previousTarget) => {
  const options = WORDS.filter((word) => word !== previousTarget);
  const pool = options.length ? options : WORDS;
  const target = pool[Math.floor(Math.random() * pool.length)];

  const fillers = Math.max(GRID_COLUMNS * GRID_ROWS - target.length, 0);
  const letters = [...target];
  for (let i = 0; i < fillers; i++) letters.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);

  const tiles = shuffleList(letters).map((ch, id) => ({ id, ch: ch.toUpperCase() }));
  return { target, tiles };
};
