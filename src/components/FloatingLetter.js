import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { style } from '../constant/Fonts';
import { gameTileTextColor, shadowColor, gameBubbleColors, gameTileEdgeColor } from '../constant/Color';
import { widthPercentageToDP as wp } from '../utils';

export const FLOATING_TILE_SIZE = wp(16);

// A round letter. It does not move itself: x and y are Animated.Values that
// useBubblePhysics updates every frame.
const FloatingLetter = ({ letter, x, y, colorIndex, onPress }) => (
  <Animated.View
    style={[
      styles.bubble,
      BaseStyle.positionAbsolute,
      { transform: [{ translateX: x }, { translateY: y }] },
    ]}
  >
    <Pressable
      style={[
        styles.press,
        BaseStyle.alignJustifyCenter,
        { backgroundColor: gameBubbleColors[colorIndex % gameBubbleColors.length] },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.letter, style.fontSizeLarge2x, style.fontWeightBlack]}>{letter}</Text>
    </Pressable>
  </Animated.View>
);

const styles = StyleSheet.create({
  bubble: {
    top: 0,
    left: 0,
    width: FLOATING_TILE_SIZE,
    height: FLOATING_TILE_SIZE,
    shadowColor,
    shadowOpacity: 0.45,
    shadowRadius: wp(2.5),
    shadowOffset: { width: 0, height: wp(1.4) },
    elevation: 8,
  },
  press: {
    width: '100%',
    height: '100%',
    borderRadius: wp(4),
    borderBottomWidth: wp(1.4),
    borderBottomColor: gameTileEdgeColor,
  },
  letter: { color: gameTileTextColor },
});

export default FloatingLetter;
