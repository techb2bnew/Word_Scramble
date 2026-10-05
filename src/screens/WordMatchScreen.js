import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameBgColor,
  gameBadgeBgColor,
  gameArenaBgColor,
  gameArenaBorderColor,
  gameAccentColor,
  gameTextColor,
  gameMutedTextColor,
  gameWinColor,
  gameLoseColor,
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
  dealRound,
  leadsToAWord,
  isWholeWord,
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

// A still grid of covered boxes; the player taps them one by one and each box
// turns over, its letter landing in the rack.
// After every letter, what has been spelled so far must still be the start of
// one of the hidden words (WORDS), or the round is lost. Spelling a whole hidden
// word wins it. The words themselves are never shown.
// Room kept free inside the play area, so the grid never touches its border.
const GRID_PADDING = wp(3);

const WordMatchScreen = () => {
  const [round, setRound] = useState(() => dealRound());
  const [roundKey, setRoundKey] = useState(0);
  const [picked, setPicked] = useState([]); // tiles in the word being spelled, in tap order
  const [revealed, setRevealed] = useState([]); // ids of boxes that have been uncovered
  const [found, setFound] = useState([]); // ids of boxes in words already spelled
  const [helpLeft, setHelpLeft] = useState(HELP_LIMIT);
  const [hintIds, setHintIds] = useState([]); // boxes the last Help ringed
  const [notice, setNotice] = useState(null); // 'over' | 'none' | null
  const [result, setResult] = useState(null); // 'win' | 'lose' | null
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [arena, setArena] = useState({ w: 0, h: 0 });
  const shake = useRef(new Animated.Value(0)).current;
  const crossScale = useRef(new Animated.Value(0)).current;

  // How far the words that are still possible can go. After `E`, every word that
  // starts with it is 3 letters long, so only the next 2 slots stay lit.
  const spelled = picked.map((t) => t.ch).join('');
  const reach = spelled && !result ? wordReach(spelled) : null;

  // Boxes are sized to fill the play area, both ways, so a grid of any size fits
  // any phone. They are wider than tall once there are more rows than columns.
  const cardWidth = Math.floor((arena.w - GRID_PADDING) / GRID_COLUMNS) - 2 * CARD_MARGIN;
  const cardHeight = Math.floor((arena.h - GRID_PADDING) / GRID_ROWS) - 2 * CARD_MARGIN;

  // Load the saved best score once. max() keeps a score earned before the read
  // finished from being overwritten by an older saved value.
  useEffect(() => {
    getNumber(STORAGE_KEYS.BEST_SCORE).then((saved) => setBest((b) => Math.max(b, saved)));
  }, []);

  const startRound = useCallback((previousTarget) => {
    setRound(dealRound(previousTarget));
    setPicked([]);
    setRevealed([]);
    setFound([]);
    setHintIds([]);
    setHelpLeft(HELP_LIMIT);
    setResult(null);
    setRoundKey((k) => k + 1);
  }, []);

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

  const onRight = (wordTiles) => {
    playRight();
    setFound((ids) => [...ids, ...wordTiles.map((t) => t.id)]);
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
    const next = nextLetters(spelled);
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

    if (!leadsToAWord(nextSpelled)) {
      onWrong(); // no hidden word starts like this
    } else if (isWholeWord(nextSpelled)) {
      onRight(nextPicked);
    } else {
      playTap();
    }
  };

  return (
    <SafeAreaView style={[BaseStyle.flex, styles.container]}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.header]}>
        <View style={[styles.badge, BaseStyle.alignItemsCenter]}>
          <Text style={[styles.badgeLabel, style.fontSizeExtraSmall, style.fontWeightMedium1x]}>{TEXTS.score}</Text>
          <Text style={[styles.badgeValue, style.fontSizeLarge, style.fontWeightBold]}>{score}</Text>
        </View>
        <Text style={[styles.title, style.fontSizeLarge, style.fontWeightBold]}>{TEXTS.appName}</Text>
        <View style={[styles.badge, BaseStyle.alignItemsCenter]}>
          <Text style={[styles.badgeLabel, style.fontSizeExtraSmall, style.fontWeightMedium1x]}>{TEXTS.best}</Text>
          <Text style={[styles.badgeValue, style.fontSizeLarge, style.fontWeightBold]}>{best}</Text>
        </View>
      </View>

      <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween, styles.hintRow]}>
        <Text style={[styles.hint, style.fontSizeNormal]}>{TEXTS.matchHint}</Text>
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
            {round.tiles.map((tile) => (
              <HiddenCard
                key={`${roundKey}-${tile.id}`}
                letter={tile.ch}
                width={cardWidth}
                height={cardHeight}
                colorIndex={tile.id}
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

      <AnswerPanel word={round.target} length={longestWordLength()} reach={reach} picked={picked} result={result} shake={shake} />

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
        visible={result === 'win'}
        icon={TEXTS.tick}
        iconColor={gameWinColor}
        title={`${TEXTS.winTitle} +${POINTS_PER_WORD}`}
        message={picked.map((t) => t.ch).join('')}
        buttonText={TEXTS.nextWord}
        onPress={() => {
          // Same grid, with the word just spelled left open and marked, for as long
          // as the boxes still holding letters can make another word.
          const left = round.tiles.filter((t) => !found.includes(t.id));
          if (canSpellAnyWord(left)) {
            setPicked([]);
            setResult(null);
          } else {
            startRound(round.target);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: gameBgColor },
  header: { paddingHorizontal: wp(5), paddingTop: hp(2) },
  title: { color: gameTextColor },
  badge: {
    minWidth: wp(18),
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.xxxLarge,
    borderRadius: wp(3),
    backgroundColor: gameBadgeBgColor,
  },
  badgeLabel: { color: gameAccentColor, letterSpacing: 1 },
  badgeValue: { color: gameTextColor },
  hintRow: { marginHorizontal: wp(5), marginTop: hp(2), marginBottom: hp(1.5) },
  hint: { flex: 1, color: gameMutedTextColor },
  arena: {
    marginHorizontal: wp(5),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: gameArenaBorderColor,
    backgroundColor: gameArenaBgColor,
  },
  cross: { fontSize: wp(60), color: gameLoseColor },
});

export default WordMatchScreen;
