import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameAccentColor,
  gameRoleDispatcherColor,
  gameRoleBrokerColor,
  gameOnAccentColor,
  gameTileEdgeColor,
  shadowColor,
  roleCardBg,
  roleCardText,
  roleCardMuted,
  rolePipEmpty,
  roleTitleOnSky,
} from '../constant/Color';
import {
  STORAGE_KEYS,
  TEXTS,
  PRIVACY_POLICY_URL,
  SPLASH_LOGO_LETTERS,
  ROLE_ENTER_DURATION,
  ROLE_ENTER_STAGGER,
} from '../constant/Constants';
import { ROLE_LIST, ROLE_IDS, LEVELS_PER_ROLE } from '../constant/Levels';
import { getNumber } from '../utils/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import SkyBackdrop from '../components/SkyBackdrop';

const ROLE_COLORS = {
  [ROLE_IDS.DISPATCHER]: gameRoleDispatcherColor,
  [ROLE_IDS.BROKER]: gameRoleBrokerColor,
};

// One role: a big round icon in the role's colour, its name and what it covers,
// six numbered pips for its six levels, and where the player is. It rises in when
// the screen opens and gives a little under the finger.
const RoleCard = ({ role, done, index, onPress }) => {
  const color = ROLE_COLORS[role.id];
  const finished = done >= LEVELS_PER_ROLE;
  const enter = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: ROLE_ENTER_DURATION,
      delay: index * ROLE_ENTER_STAGGER,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const squeeze = (toValue) =>
    Animated.spring(press, { toValue, friction: 6, useNativeDriver: true }).start();

  const action = finished ? TEXTS.rolePlayAgain : done > 0 ? TEXTS.roleContinue : TEXTS.roleStart;

  return (
    <Animated.View
      style={{
        opacity: enter,
        transform: [
          { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [hp(5), 0] }) },
          { scale: press },
        ],
      }}
    >
      <Pressable
        style={[styles.card, { borderColor: color }]}
        onPress={onPress}
        onPressIn={() => squeeze(0.97)}
        onPressOut={() => squeeze(1)}
      >
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
          <View style={[styles.iconCircle, BaseStyle.alignJustifyCenter, { backgroundColor: color }]}>
            <Text style={styles.icon}>{role.icon}</Text>
          </View>
          <View style={[BaseStyle.flex, styles.info]}>
            <Text numberOfLines={1} style={[styles.name, style.fontSizeLargeX, style.fontWeightBold]}>{role.name}</Text>
            <Text numberOfLines={1} style={[styles.tagline, style.fontSizeNormal]}>{role.tagline}</Text>
          </View>
        </View>

        <View style={[BaseStyle.flexDirectionRow, styles.segments]}>
          {Array.from({ length: LEVELS_PER_ROLE }, (_, i) => {
            const cleared = i < done;
            const current = i === done && !finished;
            return (
              <View
                key={i}
                style={[
                  styles.pip,
                  BaseStyle.alignJustifyCenter,
                  cleared && { backgroundColor: color },
                  current && styles.pipCurrent,
                  current && { borderColor: color },
                ]}
              >
                <Text
                  style={[
                    styles.pipText,
                    style.fontSizeExtraSmall,
                    style.fontWeightBlack,
                    cleared && styles.pipTextOn,
                    current && { color },
                  ]}
                >
                  {i + 1}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentSpaceBetween]}>
          <Text style={[styles.progress, style.fontSizeSmall2x, style.fontWeightMedium1x]}>
            {finished
              ? `${TEXTS.allDone} ${TEXTS.tick}`
              : `${TEXTS.levelWord} ${done + 1} ${TEXTS.levelOf} ${LEVELS_PER_ROLE}`}
          </Text>
          <View style={[styles.action, { backgroundColor: color, borderBottomColor: gameTileEdgeColor }]}>
            <Text style={[styles.actionText, style.fontSizeSmall1x, style.fontWeightBlack]}>{action}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Who the player is. Each role has its own levels and its own progress, so each
// card says how far that role has got. Tapping one continues from there; a role
// that has been cleared starts over from its first level.
const RoleScreen = ({ onSelect }) => {
  const [cleared, setCleared] = useState({}); // role id -> levels cleared

  useEffect(() => {
    ROLE_LIST.forEach((role) => {
      getNumber(`${STORAGE_KEYS.PROGRESS_PREFIX}${role.id}`).then((n) =>
        setCleared((c) => ({ ...c, [role.id]: Math.min(n, LEVELS_PER_ROLE) })),
      );
    });
  }, []);

  return (
    <View style={BaseStyle.flex}>
      <SkyBackdrop variant="role" />
      <SafeAreaView style={BaseStyle.flex}>
        <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, BaseStyle.justifyContentCenter, styles.brand]}>
          {SPLASH_LOGO_LETTERS.map((letter) => (
            <View key={letter} style={[styles.logoTile, BaseStyle.alignJustifyCenter]}>
              <Text style={[styles.logoLetter, style.fontSizeNormal2x, style.fontWeightBlack]}>{letter}</Text>
            </View>
          ))}
          <Text style={[styles.brandSub, style.fontSizeNormal2x, style.fontWeightBold]}>{TEXTS.splashSub}</Text>
        </View>

        <Text style={[styles.title, style.fontSizeLarge3x, style.fontWeightBlack, BaseStyle.textAlign]}>
          {TEXTS.chooseRole}
        </Text>
        <Text style={[styles.sub, style.fontSizeNormal2x, BaseStyle.textAlign]}>{TEXTS.chooseRoleSub}</Text>

        <View style={[BaseStyle.flex, BaseStyle.justifyContentFlexStart, styles.cards]}>
          {ROLE_LIST.map((role, index) => (
            <RoleCard
              key={role.id}
              role={role}
              index={index}
              done={cleared[role.id] || 0}
              onPress={() => {
                const done = cleared[role.id] || 0;
                onSelect(role.id, done >= LEVELS_PER_ROLE ? 0 : done);
              }}
            />
          ))}
        </View>

        <Text style={[styles.footer, style.fontSizeSmall1x, BaseStyle.textAlign]}>{TEXTS.roleFooter}</Text>
        <Pressable
          style={styles.privacy}
          hitSlop={wp(3)}
          // With no browser or no connection the tap does nothing, which is fine.
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL).catch(() => {})}
        >
          <Text style={[styles.privacyText, style.fontSizeSmall2x, style.fontWeightMedium1x, BaseStyle.textAlign]}>
            {TEXTS.privacyPolicy}
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  brand: { marginTop: hp(2) },
  logoTile: {
    width: wp(8),
    height: wp(8),
    margin: spacings.xsmall,
    borderRadius: wp(2),
    backgroundColor: gameAccentColor,
    borderBottomWidth: 2,
    borderBottomColor: gameTileEdgeColor,
  },
  logoLetter: { color: gameOnAccentColor },
  brandSub: { color: roleTitleOnSky, marginLeft: spacings.large, letterSpacing: wp(1) },
  title: {
    color: roleTitleOnSky,
    marginTop: hp(3),
    textShadowColor: 'rgba(12, 28, 64, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  sub: { color: roleTitleOnSky, opacity: 0.9, marginTop: hp(1), marginHorizontal: wp(6) },
  cards: { marginTop: hp(3.5) },
  card: {
    marginHorizontal: wp(6),
    marginBottom: hp(2.2),
    paddingVertical: hp(2.6),
    paddingHorizontal: wp(5),
    borderRadius: wp(7),
    borderWidth: 2,
    backgroundColor: roleCardBg,
    shadowColor,
    shadowOpacity: 0.22,
    shadowRadius: wp(4),
    shadowOffset: { width: 0, height: wp(2) },
    elevation: 8,
  },
  iconCircle: { width: wp(18), height: wp(18), borderRadius: wp(9) },
  icon: { fontSize: wp(9.5) },
  info: { marginLeft: wp(4) },
  name: { color: roleCardText },
  tagline: { color: roleCardMuted, marginTop: spacings.small },
  segments: { marginTop: hp(2.2), marginBottom: hp(1.6) },
  pip: {
    flex: 1,
    height: wp(8),
    marginHorizontal: spacings.xsmall,
    borderRadius: wp(2.2),
    backgroundColor: rolePipEmpty,
  },
  pipCurrent: { borderWidth: 2, backgroundColor: roleCardBg },
  pipText: { color: roleCardMuted },
  pipTextOn: { color: gameOnAccentColor },
  progress: { color: roleCardMuted },
  action: {
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.xxxLarge,
    borderRadius: wp(4),
    borderBottomWidth: 2,
  },
  actionText: { color: gameOnAccentColor },
  // Dark, not white: the bottom of the sky is pale, and white text vanished on it.
  footer: { color: roleCardMuted, marginBottom: hp(1), marginHorizontal: wp(10) },
  privacy: { alignSelf: 'center', marginBottom: hp(2.5), paddingVertical: spacings.small },
  privacyText: { color: roleCardText, textDecorationLine: 'underline' },
});

export default RoleScreen;
