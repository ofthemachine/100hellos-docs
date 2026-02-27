export const CATEGORY_COLORS = {
  systems: '#ff6b6b',
  'general-purpose': '#4ecdc4',
  functional: '#a78bfa',
  scripting: '#fbbf24',
  web: '#60a5fa',
  historical: '#9ca3af',
  esoteric: '#f472b6',
  jvm: '#fb923c',
  shell: '#34d399',
  'ml-family': '#c084fc',
}

export const CATEGORY_LANES = {
  historical: 0,
  systems: 1,
  'general-purpose': 2,
  functional: 3,
  'ml-family': 4,
  jvm: 5,
  scripting: 6,
  web: 7,
  shell: 8,
  esoteric: 9,
}

export const CATEGORIES = Object.keys(CATEGORY_LANES)
