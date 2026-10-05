import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameBadgeBgColor,
  gameAccentColor,
  gameTileTextColor,
  gameBubbleColors,
  gameCoverFrameColor,
  gameShimmerColor,
  shadowColor,
} from '../constant/Color';
import {
  CARD_FLIP_DURATION,
  SHIMMER_DURATION,
  SHIMMER_MIN_PAUSE,
  SHIMMER_MAX_PAUSE,
} from '../constant/Constants';
import { widthPercentageToDP as wp } from '../utils';
import { randomBetween } from '../utils/gameUtils';

export const CARD_MARGIN = spacings.small;

// A covered box that stays where it is. Its cover is a drawn card back — a
// frame, a diamond and a glint that now and then crosses it. Tapping the box
// turns it over to show its letter; the turn is about the vertical axis, with
// the cover and the letter each hidden while they face away.
const HiddenCard = ({ letter, width, height, open, disabled, colorIndex, onPress }) => {
  const flip = useRef(new Animated.Value(open ? 1 : 0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const pause = useRef(randomBetween(SHIMMER_MIN_PAUSE, SHIMMER_MAX_PAUSE)).current;

  useEffect(() => {
    Animated.timing(flip, {
      toValue: open ? 1 : 0,
      duration: CARD_FLIP_DURATION,
      useNativeDriver: true,
    }).start();
  }, [open, flip]);

  // The glint only runs while the box is covered.
  useEffect(() => {
    if (open) return undefined;
    const glint = Animated.loop(
      Animated.sequence([
        Animated.delay(pause),
        Animated.timing(shimmer, {
          toValue: 1,
          duration: SHIMMER_DURATION,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    glint.start();
    return () => glint.stop();
  }, [open, shimmer, pause]);

  const coverTurn = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const letterTurn = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const glintX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.5, width * 1.2] });
  const diamond = Math.min(width, height) * 0.34;

  return (
    <Pressable style={[styles.card, { width, height }]} disabled={open || disabled} onPress={onPress}>
      <Animated.View
        style={[
          styles.face,
          styles.cover,
          BaseStyle.alignJustifyCenter,
          { transform: [{ perspective: wp(200) }, { rotateY: coverTurn }] },
        ]}
      >
        <View style={styles.frame} />
        <View style={[styles.diamond, { width: diamond, height: diamond }]} />
        <Animated.View
          style={[
            styles.glint,
            {
              width: width * 0.3,
              height: height * 2,
              top: -height / 2,
              transform: [{ translateX: glintX }, { rotate: '20deg' }],
            },
          ]}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.face,
          BaseStyle.alignJustifyCenter,
          {
            backgroundColor: gameBubbleColors[colorIndex % gameBubbleColors.length],
            transform: [{ perspective: wp(200) }, { rotateY: letterTurn }],
          },
        ]}
      >
        <Text style={[styles.letter, style.fontSizeLarge, style.fontWeightBlack]}>{letter}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { margin: CARD_MARGIN },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: wp(2),
    backfaceVisibility: 'hidden',
    shadowColor,
    shadowOpacity: 0.3,
    shadowRadius: wp(1.5),
    shadowOffset: { width: 0, height: wp(0.8) },
    elevation: 4,
  },
  cover: {
    overflow: 'hidden',
    backgroundColor: gameBadgeBgColor,
    borderWidth: 2,
    borderColor: gameAccentColor,
  },
  frame: {
    position: 'absolute',
    top: wp(1),
    left: wp(1),
    right: wp(1),
    bottom: wp(1),
    borderRadius: wp(1),
    borderWidth: 1,
    borderColor: gameCoverFrameColor,
  },
  diamond: {
    borderRadius: wp(0.6),
    backgroundColor: gameAccentColor,
    transform: [{ rotate: '45deg' }],
  },
  glint: { position: 'absolute', left: 0, backgroundColor: gameShimmerColor },
  letter: { color: gameTileTextColor },
});

export default HiddenCard;
