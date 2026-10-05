import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SCREENS, STORAGE_KEYS } from '../constant/Constants';
import { getFlag, setFlag } from '../utils/storage';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import WordMatchScreen from '../screens/WordMatchScreen';

// Three screens in a fixed order, so plain state is enough — no navigation
// library to install or link. Onboarding is shown on the first launch only:
// finishing or skipping it is remembered on the device.
const AppNavigator = () => {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  // Read while the splash is playing, so the answer is ready when it ends.
  const seenOnboarding = useRef(Promise.resolve(false));

  useEffect(() => {
    seenOnboarding.current = getFlag(STORAGE_KEYS.ONBOARDING_SEEN);
  }, []);

  const afterSplash = useCallback(async () => {
    const seen = await seenOnboarding.current;
    setScreen(seen ? SCREENS.GAME : SCREENS.ONBOARDING);
  }, []);

  const afterOnboarding = useCallback(() => {
    setFlag(STORAGE_KEYS.ONBOARDING_SEEN);
    setScreen(SCREENS.GAME);
  }, []);

  if (screen === SCREENS.SPLASH) return <SplashScreen onDone={afterSplash} />;
  if (screen === SCREENS.ONBOARDING) return <OnboardingScreen onDone={afterOnboarding} />;
  return <WordMatchScreen />;
};

export default AppNavigator;
