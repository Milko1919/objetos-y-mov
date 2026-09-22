export interface ScienceLevel {
  level: number;
  title: string;
  spanishTitle: string;
  icon: string;
  motto: string;
  requiredXP: number;
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    glow: string;
  };
  gemReward: number;
}

export const SCIENCE_LEVELS: ScienceLevel[] = [
  {
    level: 1,
    title: 'Curious Observer',
    spanishTitle: 'Observador Curioso',
    icon: '🔍',
    motto: 'You notice how everyday objects move!',
    requiredXP: 0,
    color: {
      bg: 'from-amber-400 to-orange-500',
      border: 'border-amber-400',
      text: 'text-amber-500',
      accent: 'bg-amber-100',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
    gemReward: 10,
  },
  {
    level: 2,
    title: 'Motion Explorer',
    spanishTitle: 'Explorador del Movimiento',
    icon: '🚀',
    motto: 'You know positions, directions, and speedy motions!',
    requiredXP: 50,
    color: {
      bg: 'from-sky-400 to-blue-600',
      border: 'border-sky-400',
      text: 'text-sky-500',
      accent: 'bg-sky-100',
      glow: 'rgba(14, 165, 233, 0.45)',
    },
    gemReward: 20,
  },
  {
    level: 3,
    title: 'Gravity Pioneer',
    spanishTitle: 'Pionero de la Gravedad',
    icon: '🍎',
    motto: 'You discovered the invisible force pulling everything down!',
    requiredXP: 100,
    color: {
      bg: 'from-emerald-400 to-teal-600',
      border: 'border-emerald-400',
      text: 'text-emerald-500',
      accent: 'bg-emerald-100',
      glow: 'rgba(16, 185, 129, 0.45)',
    },
    gemReward: 25,
  },
  {
    level: 4,
    title: 'Force Champion',
    spanishTitle: 'Campeón de la Fuerza',
    icon: '⚡',
    motto: 'You command mighty pushes and gentle pulls!',
    requiredXP: 160,
    color: {
      bg: 'from-yellow-400 to-amber-600',
      border: 'border-yellow-400',
      text: 'text-yellow-600',
      accent: 'bg-yellow-100',
      glow: 'rgba(234, 179, 8, 0.45)',
    },
    gemReward: 30,
  },
  {
    level: 5,
    title: 'Friction Master',
    spanishTitle: 'Maestro de la Fricción',
    icon: '🛷',
    motto: 'You tame slippery ice and sticky rough surfaces!',
    requiredXP: 230,
    color: {
      bg: 'from-purple-500 to-indigo-600',
      border: 'border-purple-400',
      text: 'text-purple-500',
      accent: 'bg-purple-100',
      glow: 'rgba(168, 85, 247, 0.45)',
    },
    gemReward: 35,
  },
  {
    level: 6,
    title: 'Energy Wizard',
    spanishTitle: 'Mago de la Energía',
    icon: '🔮',
    motto: 'You understand kinetic and stored potential energy!',
    requiredXP: 310,
    color: {
      bg: 'from-pink-500 to-rose-600',
      border: 'border-pink-400',
      text: 'text-pink-500',
      accent: 'bg-pink-100',
      glow: 'rgba(236, 72, 153, 0.45)',
    },
    gemReward: 40,
  },
  {
    level: 7,
    title: 'Machine Genius',
    spanishTitle: 'Genio de las Máquinas',
    icon: '⚙️',
    motto: 'Ramps, levers, and pulleys make heavy work super easy!',
    requiredXP: 400,
    color: {
      bg: 'from-cyan-400 to-blue-600',
      border: 'border-cyan-400',
      text: 'text-cyan-500',
      accent: 'bg-cyan-100',
      glow: 'rgba(6, 182, 212, 0.45)',
    },
    gemReward: 45,
  },
  {
    level: 8,
    title: 'Master Scientist',
    spanishTitle: 'Científico Maestro',
    icon: '🏆',
    motto: 'An official honorary junior physicist extraordinaire!',
    requiredXP: 500,
    color: {
      bg: 'from-amber-300 via-yellow-400 to-orange-500',
      border: 'border-yellow-400',
      text: 'text-amber-500',
      accent: 'bg-amber-100',
      glow: 'rgba(245, 158, 11, 0.6)',
    },
    gemReward: 50,
  },
];

export interface LevelStatus {
  currentLevel: ScienceLevel;
  nextLevel: ScienceLevel | null;
  xpInLevel: number;
  xpForLevel: number;
  progressPercent: number;
  xpToNext: number;
}

export function getScienceLevel(xp: number): ScienceLevel {
  for (let i = SCIENCE_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= SCIENCE_LEVELS[i].requiredXP) {
      return SCIENCE_LEVELS[i];
    }
  }
  return SCIENCE_LEVELS[0];
}

export function getLevelStatus(xp: number): LevelStatus {
  const currentLevel = getScienceLevel(xp);
  const currentIdx = SCIENCE_LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = currentIdx < SCIENCE_LEVELS.length - 1 ? SCIENCE_LEVELS[currentIdx + 1] : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      xpInLevel: xp - currentLevel.requiredXP,
      xpForLevel: 100,
      progressPercent: 100,
      xpToNext: 0,
    };
  }

  const baseXP = currentLevel.requiredXP;
  const targetXP = nextLevel.requiredXP;
  const xpInLevel = Math.max(0, xp - baseXP);
  const xpForLevel = targetXP - baseXP;
  const progressPercent = Math.min(100, Math.round((xpInLevel / xpForLevel) * 100));
  const xpToNext = Math.max(0, targetXP - xp);

  return {
    currentLevel,
    nextLevel,
    xpInLevel,
    xpForLevel,
    progressPercent,
    xpToNext,
  };
}

export function checkLevelUp(oldXP: number, newXP: number): {
  leveledUp: boolean;
  oldLevel: ScienceLevel;
  newLevel: ScienceLevel;
  rewardGems: number;
} {
  const oldLevel = getScienceLevel(oldXP);
  const newLevel = getScienceLevel(newXP);

  if (newLevel.level > oldLevel.level) {
    return {
      leveledUp: true,
      oldLevel,
      newLevel,
      rewardGems: newLevel.gemReward,
    };
  }

  return {
    leveledUp: false,
    oldLevel,
    newLevel,
    rewardGems: 0,
  };
}
