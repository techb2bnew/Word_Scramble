import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameBadgeBgColor,
  gameArenaBorderColor,
  gameAccentColor,
  gameOnAccentColor,
  gameTextColor,
} from '../constant/Color';
import { DIMMED_CHIP_OPACITY } from '../constant/Constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';

// The words that can be spelled, one block each, as a reference. Once letters
// have been spelled, the words that start with them light up and the rest fade,
// so the player can see which words they are heading for.
const WordChips = ({ words, typed }) => (
  <View style={[BaseStyle.flexDirectionRow, BaseStyle.flexWrap, BaseStyle.justifyContentCenter, styles.wrap]}>
    {words.map((word) => {
      const active = !!typed && word.toLowerCase().startsWith(typed.toLowerCase());
      const faded = !!typed && !active;
      return (
        <View key={word} style={[styles.chip, active && styles.chipActive, faded && styles.chipFaded]}>
          <Text
            style={[
              styles.text,
              style.fontSizeSmall1x,
              style.fontWeightMedium1x,
              active && styles.textActive,
            ]}
          >
            {word}
          </Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrap: { marginHorizontal: wp(4), marginBottom: hp(1) },
  chip: {
    margin: spacings.xsmall,
    paddingVertical: spacings.xsmall,
    paddingHorizontal: spacings.xxLarge,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: gameArenaBorderColor,
    backgroundColor: gameBadgeBgColor,
  },
  chipActive: { backgroundColor: gameAccentColor, borderColor: gameAccentColor },
  chipFaded: { opacity: DIMMED_CHIP_OPACITY },
  text: { color: gameTextColor },
  textActive: { color: gameOnAccentColor },
});

export default WordChips;
