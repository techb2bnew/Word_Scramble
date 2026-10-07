import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import {
  roleSkyBands,
  splashSkyBands,
  onboardSkyBands,
  playSkyBands,
  shuffleSkyBands,
  doneSkyBands,
  roleSunColor,
  roleSunGlowColor,
  splashSunColor,
  splashSunGlowColor,
  roleCloudColor,
  roleStarColor,
} from '../constant/Color';
import { ROLE_CLOUD_DURATION } from '../constant/Constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';

const STARS = [
  { t: '8%', l: '12%' },
  { t: '5%', l: '38%' },
  { t: '11%', l: '58%' },
  { t: '6%', l: '78%' },
  { t: '14%', l: '22%' },
];

const VARIANTS = {
  role: {
    bands: roleSkyBands,
    sun: roleSunColor,
    glow: roleSunGlowColor,
    sunTop: hp(6),
    sunRight: wp(10),
    sunSize: wp(16),
    glowPad: wp(6),
    clouds: [
      { top: hp(6), size: wp(28), duration: ROLE_CLOUD_DURATION, delay: 0, start: -wp(20) },
      { top: hp(16), size: wp(22), duration: ROLE_CLOUD_DURATION + 8000, delay: 800, start: wp(40) },
      { top: hp(28), size: wp(32), duration: ROLE_CLOUD_DURATION + 4000, delay: 1600, start: wp(8) },
    ],
    stars: true,
    pulse: false,
  },
  splash: {
    bands: splashSkyBands,
    sun: splashSunColor,
    glow: splashSunGlowColor,
    sunTop: hp(16),
    sunRight: wp(29),
    sunSize: wp(42),
    glowPad: wp(10),
    clouds: [
      { top: hp(8), size: wp(30), duration: ROLE_CLOUD_DURATION + 8000, delay: 0, start: wp(4) },
    ],
    stars: false,
    pulse: true,
  },
  onboard: {
    bands: onboardSkyBands,
    sun: roleSunColor,
    glow: roleSunGlowColor,
    sunTop: hp(4),
    sunRight: wp(62),
    sunSize: wp(14),
    glowPad: wp(5),
    clouds: [
      { top: hp(10), size: wp(26), duration: ROLE_CLOUD_DURATION + 5000, delay: 0, start: wp(20) },
      { top: hp(24), size: wp(20), duration: ROLE_CLOUD_DURATION + 9000, delay: 1400, start: -wp(10) },
    ],
    stars: false,
    pulse: false,
  },
  play: {
    bands: playSkyBands,
    sun: roleSunColor,
    glow: roleSunGlowColor,
    sunTop: hp(2),
    sunRight: wp(4),
    sunSize: wp(12),
    glowPad: wp(4),
    clouds: [
      { top: hp(8), size: wp(24), duration: ROLE_CLOUD_DURATION + 12000, delay: 0, start: wp(50) },
    ],
    stars: false,
    pulse: false,
  },
  shuffle: {
    bands: shuffleSkyBands,
    sun: roleSunColor,
    glow: roleSunGlowColor,
    sunTop: hp(5),
    sunRight: wp(8),
    sunSize: wp(18),
    glowPad: wp(7),
    clouds: [
      { top: hp(12), size: wp(26), duration: ROLE_CLOUD_DURATION, delay: 0, start: -wp(16) },
      { top: hp(26), size: wp(20), duration: ROLE_CLOUD_DURATION + 7000, delay: 900, start: wp(55) },
    ],
    stars: false,
    pulse: false,
  },
  done: {
    bands: doneSkyBands,
    sun: splashSunColor,
    glow: splashSunGlowColor,
    sunTop: hp(8),
    sunRight: wp(32),
    sunSize: wp(28),
    glowPad: wp(8),
    clouds: [],
    stars: true,
    pulse: true,
  },
};

const DriftCloud = ({ top, size, duration, delay, start }) => {
  const x = useRef(new Animated.Value(start)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, {
          toValue: wp(110),
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(x, { toValue: -size, duration: 0, useNativeDriver: true }),
      ]),
    );
    const startTimer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(startTimer);
      loop.stop();
    };
  }, [x, duration, delay, size]);

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          top,
          width: size,
          height: size * 0.42,
          transform: [{ translateX: x }],
        },
      ]}
    >
      <View style={[styles.puff, { width: size * 0.55, height: size * 0.38, left: size * 0.08, top: size * 0.04 }]} />
      <View style={[styles.puff, { width: size * 0.48, height: size * 0.34, left: size * 0.42, top: size * 0.08 }]} />
    </Animated.View>
  );
};

const Sun = ({ config }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!config.pulse) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [config.pulse, pulse]);

  const glowSize = config.sunSize + config.glowPad * 2;

  return (
    <Animated.View
      style={[
        styles.sunWrap,
        {
          top: config.sunTop,
          right: config.sunRight,
          width: glowSize,
          height: glowSize,
          transform: [{ scale: pulse }],
        },
      ]}
    >
      <View
        style={[
          styles.sunGlow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: config.glow,
          },
        ]}
      />
      <View
        style={[
          styles.sun,
          {
            width: config.sunSize,
            height: config.sunSize,
            borderRadius: config.sunSize / 2,
            backgroundColor: config.sun,
          },
        ]}
      />
    </Animated.View>
  );
};

const SkyBackdrop = ({ variant = 'role' }) => {
  const config = VARIANTS[variant] || VARIANTS.role;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {config.bands.map((color) => (
          <View key={color} style={[BaseStyle.flex, { backgroundColor: color }]} />
        ))}
        {config.stars &&
          STARS.map((star) => (
            <View key={`${star.t}-${star.l}`} style={[styles.star, { top: star.t, left: star.l }]} />
          ))}
        <Sun config={config} />
        {config.clouds.map((cloud, i) => (
          <DriftCloud key={i} {...cloud} />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    width: wp(1.2),
    height: wp(1.2),
    borderRadius: wp(0.6),
    backgroundColor: roleStarColor,
  },
  sunWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunGlow: { position: 'absolute' },
  sun: {},
  cloud: { position: 'absolute', left: 0 },
  puff: {
    position: 'absolute',
    borderRadius: wp(10),
    backgroundColor: roleCloudColor,
  },
});

export default SkyBackdrop;
