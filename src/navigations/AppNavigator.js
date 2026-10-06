import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SCREENS, STORAGE_KEYS } from '../constant/Constants';
import { ROLES } from '../constant/Levels';
import { getFlag, setFlag, getNumber, setNumber } from '../utils/storage';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import RoleScreen from '../screens/RoleScreen';
import WordMatchScreen from '../screens/WordMatchScreen';

// A few screens in a fixed order, so plain state is enough — no navigation
// library to install or link. Onboarding is shown on the first launch only:
// finishing or skipping it is remembered on the device. After it the player
// picks a role, then plays that role's levels.
const AppNavigator = () => {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const [roleId, setRoleId] = useState(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [startScore, setStartScore] = useState(0);
  // Read while the splash is playing, so the answer is ready when it ends.
  const seenOnboarding = useRef(Promise.resolve(false));

  useEffect(() => {
    seenOnboarding.current = getFlag(STORAGE_KEYS.ONBOARDING_SEEN);
  }, []);

  const afterSplash = useCallback(async () => {
    const seen = await seenOnboarding.current;
    setScreen(seen ? SCREENS.ROLE : SCREENS.ONBOARDING);
  }, []);

  const afterOnboarding = useCallback(() => {
    setFlag(STORAGE_KEYS.ONBOARDING_SEEN);
    setScreen(SCREENS.ROLE);
  }, []);

  const startRole = useCallback((id, level) => {
    setRoleId(id);
    setLevelIndex(level);
    setStartScore(0);
    setScreen(SCREENS.GAME);
  }, []);

  // Remember how many levels of this role are cleared; never lower it.
  const saveProgress = useCallback(
    async (cleared) => {
      const key = `${STORAGE_KEYS.PROGRESS_PREFIX}${roleId}`;
      if (cleared > (await getNumber(key))) setNumber(key, cleared);
    },
    [roleId],
  );

  if (screen === SCREENS.SPLASH) return <SplashScreen onDone={afterSplash} />;
  if (screen === SCREENS.ONBOARDING) return <OnboardingScreen onDone={afterOnboarding} />;
  if (screen === SCREENS.ROLE) return <RoleScreen onSelect={startRole} />;
  return (
    <WordMatchScreen
      // A new key starts a clean level: the grid, the found words and the help.
      key={`${roleId}-${levelIndex}`}
      role={ROLES[roleId]}
      levelIndex={levelIndex}
      startScore={startScore}
      onLevelComplete={(index) => saveProgress(index + 1)}
      onNextLevel={(score) => {
        setStartScore(score);
        setLevelIndex((i) => i + 1);
      }}
      onExit={() => setScreen(SCREENS.ROLE)}
    />
  );
};

export default AppNavigator;
