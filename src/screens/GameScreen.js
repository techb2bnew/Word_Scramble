import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
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
  STORAGE_KEYS,
  SHAKE_STEPS,
  SHAKE_STEP_DURATION,
  CROSS_SPRING_FRICTION,
  TEXTS,
} from '../constant/Constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { shuffleWord, pickWord } from '../utils/gameUtils';
import { getNumber, setNumber } from '../utils/storage';
import { playTap, playRight, playWrong } from '../utils/feedback';
import FloatingLetter, { FLOATING_TILE_SIZE } from '../components/FloatingLetter';
import useBubblePhysics from '../hooks/useBubblePhysics';
import AnswerPanel from '../components/AnswerPanel';
import BottomTabs from '../components/BottomTabs';
import ResultModal from '../components/Modals/ResultModal';
import SkyBackdrop from '../components/SkyBackdrop';

const GameScreen = () => {
  const [word, setWord] = useState(() => pickWord());
  const [pool, setPool] = useState(() => shuffleWord(word));
  const [picked, setPicked] = useState([]);
  const [result, setResult] = useState(null); // 'win' | 'lose' | null
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [arena, setArena] = useState({ w: 0, h: 0 });
  const [scatterKey, setScatterKey] = useState(0);
  const bubbles = useBubblePhysics({
    count: word.length,
    arena,
    size: FLOATING_TILE_SIZE,
    resetKey: `${word}-${scatterKey}`,
    activeIds: pool.map((t) => t.id),
  });
  // Load the saved best score once. max() keeps a score earned before the read
  // finished from being overwritten by an older saved value.
  useEffect(() => {
    getNumber(STORAGE_KEYS.BEST_SCORE).then((saved) => setBest((b) => Math.max(b, saved)));
  }, []);

  const shake = useRef(new Animated.Value(0)).current;
  const crossScale = useRef(new Animated.Value(0)).current;

  // Bumping scatterKey re-deals every bubble to a new spot and heading; the
  // Shuffle button and a new round both use it.
  const startRound = useCallback((newWord) => {
    setWord(newWord);
    setPool(shuffleWord(newWord));
    setPicked([]);
    setResult(null);
    setScatterKey((k) => k + 1);
  }, []);

  const reshuffle = () => setScatterKey((k) => k + 1);

  const undo = () => {
    if (result || !picked.length) return;
    const last = picked[picked.length - 1];
    setPicked(picked.slice(0, -1));
    setPool((current) => [...current, last]);
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

  const onRight = () => {
    playRight();
    const newScore = score + POINTS_PER_WORD;
    setScore(newScore);
    if (newScore > best) {
      setBest(newScore);
      setNumber(STORAGE_KEYS.BEST_SCORE, newScore);
    }
    setResult('win');
  };

  const pickTile = (tile) => {
    if (result) return;
    const nextPicked = [...picked, tile];
    setPicked(nextPicked);
    setPool((current) => current.filter((t) => t.id !== tile.id));

    // The last letter plays the result sound instead, so the two never overlap.
    if (nextPicked.length < word.length) playTap();

    if (nextPicked.length === word.length) {
      const guess = nextPicked.map((t) => t.ch).join('');
      guess === word ? onRight() : onWrong();
    }
  };

  const restartAfterLose = () => {
    setScore(0);
    startRound(word);
  };

  return (
    <View style={BaseStyle.flex}>
      <SkyBackdrop variant="shuffle" />
    <SafeAreaView edges={['top']} style={BaseStyle.flex}>
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

      <Text style={[styles.hint, style.fontSizeNormal, BaseStyle.textAlign]}>
        {TEXTS.hint} ({word.length} {TEXTS.letters})
      </Text>

      <View
        style={[BaseStyle.flex, styles.arena]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setArena({ w: width, h: height });
        }}
      >
        {arena.w > 0 &&
          pool.map((tile) => (
            <FloatingLetter
              key={tile.id}
              letter={tile.ch}
              x={bubbles[tile.id].x}
              y={bubbles[tile.id].y}
              colorIndex={tile.id}
              onPress={() => pickTile(tile)}
            />
          ))}
      </View>

      <AnswerPanel
        word={word}
        picked={picked}
        result={result}
        shake={shake}
      />

      <BottomTabs onShuffle={reshuffle} onUndo={undo} />

      {result === 'lose' && (
        <Animated.View
          pointerEvents="none"
          style={[BaseStyle.positionAbsolute, BaseStyle.widthHeight100, BaseStyle.alignJustifyCenter, { transform: [{ scale: crossScale }] }]}
        >
          <Text style={[styles.cross, style.fontWeightBlack]}>{TEXTS.cross}</Text>
        </Animated.View>
      )}

      <ResultModal
        visible={result === 'lose'}
        icon={TEXTS.cross}
        iconColor={gameLoseColor}
        title={TEXTS.wrongTitle}
        message={TEXTS.wrongMessage}
        buttonText={TEXTS.startAgain}
        onPress={restartAfterLose}
      />
      <ResultModal
        visible={result === 'win'}
        icon={TEXTS.tick}
        iconColor={gameWinColor}
        title={`${TEXTS.winTitle} +${POINTS_PER_WORD}`}
        message={word}
        buttonText={TEXTS.nextWord}
        onPress={() => startRound(pickWord(word))}
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
  hint: { color: roleTitleOnSky, marginTop: hp(3), marginBottom: hp(1.5) },
  arena: {
    marginHorizontal: wp(5),
    borderRadius: wp(7),
    borderWidth: 1.5,
    borderColor: skyGlassBorder,
    backgroundColor: skyGlass,
  },
  cross: { fontSize: wp(60), color: gameLoseColor },
});

export default GameScreen;
