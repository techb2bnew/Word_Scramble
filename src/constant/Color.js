export const darkgrayColor = "#252837";
export const whiteColor = "#fff";
export const blackColor = "black";
export const grayColor = "#96989aff";
export const primaryRedColor = "#E94545";
export const redColor = "#E94545";
export const inputBgColor = "#F2F2F7";
export const tabBgColor = "#F3F4F6";
export const borderLightColor = "#E5E5EA";
export const purpleColor = "#9B51E0";
export const screenBgColor = "#F0F2F5";
export const goldColor = "#FFA928";
export const lightGrayColor = "#D1D4D6";
export const lightGreenColor = "#42f5a4";
export const lightGrayOpacityColor = "#e8e8e0";
export const brightTurquoiseColor = "#34ebc0";
export const blackOpacity5 = 'rgba(0,0,0,0.5)';
export const lightShadeBlue = "#bbc1d6";
export const verylightGrayColor = "#E6E6E6";
export const mediumGray = "#808080";
export const lightPink = "#FFEBEB";
export const blackOpacity7 = 'rgba(0,0,0,0.7)';
export const greenColor = "#3B8000";

export const splashBgColor = '#0B1020';
export const authCardBg = '#151B2E';
export const authInputBg = '#1C243A';
export const authBorderColor = 'rgba(245,193,90,0.18)';
export const authMutedColor = '#9AA3B8';
export const authLinkColor = '#5B9BD5';
export const authTabBg = '#1E2130';
export const authSocialBg = '#1E2130';
export const authStatCardBg = 'rgba(255,255,255,0.05)';



export const orangeColor = '#FF5733';
export const lightOrangeColor = '#EF502E';
export const ExtraExtralightOrangeColor = '#FFF4F1';
export const blueColor = '#3B6981';
export const lightBlueColor ='#3b698143';

// ---------------------------------------------------------------------------
// Driver app — light theme
// ---------------------------------------------------------------------------
// A cab in daylight is the hardest place to read a screen, so the app is light
// with strong contrast and one accent. The dark auth tokens above are left
// alone: they belong to another flow and removing them would break it.
//
// The accent is the red already in this file. Everything else is a neutral
// with a faint warm tint so it reads as chosen rather than as default grey.

// Grounds. `appBg` is the page, `cardBg` the raised surface on top of it.
export const appBg = '#F7F8FA';
export const cardBg = '#FFFFFF';
export const cardBgSoft = '#F2F4F7';

// Lines. `borderColor` for dividers, `borderStrong` for input outlines that
// have to be findable in sunlight.
export const borderColor = '#E7E9EE';
/*
 * The unfilled part of a progress ring.
 *
 * Darker than borderColor on purpose. At border grey on a white card the used
 * portion was almost invisible, so a ring read as a black arc floating in
 * space rather than as a proportion of something — which is the one thing a
 * ring is for.
 */
export const ringTrack = '#D5DAE3';
export const borderStrong = '#D3D7DF';

// Text. Four steps is enough; a fifth one is always too close to its neighbour.
export const textDark = '#141924';
export const textBody = '#3C4453';
export const textMuted = '#6B7383';
export const textFaint = '#9AA1AE';

// The accent, and the two tints it needs to sit on.
export const accentColor = '#E94545';
export const accentPressed = '#C93636';
export const accentSoft = '#FDECEC';
export const accentLine = '#F7C9C9';

// On a filled accent button. Near-white rather than pure, which stops the red
// vibrating against it.
export const onAccent = '#FFF7F7';

// Duty statuses. These are the four bands on the log graph and the four big
// buttons, so they have to be told apart at a glance and while moving.
export const dutyOffColor = '#8A93A3';
export const dutySleeperColor = '#5B6BC9';
export const dutyDrivingColor = '#1F9254';
export const dutyOnDutyColor = '#D98324';

// State, kept separate from the accent — "danger" must never read as "the
// button you press".
export const okColor = '#158A4E';
export const okSoft = '#E7F5EE';
export const warnColor = '#9A6410';
export const warnSoft = '#FCF2E2';
export const dangerColor = '#C0342C';
export const dangerSoft = '#FCEAE8';

// A control that is not pressable yet. Reads as "not yet", not as broken.
export const disabledBg = '#E9EBF0';
export const disabledText = '#A8AEBA';

// Onboarding progress.
export const dotActiveColor = '#E94545';
export const dotInactiveColor = '#D9DDE5';

// Shadow, used through elevation on Android and shadowColor on iOS.
export const shadowColor = '#0B1220';

// Placeholder inside an input. Muted is too dark next to typed text.
export const placeholderColor = '#A2A9B6';

// A focused field lifts off the card; an errored one takes the faintest wash
// of the danger colour. Both were inline hex in CustomTextInput.
export const inputFocusBg = '#FFFFFF';
export const inputErrorBg = '#FFF7F6';

// ---------------------------------------------------------------------------
// Translucent washes
// ---------------------------------------------------------------------------
// Alpha values, so they sit over whatever is behind them. They were written
// inline as rgba() in six files, which is the one thing the house style bans:
// a theme change had six places to find and nobody would find all six.
export const brandWashFaint = 'rgba(233,69,69,0.08)';
export const brandWashSoft = 'rgba(233,69,69,0.10)';
export const brandWashMid = 'rgba(233,69,69,0.14)';
export const brandWashStrong = 'rgba(233,69,69,0.18)';
export const brandWashDeep = 'rgba(233,69,69,0.28)';

