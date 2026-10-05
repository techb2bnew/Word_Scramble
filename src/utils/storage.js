import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage can fail (full disk, restricted device). Callers only need a yes/no
// or a best effort save, so failures are swallowed rather than crashing a launch.
export const getFlag = async (key) => {
  try {
    return (await AsyncStorage.getItem(key)) === 'true';
  } catch {
    return false;
  }
};

export const setFlag = async (key) => {
  try {
    await AsyncStorage.setItem(key, 'true');
  } catch {
    // Nothing to do: the worst case is the player sees onboarding once more.
  }
};

export const getNumber = async (key) => {
  try {
    const value = Number(await AsyncStorage.getItem(key));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
};

export const setNumber = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, String(value));
  } catch {
    // Nothing to do: the best score is just not kept this time.
  }
};
