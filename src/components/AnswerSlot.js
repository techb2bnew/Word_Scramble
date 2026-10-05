import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameRackSlotColor,
  gameTileFaceColor,
  gameTileEdgeColor,
  gameSlotFilledTextColor,
  gameTextColor,
  gameWinColor,
  gameWinEdgeColor,
  gameLoseColor,
  gameLoseEdgeColor,
} from '../constant/Color';
import { widthPercentageToDP as wp } from '../utils';

// An empty slot is a dark recess in the rack. A letter becomes a raised tile:
// a face colour with a thicker, darker bottom edge. status: 'win' | 'lose' | null
const AnswerSlot = ({ letter, status }) => (
  <View
    style={[
      styles.slot,
      BaseStyle.alignJustifyCenter,
      !letter && styles.empty,
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
  tile: {
    backgroundColor: gameTileFaceColor,
    borderBottomWidth: wp(1.5),
    borderBottomColor: gameTileEdgeColor,
  },
  win: { backgroundColor: gameWinColor, borderBottomColor: gameWinEdgeColor },
  lose: { backgroundColor: gameLoseColor, borderBottomColor: gameLoseEdgeColor },
});

export default AnswerSlot;
