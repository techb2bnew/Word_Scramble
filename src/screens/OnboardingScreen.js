// import React, { useRef, useState } from 'react';
// import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { BaseStyle } from '../constant/Style';
// import { style, spacings } from '../constant/Fonts';
// import {
//   gameBgColor,
//   gameAccentColor,
//   gameTextColor,
//   gameDotInactiveColor,
// } from '../constant/Color';
// import { ONBOARDING_SLIDES, TEXTS } from '../constant/Constants';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';

// const OnboardingScreen = ({ onDone }) => {
//   const [index, setIndex] = useState(0);
//   const listRef = useRef(null);
//   const isLast = index === ONBOARDING_SLIDES.length - 1;

//   const next = () => {
//     if (isLast) {
//       onDone();
//       return;
//     }
//     listRef.current?.scrollToIndex({ index: index + 1 });
//     setIndex(index + 1);
//   };

//   return (
//     <SafeAreaView style={[BaseStyle.flex, styles.container]}>
//       <Pressable style={[BaseStyle.alignSelfEnd, styles.skip]} onPress={onDone}>
//         <Text style={[styles.skipText, style.fontSizeNormal2x]}>{TEXTS.skip}</Text>
//       </Pressable>

//       <FlatList
//         ref={listRef}
//         data={ONBOARDING_SLIDES}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id}
//         onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / wp(100)))}
//         renderItem={({ item }) => (
//           <View style={[styles.slide, BaseStyle.alignJustifyCenter]}>
//             <Text style={styles.emoji}>{item.emoji}</Text>
//             <Text style={[styles.title, style.fontSizeLarge2x, style.fontWeightBold, BaseStyle.textAlign]}>
//               {item.title}
//             </Text>
//             <Text style={[styles.text, style.fontSizeMedium, BaseStyle.textAlign]}>{item.text}</Text>
//           </View>
//         )}
//       />

//       <View style={[BaseStyle.flexDirectionRow, BaseStyle.justifyContentCenter, styles.dots]}>
//         {ONBOARDING_SLIDES.map((slide, i) => (
//           <View key={slide.id} style={[styles.dot, i === index && styles.dotActive]} />
//         ))}
//       </View>

//       <Pressable style={[styles.button, BaseStyle.alignItemsCenter]} onPress={next}>
//         <Text style={[styles.buttonText, style.fontSizeMedium1x, style.fontWeightBold]}>
//           {isLast ? TEXTS.startPlaying : TEXTS.next}
//         </Text>
//       </Pressable>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { backgroundColor: gameBgColor },
//   skip: { padding: spacings.xxxxLarge },
//   skipText: { color: gameTextColor, opacity: 0.8 },
//   slide: { width: wp(100), paddingHorizontal: wp(9) },
//   emoji: { fontSize: wp(24), marginBottom: hp(3) },
//   title: { color: gameAccentColor },
//   text: { color: gameTextColor, marginTop: hp(1.5), lineHeight: wp(6.5) },
//   dots: { marginVertical: hp(2.5) },
//   dot: {
//     width: wp(2),
//     height: wp(2),
//     borderRadius: wp(1),
//     marginHorizontal: spacings.normal,
//     backgroundColor: gameDotInactiveColor,
//   },
//   dotActive: { width: wp(6), backgroundColor: gameAccentColor },
//   button: {
//     marginHorizontal: wp(7),
//     marginBottom: hp(3),
//     paddingVertical: spacings.xLarge,
//     borderRadius: wp(4),
//     backgroundColor: gameAccentColor,
//   },
//   buttonText: { color: gameBgColor },
// });

// export default OnboardingScreen;


// -----------------------------------------------------------------------------
// New onboarding: each slide has a small live demo of the real game above its
// text. The version above is kept, commented out, for reference.
// -----------------------------------------------------------------------------
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameAccentColor,
  gameWinColor,
  gameLoseColor,
  gameOnAccentColor,
  gameTileEdgeColor,
  gameRoleDispatcherColor,
  gameRoleBrokerColor,
  roleCardBg,
  roleCardText,
  roleTitleOnSky,
} from '../constant/Color';
import {
  ONBOARDING_SLIDES,
  TEXTS,
  DEMO_WORD,
  DEMO_WRONG,
  DEMO_WORDS,
  DEMO_RACK_LENGTH,
  DEMO_STEP_DURATION,
  DEMO_HELP_DURATION,
  HELP_LIMIT,
} from '../constant/Constants';
import { wordReach } from '../utils/gameUtils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { ROLE_LIST, ROLE_IDS } from '../constant/Levels';
import HiddenCard from '../components/HiddenCard';
import HelpButton from '../components/HelpButton';
import AnswerSlot from '../components/AnswerSlot';
import SkyBackdrop from '../components/SkyBackdrop';

