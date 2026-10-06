import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { style } from '../constant/Fonts';
import { gameBubbleColors, gameTileTextColor, gameAccentColor } from '../constant/Color';
import {
  DONE_CONFETTI_COUNT,
  DONE_RAIN_COUNT,
  DONE_BURST_DOTS,
  DONE_SPARKLE_COUNT,
} from '../constant/Constants';
import { widthPercentageToDP as wp } from '../utils';
import { randomBetween } from '../utils/gameUtils';

// The animations shown after the last level. Each one fills the area it is given
// ({ w, h }) and runs for as long as it is on screen. They only use transforms
// and opacity, so all of it runs on the native side.

// Easings are made once here: a new one on every render would restart a loop.
const EASE_QUAD = Easing.inOut(Easing.quad);
const EASE_SIN = Easing.inOut(Easing.sin);
const EASE_OUT = Easing.out(Easing.quad);

// Plays 0 -> 1 over `duration`, waits `delay` first, then does it again for ever.
const useLoop = (duration, delay = 0, easing = Easing.linear) => {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(value, { toValue: 1, duration, easing, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration, delay, easing]);
  return value;
};

// Something that drops from above the area to below it, over and over, turning
// as it goes.
const Faller = ({ x, areaHeight, delay, duration, spin, children }) => {
  const t = useLoop(duration, delay);
  return (
    <Animated.View
      style={[
        styles.faller,
        {
          left: x,
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [-wp(12), areaHeight] }) },
            { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${spin}deg`] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// 1. Confetti: small coloured pieces fall all over the area.
export const Confetti = ({ area }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: DONE_CONFETTI_COUNT }, (_, i) => ({
        id: i,
        x: randomBetween(0, area.w),
        size: randomBetween(wp(1.8), wp(4)),
        color: gameBubbleColors[i % gameBubbleColors.length],
        delay: randomBetween(0, 3000),
        duration: randomBetween(2600, 4800),
        spin: Math.random() < 0.5 ? 540 : -540,
      })),
    [area.w],
  );
  return pieces.map((p) => (
    <Faller key={p.id} x={p.x} areaHeight={area.h} delay={p.delay} duration={p.duration} spin={p.spin}>
      <View style={{ width: p.size * 1.6, height: p.size, backgroundColor: p.color }} />
    </Faller>
  ));
};

// 2. Letter rain: tiles carrying letters of the role's own words drift down.
export const LetterRain = ({ area, letters }) => {
  const tile = wp(9);
  const pieces = useMemo(
    () =>
      Array.from({ length: DONE_RAIN_COUNT }, (_, i) => ({
        id: i,
        x: (i / DONE_RAIN_COUNT) * (area.w - tile) + randomBetween(-wp(2), wp(2)),
        letter: letters[Math.floor(Math.random() * letters.length)],
        color: gameBubbleColors[i % gameBubbleColors.length],
        delay: randomBetween(0, 4000),
        duration: randomBetween(4500, 7500),
        spin: Math.random() < 0.5 ? 25 : -25,
      })),
    [area.w, letters, tile],
  );
  return pieces.map((p) => (
    <Faller key={p.id} x={p.x} areaHeight={area.h} delay={p.delay} duration={p.duration} spin={p.spin}>
      <View style={[styles.rainTile, { width: tile, height: tile, backgroundColor: p.color }]}>
        <Text style={[styles.rainLetter, style.fontSizeLarge, style.fontWeightBlack]}>{p.letter}</Text>
      </View>
    </Faller>
  ));
};

// 3. Trophy: a big trophy that bounces, ringed by sparkles that flare in turn.
const Sparkle = ({ cx, cy, delay }) => {
  const t = useLoop(1800, delay, EASE_QUAD);
  return (
    <Animated.Text
      style={[
        styles.spark,
        style.fontSizeLarge2x,
        {
          left: cx,
          top: cy,
          opacity: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
          transform: [{ scale: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1.3, 0.3] }) }],
        },
      ]}
    >
      ✨
    </Animated.Text>
  );
};

export const Trophy = ({ area }) => {
  const bounce = useLoop(1400, 0, EASE_SIN);
  const radius = Math.min(area.w, area.h) * 0.38;
  const cx = area.w / 2;
  const cy = area.h / 2;
  return (
    <>
      {Array.from({ length: DONE_SPARKLE_COUNT }, (_, i) => {
        const a = (i / DONE_SPARKLE_COUNT) * Math.PI * 2;
        return (
          <Sparkle
            key={i}
            cx={cx + Math.cos(a) * radius - wp(4)}
            cy={cy + Math.sin(a) * radius - wp(4)}
            delay={i * 180}
          />
        );
      })}
      <Animated.Text
        style={[
          styles.trophy,
          {
            left: cx - wp(14),
            top: cy - wp(15),
            transform: [
              { scale: bounce.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.18, 1] }) },
              { rotate: bounce.interpolate({ inputRange: [0, 0.25, 0.75, 1], outputRange: ['0deg', '-8deg', '8deg', '0deg'] }) },
            ],
          },
        ]}
      >
        🏆
      </Animated.Text>
    </>
  );
};

// 4. Truck: a truck drives across the road again and again, under slow clouds.
export const Truck = ({ area }) => {
  const drive = useLoop(3600);
  const bump = useLoop(320, 0, EASE_SIN);
  const cloud = useLoop(14000);
  const road = area.h * 0.72;
  return (
    <>
      <Animated.Text
        style={[
          styles.cloud,
          {
            top: area.h * 0.12,
            transform: [{ translateX: cloud.interpolate({ inputRange: [0, 1], outputRange: [area.w, -wp(20)] }) }],
          },
        ]}
      >
        ☁️
      </Animated.Text>
      <Animated.Text
        style={[
          styles.cloud,
          {
            top: area.h * 0.3,
            transform: [{ translateX: cloud.interpolate({ inputRange: [0, 1], outputRange: [area.w * 0.4, -wp(60)] }) }],
          },
        ]}
      >
        ☁️
      </Animated.Text>
      <Animated.Text
        style={[
          styles.truck,
          {
            top: road - wp(22),
            transform: [
              { translateX: drive.interpolate({ inputRange: [0, 1], outputRange: [-wp(28), area.w] }) },
              { translateY: bump.interpolate({ inputRange: [0, 1], outputRange: [0, -wp(1)] }) },
            ],
          },
        ]}
      >
        🚛
      </Animated.Text>
      <View style={[styles.road, { top: road, width: area.w }]} />
    </>
  );
};

// 5. Fireworks: a few bursts go off one after another, each throwing sparks out.
const Burst = ({ cx, cy, delay, color, reach }) => {
  const t = useLoop(2200, delay, EASE_OUT);
  return Array.from({ length: DONE_BURST_DOTS }, (_, i) => {
    const a = (i / DONE_BURST_DOTS) * Math.PI * 2;
    return (
      <Animated.View
        key={i}
        style={[
          styles.dot,
          {
            left: cx,
            top: cy,
            backgroundColor: color,
            opacity: t.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 0] }),
            transform: [
              { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(a) * reach] }) },
              { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(a) * reach] }) },
              { scale: t.interpolate({ inputRange: [0, 1], outputRange: [1.4, 0.3] }) },
            ],
          },
        ]}
      />
    );
  });
};

export const Fireworks = ({ area }) => {
  const reach = Math.min(area.w, area.h) * 0.26;
  const bursts = [
    { fx: 0.28, fy: 0.3, delay: 0, color: gameBubbleColors[0] },
    { fx: 0.72, fy: 0.25, delay: 700, color: gameBubbleColors[2] },
    { fx: 0.5, fy: 0.6, delay: 1400, color: gameBubbleColors[1] },
  ];
  return bursts.map((b) => (
    <Burst key={b.fx} cx={area.w * b.fx} cy={area.h * b.fy} delay={b.delay} color={b.color} reach={reach} />
  ));
};

const VARIANTS = [Confetti, LetterRain, Trophy, Truck, Fireworks];
let lastVariant = -1;

// A different animation each time: never the one shown last.
export const pickVariant = () => {
  let next;
  do {
    next = Math.floor(Math.random() * VARIANTS.length);
  } while (next === lastVariant && VARIANTS.length > 1);
  lastVariant = next;
  return VARIANTS[next];
};

const styles = StyleSheet.create({
  faller: { position: 'absolute', top: 0 },
  rainTile: { borderRadius: wp(2), alignItems: 'center', justifyContent: 'center' },
  rainLetter: { color: gameTileTextColor },
  spark: { position: 'absolute' },
  trophy: { position: 'absolute', fontSize: wp(28) },
  cloud: { position: 'absolute', fontSize: wp(14), opacity: 0.85 },
  truck: { position: 'absolute', left: 0, fontSize: wp(20) },
  road: { position: 'absolute', left: 0, height: 4, backgroundColor: gameAccentColor, opacity: 0.6 },
  dot: { position: 'absolute', width: wp(2.2), height: wp(2.2), borderRadius: wp(1.1) },
});
