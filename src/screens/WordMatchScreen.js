import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameAccentColor,
  gameWinColor,
  gameLoseColor,
  roleCardBg,
  roleCardText,
  roleTitleOnSky,
  skyGlass,
  skyGlassBorder,
} from '../constant/Color';
import {
  POINTS_PER_WORD,
  HELP_LIMIT,
  STORAGE_KEYS,
  SHAKE_STEPS,
  SHAKE_STEP_DURATION,
  CROSS_SPRING_FRICTION,
  GRID_COLUMNS,
  GRID_ROWS,
  TEXTS,
} from '../constant/Constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import {
  dealGrid,
  leadsToAWord,
  wholeWord,
  longestWordLength,
  canSpellAnyWord,
  wordReach,
  nextLetters,
} from '../utils/gameUtils';
import { getNumber, setNumber } from '../utils/storage';
import { playTap, playRight, playWrong } from '../utils/feedback';
import HiddenCard, { CARD_MARGIN } from '../components/HiddenCard';
import AnswerPanel from '../components/AnswerPanel';
import HelpButton from '../components/HelpButton';
import ResultModal from '../components/Modals/ResultModal';
import CompletionModal from '../components/Modals/CompletionModal';
import SkyBackdrop from '../components/SkyBackdrop';

// A level is a list of words to find. The grid of covered boxes holds the letters
// of some of them; the player taps boxes one by one and each box turns over, its
// letter landing in the rack. After every letter, what has been spelled so far
// must still be the start of a word not found yet, or the letter is wrong.
// Spelling a whole word finds it. Words are found over as many grids as it takes.
//
// Props: the role and which of its levels this is, the score to carry in, and
// what to do when a level is cleared, when the next one is asked for, and on exit.

// Room kept free inside the play area, so the grid never touches its border.
const GRID_PADDING = wp(3);

