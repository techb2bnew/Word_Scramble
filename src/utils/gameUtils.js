import {
  WORDS,
  GRID_COLUMNS,
  GRID_ROWS,
  ALPHABET,
  EMBED_LETTER_BUDGET,
} from '../constant/Constants';

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

const startsWith = (word, typed) => word.toLowerCase().startsWith(typed.toLowerCase());

// Every check below is given the words still to be found, so a word already
// found no longer counts. Case does not matter.
export const leadsToAWord = (typed, words) => words.some((word) => startsWith(word, typed));

export const wholeWord = (typed, words) => words.find((word) => sameText(word, typed));

// How many letters the longest word starting with `spelled` has. After `E`, if
// every word starting with it is 3 letters long, the answer is 3. Zero when no
// word starts that way.
export const wordReach = (spelled, words) =>
  Math.max(0, ...words.filter((w) => startsWith(w, spelled)).map((w) => w.length));

// The letters that can come next after `spelled`: for ET that is A and D (ETA,
// ETD). Capitals, since the grid is in capitals.
export const nextLetters = (spelled, words) =>
  new Set(
    words
      .filter((w) => startsWith(w, spelled) && w.length > spelled.length)
      .map((w) => w[spelled.length].toUpperCase()),
  );

// How many rack slots a level needs: its longest word, whether or not that word
// has been found, so the slots do not change while the level is played.
export const longestWordLength = (words) => Math.max(...words.map((word) => word.length));

// Whether the boxes given still hold the letters of at least one of the words.
// Order does not matter: the player can tap the boxes in any order, so a word
// whose letters are all there can always be spelled.
export const canSpellAnyWord = (tiles, words) => {
  const have = {};
  tiles.forEach((tile) => {
    const ch = tile.ch.toUpperCase();
    have[ch] = (have[ch] || 0) + 1;
  });
  return words.some((word) => {
    const need = {};
    return [...word.toUpperCase()].every((ch) => {
      need[ch] = (need[ch] || 0) + 1;
      return need[ch] <= (have[ch] || 0);
    });
  });
};

const shuffleList = (list) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// Deals a grid of covered boxes. The letters of some of the words still to be
// found are in it (as many as EMBED_LETTER_BUDGET allows, picked at random), so
// those words can always be spelled; every other box holds a random letter. A
// word whose letters do not fit is left for a later grid. All capitals.
export const dealGrid = (words) => {
  const chosen = [];
  let letters = 0;
  shuffleList(words).forEach((word) => {
    if (chosen.length && letters + word.length > EMBED_LETTER_BUDGET) return;
    chosen.push(word);
    letters += word.length;
  });

  const chars = chosen.flatMap((word) => [...word.toUpperCase()]);
  const fillers = Math.max(GRID_COLUMNS * GRID_ROWS - chars.length, 0);
  for (let i = 0; i < fillers; i++) chars.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);

  return { tiles: shuffleList(chars).map((ch, id) => ({ id, ch })) };
};
