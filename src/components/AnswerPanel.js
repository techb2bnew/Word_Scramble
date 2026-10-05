import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { spacings } from '../constant/Fonts';
import {
  gameRackBgColor,
  gameAccentColor,
  gameProgressTrackColor,
} from '../constant/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import AnswerSlot from './AnswerSlot';

// Under the play area: a thin bar showing how much of the word is built, and
// the rack the letters land on.
const AnswerPanel = ({ word, length = word.length, picked, result, shake }) => (
  <View style={styles.wrap}>
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${(picked.length / length) * 100}%` }]} />
    </View>

    <Animated.View
      style={[
        styles.rack,
        BaseStyle.flexDirectionRow,
        BaseStyle.flexWrap,
        BaseStyle.justifyContentCenter,
        { transform: [{ translateX: shake }] },
      ]}
    >
      {Array.from({ length }, (_, i) => (
        <AnswerSlot key={i} letter={picked[i]?.ch ?? ''} status={picked[i] ? result : null} />
      ))}
    </Animated.View>

  </View>
);

const styles = StyleSheet.create({
  wrap: { marginHorizontal: wp(5), marginTop: hp(2), marginBottom: hp(2) },
  track: {
    height: wp(1.5),
    borderRadius: wp(1),
    overflow: 'hidden',
    backgroundColor: gameProgressTrackColor,
  },
  fill: { height: '100%', borderRadius: wp(1), backgroundColor: gameAccentColor },
  rack: {
    marginTop: hp(1.5),
    paddingVertical: spacings.xxxxLarge,
    paddingHorizontal: spacings.large,
    borderRadius: wp(5),
    backgroundColor: gameRackBgColor,
  },
});

export default AnswerPanel;
