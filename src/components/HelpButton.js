import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameAccentColor,
  gameAccentSoft,
  gameOnAccentColor,
  gameTextColor,
} from '../constant/Color';
import { TEXTS } from '../constant/Constants';
import { widthPercentageToDP as wp } from '../utils';

// A small pill: a bulb, "Help", and how many uses are left. At zero it fades but
// still answers a tap, so the player is told why nothing happened.
const HelpButton = ({ left, onPress }) => (
  <Pressable
    style={[styles.button, BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, !left && styles.empty]}
    onPress={onPress}
  >
    <Text style={style.fontSizeNormal}>{TEXTS.helpIcon}</Text>
    <Text style={[styles.label, style.fontSizeSmall1x, style.fontWeightMedium1x]}>{TEXTS.help}</Text>
    <View style={[styles.count, BaseStyle.alignJustifyCenter]}>
      <Text style={[styles.countText, style.fontSizeExtraSmall, style.fontWeightBlack]}>{left}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.xxLarge,
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: gameAccentColor,
    backgroundColor: gameAccentSoft,
  },
  empty: { opacity: 0.5 },
  label: { color: gameTextColor, marginHorizontal: spacings.small },
  count: {
    minWidth: wp(4.5),
    height: wp(4.5),
    borderRadius: wp(2.25),
    backgroundColor: gameAccentColor,
  },
  countText: { color: gameOnAccentColor },
});

export default HelpButton;
