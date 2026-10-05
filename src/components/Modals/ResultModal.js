import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BaseStyle } from '../../constant/Style';
import { style, spacings } from '../../constant/Fonts';
import {
  gameCardColor,
  gameAccentColor,
  gameTextColor,
  gameMutedTextColor,
  gameBgColor,
  gameScrimColor,
} from '../../constant/Color';
import { widthPercentageToDP as wp } from '../../utils';

// One popup for both outcomes: the caller passes the icon, copy and colour.
const ResultModal = ({ visible, icon, iconColor, title, message, buttonText, onPress }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={[styles.scrim, BaseStyle.alignJustifyCenter]}>
      <View style={[styles.card, BaseStyle.alignItemsCenter]}>
        <Text style={[style.fontSizeExtraLarge, style.fontWeightBlack, styles.icon, { color: iconColor }]}>
          {icon}
        </Text>
        <Text style={[styles.title, style.fontSizeLargeXX, style.fontWeightBold]}>{title}</Text>
        <Text style={[styles.message, style.fontSizeNormal2x]}>{message}</Text>
        <Pressable style={[styles.button, BaseStyle.alignItemsCenter]} onPress={onPress}>
          <Text style={[styles.buttonText, style.fontSizeMedium1x, style.fontWeightBold]}>
            {buttonText}
          </Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: gameScrimColor },
  card: {
    width: wp(82),
    padding: spacings.xxxxLarge,
    borderRadius: wp(6),
    backgroundColor: gameCardColor,
  },
  icon: { fontSize: wp(16) },
  title: { color: gameTextColor, marginTop: spacings.normal },
  message: {
    color: gameMutedTextColor,
    textAlign: 'center',
    marginVertical: spacings.xxxLarge,
  },
  button: {
    alignSelf: 'stretch',
    paddingVertical: spacings.xLarge,
    borderRadius: wp(4),
    backgroundColor: gameAccentColor,
  },
  buttonText: { color: gameBgColor },
});

export default ResultModal;
