import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import { gameBgColor, gameAccentColor, gameTextColor } from '../constant/Color';
import {
  SPLASH_DURATION,
  SPLASH_FADE_DURATION,
  SPLASH_SPRING_FRICTION,
  SPLASH_START_SCALE,
  SPLASH_LOGO_LETTERS,
  TEXTS,
} from '../constant/Constants';
import { widthPercentageToDP as wp } from '../utils';

const SplashScreen = ({ onDone }) => {
  const scale = useRef(new Animated.Value(SPLASH_START_SCALE)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: SPLASH_SPRING_FRICTION, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: SPLASH_FADE_DURATION, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(onDone, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [onDone, scale, opacity]);

  return (
    <View style={[BaseStyle.flex, BaseStyle.alignJustifyCenter, styles.container]}>
      <Animated.View style={[BaseStyle.alignItemsCenter, { opacity, transform: [{ scale }] }]}>
        <View style={BaseStyle.flexDirectionRow}>
          {SPLASH_LOGO_LETTERS.map((letter) => (
            <View key={letter} style={[styles.tile, BaseStyle.alignJustifyCenter, BaseStyle.borderRadius10]}>
              <Text style={[styles.letter, style.fontSizeExtraLarge, style.fontWeightBlack]}>
                {letter}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.sub, style.fontSizeLarge, style.fontWeightMedium1x]}>
          {TEXTS.splashSub}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: gameBgColor },
  tile: {
    width: wp(16),
    height: wp(16),
    margin: spacings.normal,
    backgroundColor: gameAccentColor,
  },
  letter: { color: gameBgColor },
  sub: {
    color: gameTextColor,
    marginTop: spacings.xxxxLarge,
    letterSpacing: wp(2),
  },
});

export default SplashScreen;