const WordMatchScreen = ({ role, levelIndex, startScore, onLevelComplete, onNextLevel, onExit }) => {
  const level = role.levels[levelIndex];
  const words = level.words;
  const isLastLevel = levelIndex === role.levels.length - 1;

  const [foundWords, setFoundWords] = useState([]); // words of this level found so far
  const unfound = words.filter((w) => !foundWords.includes(w));
  const levelCleared = unfound.length === 0;

  const [round, setRound] = useState(() => dealGrid(words));
  const [roundKey, setRoundKey] = useState(0);
  const [picked, setPicked] = useState([]); // tiles in the word being spelled, in tap order
  const [revealed, setRevealed] = useState([]); // ids of boxes that have been uncovered
  const [found, setFound] = useState([]); // ids of boxes in words already spelled
  const [helpLeft, setHelpLeft] = useState(HELP_LIMIT);
  const [hintIds, setHintIds] = useState([]); // boxes the last Help ringed
  const [notice, setNotice] = useState(null); // 'over' | 'none' | null
  const [result, setResult] = useState(null); // 'win' | 'lose' | null
  const [score, setScore] = useState(startScore);
  const [best, setBest] = useState(0);
  const [arena, setArena] = useState({ w: 0, h: 0 });
  const shake = useRef(new Animated.Value(0)).current;
  const crossScale = useRef(new Animated.Value(0)).current;

  // How far the words that are still possible can go. After `E`, every word that
  // starts with it is 3 letters long, so only the next 2 slots stay lit.
  const spelled = picked.map((t) => t.ch).join('');
  const reach = spelled && !result ? wordReach(spelled, unfound) : null;

  // Boxes are sized to fill the play area, both ways, so a grid of any size fits
  // any phone. They are wider than tall once there are more rows than columns.
  const cardWidth = Math.floor((arena.w - GRID_PADDING) / GRID_COLUMNS) - 2 * CARD_MARGIN;
  const cardHeight = Math.floor((arena.h - GRID_PADDING) / GRID_ROWS) - 2 * CARD_MARGIN;

  // Load the saved best score once. max() keeps a score earned before the read
  // finished from being overwritten by an older saved value.
  useEffect(() => {
    getNumber(STORAGE_KEYS.BEST_SCORE).then((saved) => setBest((b) => Math.max(b, saved)));
  }, []);

  // A fresh grid for the words still to be found. Help is not given back: its 3
  // uses are for the whole level.
  const newGrid = () => {
    setRound(dealGrid(unfound));
    setPicked([]);
    setRevealed([]);
    setFound([]);
    setHintIds([]);
    setResult(null);
    setRoundKey((k) => k + 1);
  };

  const onWrong = () => {
    playWrong();
    setResult('lose');
    crossScale.setValue(0);
    Animated.spring(crossScale, {
      toValue: 1,
      friction: CROSS_SPRING_FRICTION,
      useNativeDriver: true,
    }).start();
    Animated.sequence(
      SHAKE_STEPS.map((toValue) =>
        Animated.timing(shake, { toValue, duration: SHAKE_STEP_DURATION, useNativeDriver: true }),
      ),
    ).start();
  };

  const onRight = (wordTiles, word) => {
    playRight();
    setFound((ids) => [...ids, ...wordTiles.map((t) => t.id)]);
    setFoundWords((list) => [...list, word]);
    if (unfound.length === 1) onLevelComplete(levelIndex);
    const newScore = score + POINTS_PER_WORD;
    setScore(newScore);
    if (newScore > best) {
      setBest(newScore);
      setNumber(STORAGE_KEYS.BEST_SCORE, newScore);
    }
    setResult('win');
  };

  // Rings every box that is free and holds a letter that can come next. The ring
  // stays until the player taps a box. Using it up, or finding nothing to ring,
  // is told in a popup instead.
  const showHint = () => {
    if (result) return;
    if (!helpLeft) {
      setNotice('over');
      return;
    }
    const next = nextLetters(spelled, unfound);
    const ids = round.tiles
      .filter((t) => !picked.some((p) => p.id === t.id) && !found.includes(t.id) && next.has(t.ch.toUpperCase()))
      .map((t) => t.id);
    if (!ids.length) {
      setNotice('none');
      return;
    }
    setHintIds(ids);
    setHelpLeft((n) => n - 1);
  };

  const openTile = (tile) => {
    if (result || picked.some((p) => p.id === tile.id)) return;
    setHintIds([]);
    const nextPicked = [...picked, tile];
    setPicked(nextPicked);
    setRevealed((ids) => (ids.includes(tile.id) ? ids : [...ids, tile.id]));
    const nextSpelled = nextPicked.map((t) => t.ch).join('');

    const whole = wholeWord(nextSpelled, unfound);
    if (!leadsToAWord(nextSpelled, unfound)) {
      onWrong(); // no word still to be found starts like this
    } else if (whole) {
      onRight(nextPicked, whole);
    } else {
      playTap();
    }
  };

  return (
    <View style={BaseStyle.flex}>
      <SkyBackdrop variant="play" />
    <SafeAreaView style={BaseStyle.flex}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.header]}>
        <View style={[styles.badge, BaseStyle.alignItemsCenter]}>
          <Text style={[styles.badgeLabel, style.fontSizeExtraSmall, style.fontWeightMedium1x]}>{TEXTS.score}</Text>
          <Text style={[styles.badgeValue, style.fontSizeLarge, style.fontWeightBold]}>{score}</Text>
        </View>
        <Text style={[styles.title, style.fontSizeLarge, style.fontWeightBold]}>{level.title}</Text>
        <View style={[styles.badge, BaseStyle.alignItemsCenter]}>
          <Text style={[styles.badgeLabel, style.fontSizeExtraSmall, style.fontWeightMedium1x]}>{TEXTS.best}</Text>
          <Text style={[styles.badgeValue, style.fontSizeLarge, style.fontWeightBold]}>{best}</Text>
        </View>
      </View>

      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.hintRow]}>
        <Pressable style={styles.back} onPress={onExit} hitSlop={wp(3)}>
          <Text style={[styles.backText, style.fontSizeLarge2x, style.fontWeightBold]}>{TEXTS.back}</Text>
        </Pressable>
        <Text style={[styles.hint, style.fontSizeNormal2x, style.fontWeightMedium1x]}>
          {foundWords.length}/{words.length} {TEXTS.words}
        </Text>
        <HelpButton left={helpLeft} onPress={showHint} />
      </View>

      <View
        style={[BaseStyle.flex, BaseStyle.alignJustifyCenter, styles.arena]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setArena({ w: width, h: height });
        }}
      >
        {cardWidth > 0 && cardHeight > 0 && (
          <View style={[BaseStyle.flexDirectionRow, BaseStyle.flexWrap, { width: GRID_COLUMNS * (cardWidth + 2 * CARD_MARGIN) }]}>
            {round.tiles.map((tile, i) => (
              <HiddenCard
                key={`${roundKey}-${tile.id}`}
                letter={tile.ch}
                width={cardWidth}
                height={cardHeight}
                colorIndex={tile.id}
                dealIndex={i}
                dealKey={roundKey}
                open={revealed.includes(tile.id)}
                used={picked.some((p) => p.id === tile.id)}
                found={found.includes(tile.id)}
                hint={hintIds.includes(tile.id)}
                disabled={!!result}
                onPress={() => openTile(tile)}
              />
            ))}
          </View>
        )}
      </View>

      <AnswerPanel length={longestWordLength(words)} reach={reach} picked={picked} result={result} shake={shake} />

      {result === 'lose' && (
        <Animated.View
          pointerEvents="none"
          style={[BaseStyle.positionAbsolute, BaseStyle.widthHeight100, BaseStyle.alignJustifyCenter, { transform: [{ scale: crossScale }] }]}
        >
          <Text style={[styles.cross, style.fontWeightBlack]}>{TEXTS.cross}</Text>
        </Animated.View>
      )}

      <ResultModal
        visible={notice !== null}
        icon={TEXTS.helpIcon}
        iconColor={gameAccentColor}
        title={notice === 'over' ? TEXTS.helpOverTitle : TEXTS.helpNoneTitle}
        message={notice === 'over' ? TEXTS.helpOverMessage : TEXTS.helpNoneMessage}
        buttonText={TEXTS.ok}
        onPress={() => setNotice(null)}
      />
      <ResultModal
        visible={result === 'lose'}
        icon={TEXTS.cross}
        iconColor={gameLoseColor}
        title={TEXTS.wrongTitle}
        message={TEXTS.wrongMessage}
        buttonText={TEXTS.startAgain}
        onPress={() => {
          // Only the letter that was wrong is taken back: its box is covered again and
          // it leaves the rack. The letters before it stay spelled and their boxes
          // stay open, and the grid itself is untouched. The score starts over.
          const wrong = picked[picked.length - 1];
          setScore(0);
          setPicked((tiles) => tiles.slice(0, -1));
          setRevealed((ids) => ids.filter((id) => id !== wrong.id));
          setResult(null);
        }}
      />
      <ResultModal
        visible={result === 'win' && !levelCleared}
        icon={TEXTS.tick}
        iconColor={gameWinColor}
        title={`${TEXTS.winTitle} +${POINTS_PER_WORD}`}
        message={picked.map((t) => t.ch).join('')}
        buttonText={TEXTS.nextWord}
        onPress={() => {
          // Same grid, with the word just spelled left open and marked, for as long
          // as the boxes still holding letters can make a word not found yet.
          const left = round.tiles.filter((t) => !found.includes(t.id));
          if (canSpellAnyWord(left, unfound)) {
            setPicked([]);
            setResult(null);
          } else {
            newGrid();
          }
        }}
      />
      <ResultModal
        visible={result === 'win' && levelCleared && !isLastLevel}
        icon={TEXTS.trophy}
        iconColor={gameAccentColor}
        title={`${level.title} ${TEXTS.levelCompleteTitle}`}
        message={TEXTS.levelCompleteMessage}
        buttonText={TEXTS.nextLevel}
        onPress={() => onNextLevel(score)}
      />
      <CompletionModal
        visible={result === 'win' && levelCleared && isLastLevel}
        role={role}
        score={score}
        onDone={onExit}
      />
    </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: wp(5), paddingTop: hp(2) },
  title: { color: roleTitleOnSky, letterSpacing: 0.4 },
  badge: {
    minWidth: wp(18),
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.xxxLarge,
    borderRadius: wp(4),
    backgroundColor: roleCardBg,
  },
  badgeLabel: { color: gameAccentColor, letterSpacing: 1.2 },
  badgeValue: { color: roleCardText },
  hintRow: { marginHorizontal: wp(5), marginTop: hp(2), marginBottom: hp(1.5) },
  back: { paddingRight: spacings.xxxLarge },
  backText: { color: roleTitleOnSky },
  hint: { flex: 1, color: roleTitleOnSky },
  arena: {
    marginHorizontal: wp(5),
    borderRadius: wp(7),
    borderWidth: 1.5,
    borderColor: skyGlassBorder,
    backgroundColor: skyGlass,
  },
  cross: { fontSize: wp(60), color: gameLoseColor },
});

export default WordMatchScreen;