// Slide 1: the two roles to pick from, each in its own colour.
const ROLE_DEMO_COLORS = {
  [ROLE_IDS.DISPATCHER]: gameRoleDispatcherColor,
  [ROLE_IDS.BROKER]: gameRoleBrokerColor,
};

const RoleDemo = () => (
  <View style={BaseStyle.alignItemsCenter}>
    {ROLE_LIST.map((role) => (
      <View
        key={role.id}
        style={[styles.roleChip, BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, { borderColor: ROLE_DEMO_COLORS[role.id] }]}
      >
        <View style={[styles.roleIcon, BaseStyle.alignJustifyCenter, { backgroundColor: ROLE_DEMO_COLORS[role.id] }]}>
          <Text style={styles.roleEmoji}>{role.icon}</Text>
        </View>
        <Text style={[styles.roleName, style.fontSizeMedium1x, style.fontWeightBold]}>{role.name}</Text>
      </View>
    ))}
  </View>
);

// Slide 2: a few covered boxes, glinting. Their letters are never shown.
const CoverDemo = () => (
  <View style={[BaseStyle.flexDirectionRow, BaseStyle.flexWrap, BaseStyle.justifyContentCenter, styles.coverGrid]}>
    {Array.from({ length: 6 }, (_, i) => (
      <HiddenCard key={i} letter="" width={wp(20)} height={wp(22)} colorIndex={i} open={false} disabled />
    ))}
  </View>
);

// Slide 2: boxes turn over one after another and each letter drops into the
// row below, the way it does in the game. The slots a word can still reach glow
// and the rest fade. When the word is whole it starts over.
const FlipDemo = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCount((c) => (c >= DEMO_WORD.length ? 0 : c + 1)),
      DEMO_STEP_DURATION,
    );
    return () => clearInterval(timer);
  }, []);

  const reach = count > 0 ? wordReach(DEMO_WORD.slice(0, count), DEMO_WORDS) : null;

  return (
    <View style={BaseStyle.alignItemsCenter}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.justifyContentCenter]}>
        {[...DEMO_WORD].map((letter, i) => (
          <HiddenCard
            key={i}
            letter={letter}
            width={wp(18)}
            height={wp(20)}
            colorIndex={i}
            open={i < count}
            disabled
          />
        ))}
      </View>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.justifyContentCenter, styles.demoSlots]}>
        {Array.from({ length: DEMO_RACK_LENGTH }, (_, i) => (
          <AnswerSlot
            key={i}
            letter={i < count ? DEMO_WORD[i] : ''}
            status={null}
            highlight={reach !== null && i >= count && i < reach}
            faded={reach !== null && i >= count && i >= reach}
          />
        ))}
      </View>
    </View>
  );
};

// Slide 3: a word spelled right stays open and green; a start no word has marks
// the last letter red, and that box closes again.
const ResultDemo = () => (
  <View style={BaseStyle.alignItemsCenter}>
    <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
      {[...DEMO_WORD].map((letter, i) => (
        <HiddenCard key={i} letter={letter} width={wp(14)} height={wp(16)} colorIndex={i} open found disabled />
      ))}
      <Text style={[styles.verdict, { color: gameWinColor }, style.fontSizeLarge2x, style.fontWeightBlack]}>
        {TEXTS.tick}
      </Text>
    </View>
    <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter, styles.wrongRow]}>
      {[...DEMO_WRONG].map((letter, i) => (
        <AnswerSlot key={i} letter={letter} status={i === DEMO_WRONG.length - 1 ? 'lose' : null} />
      ))}
      <Text style={[styles.verdict, { color: gameLoseColor }, style.fontSizeLarge2x, style.fontWeightBlack]}>
        {TEXTS.cross}
      </Text>
    </View>
  </View>
);

