import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameRackSlotColor,
  gameAccentColor,
  gameTileFaceColor,
  gameTileEdgeColor,
  gameSlotFilledTextColor,
  gameTextColor,
  gameWinColor,
  gameWinEdgeColor,
  gameLoseColor,
  gameLoseEdgeColor,
} from '../constant/Color';
import { SLOT_FADED_OPACITY } from '../constant/Constants';
import { widthPercentageToDP as wp } from '../utils';

// An empty slot is a dark recess in the rack. A letter becomes a raised tile:
// a face colour with a thicker, darker bottom edge. status: 'win' | 'lose' | null
// An empty slot can also be `highlight`ed (a word can still reach it) or `faded`
// (none can).
const AnswerSlot = ({ letter, status, highlight, faded, width }) => (
  <View
    style={[
      styles.slot,
      width ? { width } : null,
      BaseStyle.alignJustifyCenter,
      !letter && styles.empty,
      highlight && styles.highlight,
      faded && styles.faded,
      !!letter && styles.tile,
      status === 'win' && styles.win,
      status === 'lose' && styles.lose,
    ]}
  >
    <Text
      style={[
        style.fontSizeLargeXX,
        style.fontWeightBlack,
        { color: status ? gameTextColor : gameSlotFilledTextColor },
      ]}
    >
      {letter}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  slot: {
    width: wp(10),
    height: wp(13),
    marginHorizontal: spacings.small,
    borderRadius: wp(2.5),
  },
  empty: { backgroundColor: gameRackSlotColor },
  highlight: { borderWidth: 2, borderColor: gameAccentColor },
  faded: { opacity: SLOT_FADED_OPACITY },
  tile: {
    backgroundColor: gameTileFaceColor,
    borderBottomWidth: wp(1.5),
    borderBottomColor: gameTileEdgeColor,
  },
  win: { backgroundColor: gameWinColor, borderBottomColor: gameWinEdgeColor },
  lose: { backgroundColor: gameLoseColor, borderBottomColor: gameLoseEdgeColor },
});

export default AnswerSlot;