/** On a dark ground: a splash panel, a pressed tile. */
export const lightWash = 'rgba(255,255,255,0.12)';
/** The wash over a selected duty tile, which already carries its own colour. */
export const selectedWash = 'rgba(255,255,255,0.2)';
export const splashText = 'rgba(255,247,247,0.62)';
/** Behind a modal. Cool rather than black, so the card below reads as lifted. */
export const scrim = 'rgba(15,20,30,0.45)';

// ---------------------------------------------------------------------------
// Word game
// ---------------------------------------------------------------------------
// Midnight ink ground, warm gold tiles. Change these three together to re-colour
// the whole game: the accent, the darker lower edge of a tile, and a faint frame
// on a covered box. Text on the accent is dark ink, so keep the accent bright.
const ACCENT = '#F5C15A';
const ACCENT_EDGE = '#C9922E';
const ACCENT_FRAME = 'rgba(245,193,90,0.38)';

export const gameBgColor = '#0B1020';
export const gameCardColor = '#151B2E';
export const gameSlotBgColor = '#1C243A';
export const gameTileBgColor = '#FFE7A8';
export const gameTileTextColor = '#1C1408';
export const gameOnAccentColor = '#1C1408';
export const gameSlotFilledTextColor = '#1C1408';
export const gameAccentColor = ACCENT;
export const gameAccentSoft = 'rgba(245,193,90,0.14)';
export const gameTextColor = '#F6F0E4';
export const gameMutedTextColor = '#9AA3B8';
export const gameWinColor = '#2BD48A';
export const gameLoseColor = '#FF5C6A';
export const gameDotInactiveColor = 'rgba(246,240,228,0.14)';
export const gameScrimColor = 'rgba(6,8,16,0.72)';

// Play field. A slightly lifted panel so the grid sits in a well, not on the page.
export const gameArenaBgColor = 'rgba(245,193,90,0.05)';
export const gameArenaBorderColor = ACCENT_FRAME;
export const gameBadgeBgColor = '#1C243A';
export const gameBubbleColors = [
  '#FFE7A8',
  '#F5C15A',
  '#FFD27A',
  '#F8E2B0',
  '#E8C56A',
  '#FFC978',
];

// Answer rack: a recessed bar holding tiles. A tile is a face colour plus a
// darker lower edge, which reads as depth.
export const gameRackBgColor = 'rgba(255,255,255,0.22)';
export const gameRackSlotColor = 'rgba(26, 74, 156, 0.28)';
export const gameTileFaceColor = ACCENT;
export const gameTileEdgeColor = ACCENT_EDGE;
export const gameWinEdgeColor = '#1A9A5E';
export const gameLoseEdgeColor = '#C73A48';
export const gameProgressTrackColor = 'rgba(246,240,228,0.12)';

// The back of a covered box. Sky blue with gold trim, so a closed card sits in
// the sky instead of reading as a dark hole.
export const gameCoverColor = '#5BA3F5';
export const gameCoverFrameColor = 'rgba(255,255,255,0.55)';
export const gameShimmerColor = 'rgba(255,255,255,0.38)';

// One colour per role. Light enough for dark lettering on the action chip.
export const gameRoleDispatcherColor = '#5EEAD4';
export const gameRoleBrokerColor = '#FF9B7A';

// Sky bands. Each screen picks its own so the sky is not copied around.
export const roleSkyBands = ['#1A4A9C', '#2B63C4', '#3D7EE8', '#5A98F2', '#7BB2F8', '#A3CCFC', '#C8E2FF', '#E4F2FF'];
export const splashSkyBands = ['#1E4FA3', '#2F6FD4', '#4C8EEC', '#7BB0F6', '#B7D6FC', '#FFE08A', '#FFC45C', '#F5A928'];
export const onboardSkyBands = ['#1565C0', '#1E88E5', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD', '#FFF8E7'];
export const playSkyBands = ['#2474D6', '#3D8AE8', '#5AA0F2', '#78B6F8', '#9BCCFC', '#BDDDFF', '#D8ECFF', '#F0F7FF'];
export const shuffleSkyBands = ['#0E4D8C', '#1A6FB5', '#2B8FD4', '#4AA8E8', '#7BC4F5', '#A8DCFC', '#D0EEFF', '#EAF7FF'];
export const doneSkyBands = ['#1A2A6C', '#3B4CCA', '#6B6AE8', '#E07A5F', '#F2A65A', '#F5C15A', '#FFE08A', '#FFF3C4'];

export const roleSunColor = '#FFE08A';
export const roleSunGlowColor = 'rgba(255,224,138,0.35)';
export const splashSunColor = '#FFE566';
export const splashSunGlowColor = 'rgba(255,200,80,0.45)';
export const roleCloudColor = 'rgba(255,255,255,0.78)';
export const roleStarColor = 'rgba(255,255,255,0.7)';
export const roleCardBg = '#FFFBF3';
export const roleCardText = '#1C1408';
export const roleCardMuted = '#5C6578';
export const rolePipEmpty = '#E7E2D4';
export const roleTitleOnSky = '#FFFFFF';
export const skyGlass = 'rgba(255,255,255,0.18)';
export const skyGlassBorder = 'rgba(255,255,255,0.42)';
