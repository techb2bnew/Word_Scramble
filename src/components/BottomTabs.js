import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameCardColor,
  gameArenaBorderColor,
  gameTextColor,
  gameAccentColor,
} from '../constant/Color';
import { TEXTS } from '../constant/Constants';
import { heightPercentageToDP as hp } from '../utils';

const Tab = ({ icon, label, onPress }) => (
  <Pressable
    style={({ pressed }) => [styles.tab, BaseStyle.flex, BaseStyle.alignItemsCenter, pressed && styles.pressed]}
    onPress={onPress}
  >
    <Text style={[styles.icon, style.fontSizeLargeXX]}>{icon}</Text>
    <Text style={[styles.label, style.fontSizeSmall1x, style.fontWeightMedium1x]}>{label}</Text>
  </Pressable>
);

// Edge-to-edge bar at the very bottom, like a tab bar. It pads itself by the
// home-indicator inset so the bar reaches the screen edge but the tabs stay
// above the indicator.
const BottomTabs = ({ onShuffle, onUndo }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, BaseStyle.flexDirectionRow, { paddingBottom: insets.bottom }]}>
      <Tab icon={TEXTS.shuffleIcon} label={TEXTS.shuffle} onPress={onShuffle} />
      <View style={styles.divider} />
      <Tab icon={TEXTS.undoIcon} label={TEXTS.undo} onPress={onUndo} />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: gameArenaBorderColor,
    backgroundColor: gameCardColor,
  },
  tab: { paddingTop: hp(1.6), paddingBottom: hp(1.1) },
  pressed: { opacity: 0.5 },
  divider: { width: 1, marginVertical: spacings.xxxLarge, backgroundColor: gameArenaBorderColor },
  icon: { color: gameTextColor },
  label: { color: gameAccentColor, marginTop: spacings.small },
});

export default BottomTabs;
