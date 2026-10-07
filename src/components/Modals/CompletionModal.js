import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyle } from '../../constant/Style';
import { style, spacings } from '../../constant/Fonts';
import {
  gameAccentColor,
  gameOnAccentColor,
  gameTileEdgeColor,
  roleTitleOnSky,
} from '../../constant/Color';
import { TEXTS } from '../../constant/Constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { pickVariant } from '../CompletionAnimations';
import SkyBackdrop from '../SkyBackdrop';

// Shown when the last level of a role is cleared: a full screen with one of
// several animations (a different one each time), a line about the role, the
// score, and a button back to the role screen, where the role can be played
// again from its first level.
const CompletionModal = ({ visible, role, score, onDone }) => {
  const [Variant, setVariant] = useState(null);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const rise = useRef(new Animated.Value(0)).current;

  // The role's own letters, for the letter rain.
  const letters = useMemo(
    () => [...new Set(role.levels.flatMap((level) => level.words).join(''))],
    [role],
  );

  useEffect(() => {
    if (!visible) return;
    setVariant(() => pickVariant());
    rise.setValue(0);
    Animated.timing(rise, {
      toValue: 1,
      duration: 700,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, rise]);

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={BaseStyle.flex}>
        <SkyBackdrop variant="done" />
        <SafeAreaView style={BaseStyle.flex}>
        <View
          style={[BaseStyle.flex, styles.stage]}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setArea({ w: width, h: height });
          }}
        >
          {Variant && area.w > 0 && <Variant area={area} letters={letters} />}
        </View>

        <Animated.View
          style={[
            BaseStyle.alignItemsCenter,
            styles.text,
            {
              opacity: rise,
              transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [hp(4), 0] }) }],
            },
          ]}
        >
          <Text style={[styles.title, style.fontSizeLarge3x, style.fontWeightBlack, BaseStyle.textAlign]}>
            {TEXTS.doneTitle}
          </Text>
          <Text style={[styles.line, style.fontSizeMedium, BaseStyle.textAlign]}>{role.completionLine}</Text>
          <Text style={[styles.score, style.fontSizeLargeX, style.fontWeightBold]}>
            {TEXTS.doneScore}: {score}
          </Text>
        </Animated.View>

        <Pressable style={[styles.button, BaseStyle.alignItemsCenter]} onPress={onDone}>
          <Text style={[styles.buttonText, style.fontSizeMedium1x, style.fontWeightBold]}>{TEXTS.backToRoles}</Text>
        </Pressable>
      </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  stage: { overflow: 'hidden' },
  text: { paddingHorizontal: wp(8), marginBottom: hp(3) },
  title: { color: gameAccentColor },
  line: { color: roleTitleOnSky, marginTop: hp(1.5) },
  score: { color: roleTitleOnSky, opacity: 0.85, marginTop: hp(2) },
  button: {
    marginHorizontal: wp(7),
    marginBottom: hp(3),
    paddingVertical: spacings.xLarge,
    borderRadius: wp(4),
    backgroundColor: gameAccentColor,
    borderBottomWidth: 3,
    borderBottomColor: gameTileEdgeColor,
  },
  buttonText: { color: gameOnAccentColor },
});

export default CompletionModal;
