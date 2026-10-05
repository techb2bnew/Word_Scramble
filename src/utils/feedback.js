import { Image, Platform, Vibration } from 'react-native';
import Sound from 'react-native-sound';
import { VIBRATE_TAP, VIBRATE_RIGHT, VIBRATE_WRONG } from '../constant/Constants';

// 'Ambient' follows the phone's silent switch and lets the player's own music
// keep playing, so the game never shouts over anything.
Sound.setCategory('Ambient', true);

// react-native-sound wants a path string, never a require() number.
//  - iOS: the sounds are copied into the app bundle by the Podfile, so they are
//    read from there. That also works with Metro off and in a release build.
//  - Android: resolveAssetSource gives the path — a Metro URL in development,
//    the bundled resource in a release build.
const pathFor = (file, asset) =>
  Platform.OS === 'ios'
    ? encodeURI(`file://${Sound.MAIN_BUNDLE}/${file}`)
    : Image.resolveAssetSource(asset).uri;

const load = (file, asset) => {
  try {
    // The empty string is the base path. react-native-sound 0.13 reads a
    // callback passed in its place as the base path and glues its source text
    // onto the file name, so the file is never found.
    const sound = new Sound(pathFor(file, asset), '', (error) => {
      // An unreadable file only means that one effect stays silent.
      if (error) {
        sound.failed = true;
        if (__DEV__) console.warn('Sound failed to load:', file, error.message);
      }
    });
    return sound;
  } catch {
    // Sound is a nice-to-have: if it cannot start, the game must still play.
    return null;
  }
};

// Loaded once at startup so the first tap is not late.
const sounds = {
  right: load('correct.wav', require('../assests/sounds/correct.wav')),
  wrong: load('wrong.wav', require('../assests/sounds/wrong.wav')),
};

// stop() rewinds, so a quick second tap restarts the effect instead of being
// swallowed by the one still playing.
const play = (sound) => {
  if (!sound || sound.failed) return;
  sound.stop(() =>
    sound.play((ok) => {
      if (!ok && __DEV__) console.warn('Sound stopped before it finished playing');
    }),
  );
};

// Picking a letter makes no sound; Android gets a faint tick.
export const playTap = () => {
  // iOS has one fixed 400 ms buzz, far too heavy to repeat on every letter.
  if (Platform.OS === 'android') Vibration.vibrate(VIBRATE_TAP);
};

export const playRight = () => {
  play(sounds.right);
  Vibration.vibrate(VIBRATE_RIGHT);
};

export const playWrong = () => {
  play(sounds.wrong);
  Vibration.vibrate(VIBRATE_WRONG);
};
