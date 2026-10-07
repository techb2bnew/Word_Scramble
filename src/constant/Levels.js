// The levels of each role. A level is a list of words to find; every word is
// capitals and digits only (A-Z, 0-9), no spaces or symbols, so the "#" in
// "MC#" and the space in "CAB CARD" are dropped.
//
// A word that is the start of another word in the SAME level (CO and COI) is
// allowed: spelling CO finds CO, and COI is found afterwards with its own boxes.

export const ROLE_IDS = {
  DISPATCHER: 'dispatcher',
  BROKER: 'broker',
};

export const ROLES = {
  [ROLE_IDS.DISPATCHER]: {
    id: ROLE_IDS.DISPATCHER,
    name: 'Truck Dispatcher',
    icon: '🚛',
    tagline: 'Time zones, states, paperwork',
    completionLine: 'Every state, time zone and term. You are a dispatch pro!',
    levels: [
      {
        title: 'Level 1',
        words: [
          'PST', 'CST', 'MST', 'EST', 'FTL', 'LTL', '3PL',
          'WA', 'OR', 'NV', 'CA', 'MI', 'IN', 'OH', 'GA',
        ],
      },
      {
        title: 'Level 2',
        words: [
          'FMCSA', 'MC', 'USDOT', 'W9', 'COI', 'CDL',
          'MT', 'ID', 'WY', 'FL', 'SC', 'UT', 'CO', 'AZ', 'NM',
        ],
      },
      {
        title: 'Level 3',
        words: [
          'CP', 'POD', 'BOL', 'FTL', 'LTL', 'TONU', 'ETA', 'ETD',
          'NC', 'ND', 'SD', 'NE', 'KS', 'OK', 'TX',
        ],
      },
      {
        title: 'Level 4',
        words: [
          'RC', 'FCFS', 'COSTCO', 'PO', 'ICCBAR', 'NCNS',
          'MN', 'IA', 'MO', 'AR', 'LA', 'WI', 'IL', 'KY', 'TN',
        ],
      },
      {
        title: 'Level 5',
        words: [
          'FAK', 'CATSCALE', 'VIN', 'FRE', 'ELD', 'HOS', 'CABCARD',
          'ME', 'NH', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD',
        ],
      },
      {
        title: 'Level 6',
        words: [
          'RPM', 'CPM', 'TC', 'DAT', 'FMCSA', 'BOL', 'BJS', 'POD', 'ELD', 'CDL',
          'FTL', 'LTL', 'TONU', 'HOS', 'FCFS', 'NCNS', 'VT', 'PA', 'NY',
        ],
      },
    ],
  },

  // Freight Broker, from the notebook's "Freight Game Level" pages. Levels 3 and 4
  // are only partly readable there (just LA and TX in Level 3), so the rest of
  // those two levels is filled with the states the other levels leave out, until
  // the real lists are added.
  [ROLE_IDS.BROKER]: {
    id: ROLE_IDS.BROKER,
    name: 'Freight Broker',
    icon: '📦',
    tagline: 'Loads, rates, compliance',
    completionLine: 'Every load, rate and term. You are a freight pro!',
    levels: [
      {
        title: 'Level 1',
        words: [
          'RGN', 'GVW', 'BOL', 'POD', 'RC', 'PO', 'LTL', 'FTL', 'HAZMAT', 'FSC',
          'TONU', 'ETD', 'ETA', 'MC', 'DOT', 'RPM', 'COI', 'ELD', 'HOS', 'W9',
        ],
      },
      {
        title: 'Level 2',
        words: [
          'CA', 'WA', 'OR', 'NV', 'MT', 'ID', 'WY', 'UT', 'CO', 'AZ', 'NM',
          'DAT', 'TWICCARD', 'DH',
        ],
      },
      {
        title: 'Level 3',
        words: ['LA', 'TX', 'ND', 'SD', 'NE', 'KS', 'OK', 'AR', 'MO', 'IA', 'MN', 'WI'],
      },
      {
        title: 'Level 4',
        words: ['IL', 'MS', 'AL', 'TN', 'PA', 'DE', 'CT', 'RI', 'MA', 'VT', 'NH'],
      },
      {
        title: 'Level 5',
        words: [
          'DETENTION', 'KY', 'FL', 'GA', 'SC', 'NC', 'VA', 'NJ', 'WV', 'OH', 'IN',
          'MI', 'NY', 'MD', 'ME', 'FCL', 'LCL',
        ],
      },
      {
        title: 'Level 6',
        words: [
          'FMCSA', 'FCFS', 'APPT', 'FTL', 'LTL', 'TONU', 'FCL', 'DOT', 'LCL', 'DAT',
          'MC', 'CDL', 'RPM', 'POD', 'ELD', 'BOL', 'HOS', 'FSC', 'NVOCC',
        ],
      },
    ],
  },
};

export const ROLE_LIST = [ROLES[ROLE_IDS.DISPATCHER], ROLES[ROLE_IDS.BROKER]];
export const LEVELS_PER_ROLE = 6;
