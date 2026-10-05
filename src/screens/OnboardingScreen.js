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
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyle } from '../constant/Style';
import { style, spacings } from '../constant/Fonts';
import {
  gameBgColor,
  gameAccentColor,
  gameTextColor,
  gameDotInactiveColor,
  gameWinColor,
  gameLoseColor,
} from '../constant/Color';
import {
  ONBOARDING_SLIDES,
  TEXTS,
  DEMO_WORD,
  DEMO_WRONG,
  DEMO_STEP_DURATION,
} from '../constant/Constants';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import HiddenCard from '../components/HiddenCard';
import AnswerSlot from '../components/AnswerSlot';

// Slide 1: a few covered boxes, glinting. Their letters are never shown.
const CoverDemo = () => (
  <View style={[BaseStyle.flexDirectionRow, BaseStyle.flexWrap, BaseStyle.justifyContentCenter, styles.coverGrid]}>
    {Array.from({ length: 6 }, (_, i) => (
      <HiddenCard key={i} letter="" width={wp(20)} height={wp(22)} colorIndex={i} open={false} disabled />
    ))}
  </View>
);

// Slide 2: boxes turn over one after another and each letter drops into the
// row below, the way it does in the game. When the word is whole it starts over.
const FlipDemo = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCount((c) => (c >= DEMO_WORD.length ? 0 : c + 1)),
      DEMO_STEP_DURATION,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={BaseStyle.alignItemsCenter}>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.justifyContentCenter]}>
        {[...DEMO_WORD].map((letter, i) => (
          <HiddenCard
            key={i}
            letter={letter}
            width={wp(12)}
            height={wp(14)}
            colorIndex={i}
            open={i < count}
            disabled
          />
        ))}
      </View>
      <View style={[BaseStyle.flexDirectionRow, BaseStyle.justifyContentCenter, styles.demoSlots]}>
        {[...DEMO_WORD].map((letter, i) => (
          <AnswerSlot key={i} letter={i < count ? letter : ''} status={null} />
        ))}
      </View>
    </View>
  );
};

// Slide 3: one word spelled right, one that goes wrong on its last letter.
const ResultDemo = () => (
  <View style={BaseStyle.alignItemsCenter}>
    <View style={[BaseStyle.flexDirectionRow, BaseStyle.alignItemsCenter]}>
      {[...DEMO_WORD].map((letter, i) => (
        <AnswerSlot key={i} letter={letter} status="win" />
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

const DEMOS = { 1: CoverDemo, 2: FlipDemo, 3: ResultDemo };

const OnboardingScreen = ({ onDone }) => {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      onDone();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1 });
    setIndex(index + 1);
  };

  return (
    <SafeAreaView style={[BaseStyle.flex, styles.container]}>
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
              <View style={styles.demo}>
                <Demo />
              </View>
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
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: gameBgColor },
  skip: { padding: spacings.xxxxLarge },
  skipText: { color: gameTextColor, opacity: 0.8 },
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
  demoSlots: { marginTop: hp(2) },
  wrongRow: { marginTop: hp(2) },
  verdict: { marginLeft: spacings.xLarge },
  title: { color: gameAccentColor },
  text: { color: gameTextColor, marginTop: hp(1.5), lineHeight: wp(6.5) },
  dots: { marginVertical: hp(2.5) },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    marginHorizontal: spacings.normal,
    backgroundColor: gameDotInactiveColor,
  },
  dotActive: { width: wp(6), backgroundColor: gameAccentColor },
  button: {
    marginHorizontal: wp(7),
    marginBottom: hp(3),
    paddingVertical: spacings.xLarge,
    borderRadius: wp(4),
    backgroundColor: gameAccentColor,
  },
  buttonText: { color: gameBgColor },
});

export default OnboardingScreen;