// Slide 5: the Help button is pressed, rings appear round two boxes and one use
// is spent; then it lets go and starts over.
const HELP_DEMO_RINGED = [1, 4];

const HelpDemo = () => {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setPressed((p) => !p), DEMO_HELP_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={BaseStyle.alignItemsCenter}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.flexWrap, BaseStyle.justifyContentCenter, styles.helpGrid]}>
        {Array.from({ length: 6 }, (_, i) => (
          <HiddenCard
            key={i}
            letter=""
            width={wp(18)}
            height={wp(14)}
            colorIndex={i}
            open={false}
            hint={pressed && HELP_DEMO_RINGED.includes(i)}
            disabled
          />
        ))}
      </View>
      <View style={styles.helpButton}>
        <HelpButton left={pressed ? HELP_LIMIT - 1 : HELP_LIMIT} onPress={() => {}} />
      </View>
    </View>
  );
};

const DEMOS = { 1: RoleDemo, 2: CoverDemo, 3: FlipDemo, 4: ResultDemo, 5: HelpDemo };

const OnboardingScreen = ({ onDone }) => {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const isLast = index === ONBOARDING_SLIDES.length - 1;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  const next = () => {
    if (isLast) {
      onDone();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1 });
    setIndex(index + 1);
  };

  return (
    <View style={BaseStyle.flex}>
      <SkyBackdrop variant="onboard" />
      <SafeAreaView style={BaseStyle.flex}>
      <Pressable style={[BaseStyle.alignSelfEnd, styles.skip]} onPress={onDone}>
        <Text style={[styles.skipText, style.fontSizeNormal2x]}>{TEXTS.skip}</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / wp(100)))}
        renderItem={({ item }) => {
          const Demo = DEMOS[item.id];
          return (
            <View style={[styles.slide, BaseStyle.alignJustifyCenter]}>
              <Animated.View
                style={[
                  styles.demo,
                  {
                    transform: [
                      {
                        translateY: float.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -hp(1.2)],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Demo />
              </Animated.View>
              <Text style={[styles.title, style.fontSizeLarge2x, style.fontWeightBold, BaseStyle.textAlign]}>
                {item.title}
              </Text>
              <Text style={[styles.text, style.fontSizeMedium, BaseStyle.textAlign]}>{item.text}</Text>
            </View>
          );
        }}
      />

      <View style={[BaseStyle.flexDirectionRow, BaseStyle.justifyContentCenter, styles.dots]}>
        {ONBOARDING_SLIDES.map((slide, i) => (
          <View key={slide.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <Pressable style={[styles.button, BaseStyle.alignItemsCenter]} onPress={next}>
        <Text style={[styles.buttonText, style.fontSizeMedium1x, style.fontWeightBold]}>
          {isLast ? TEXTS.startPlaying : TEXTS.next}
        </Text>
      </Pressable>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  skip: { padding: spacings.xxxxLarge },
  skipText: { color: roleTitleOnSky },
  slide: { width: wp(100), paddingHorizontal: wp(9) },
  // Negative margin cancels the slide's side padding, so a wide demo row has the
  // full screen to sit in.
  demo: {
    height: hp(24),
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -wp(9),
    marginBottom: hp(3),
  },
  coverGrid: { width: wp(70) },
  roleChip: {
    width: wp(72),
    marginVertical: hp(0.8),
    padding: wp(3),
    borderRadius: wp(5),
    borderWidth: 1.5,
    backgroundColor: roleCardBg,
  },
  roleIcon: { width: wp(13), height: wp(13), borderRadius: wp(6.5) },
  roleEmoji: { fontSize: wp(7) },
  roleName: { color: roleCardText, marginLeft: wp(3) },
  helpGrid: { width: wp(66) },
  helpButton: { marginTop: hp(2) },
  demoSlots: { marginTop: hp(2) },
  wrongRow: { marginTop: hp(2) },
  verdict: { marginLeft: spacings.xLarge },
  title: { color: gameAccentColor },
  text: { color: roleTitleOnSky, marginTop: hp(1.5), lineHeight: wp(6.5) },
  dots: { marginVertical: hp(2.5) },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    marginHorizontal: spacings.normal,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: { width: wp(6), backgroundColor: gameAccentColor },
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

export default OnboardingScreen;
