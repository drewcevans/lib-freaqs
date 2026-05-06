// Google Sheets config — update Sheet IDs per year
// Publish: File → Share → Publish to web → CSV
// URL format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={TAB_NAME}

const SHEET_BASE = (sheetId, tab) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;

export const YEARS = ['2025', '2026'];
export const DEFAULT_YEAR = '2026';

const SHEET_IDS = {
  '2025': '1uPT_40uRgSe6a82E-SK3nCfkLT5eDpuL_W18xUGH9Sg',
  '2026': '1uPT_40uRgSe6a82E-SK3nCfkLT5eDpuL_W18xUGH9Sg',
};

export const getSheetUrl = (year, tab) => {
  const id = SHEET_IDS[year];
  if (!id || id.includes('YOUR_')) return null;
  return SHEET_BASE(id, tab);
};

export const SHEET_TABS = {
  freaqs:      'Freaqs 💃🕺',
  whatToBring: 'What To Bring 🧳',
  foodAndDrank:'Food & Drank 🍺',
  builders:    'Builders 🎨',
  campMap:     'Camp Map 🗺️',
  setList:     'Set List ⚡',
  shh:         'Shhh 👀',
};
