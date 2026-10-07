import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { spacings } from '../constant/Fonts';
import {
  gameRackBgColor,
  gameAccentColor,
  gameProgressTrackColor,
  skyGlassBorder,
} from '../constant/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import AnswerSlot from './AnswerSlot';

// The room a row of slots has inside the rack, as the styles below lay it out.
const RACK_INNER_WIDTH = wp(100) - 2 * wp(5) - 2 * spacings.large;

// Slots keep their usual width, and only shrink when there are too many to fit
// on one line (a level with an 8 letter word).
const slotWidthFor = (length) =>
  Math.min(wp(10), Math.floor(RACK_INNER_WIDTH / length) - 2 * spacings.small - 1);

// Under the play area: a thin bar showing how much of the word is built, and
// the rack the letters land on.
// `reach` is how many slots the words still possible can fill: the empty slots
// below it light up, the ones past it fade. Null means no letters yet, so all
// slots look the same.
const AnswerPanel = ({ word, length = word?.length, reach = null, picked, result, shake }) => (
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
        <AnswerSlot
          key={i}
          width={slotWidthFor(length)}
          letter={picked[i]?.ch ?? ''}
          status={picked[i] ? result : null}
          highlight={reach !== null && !picked[i] && i < reach}
          faded={reach !== null && !picked[i] && i >= reach}
        />
      ))}
    </Animated.View>

  </View>
);

const styles = StyleSheet.create({
  wrap: { marginHorizontal: wp(5), marginTop: hp(2), marginBottom: hp(2) },
  track: {
    height: wp(1.8),
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
    borderWidth: 1,
    borderColor: skyGlassBorder,
    backgroundColor: gameRackBgColor,
  },
});

export default AnswerPanel;
