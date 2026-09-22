export type MascotMood = 'happy' | 'waving' | 'thinking' | 'celebrating' | 'oops' | 'pushing' | 'pulley';

export type AccessoryId = 'none' | 'goggles' | 'cape' | 'astronaut' | 'detective' | 'crown';

export interface VocabularyTerm {
  id: string;
  word: string;
  phonetic: string;
  spanishTranslation: string;
  definition: string;
  spanishDefinition: string;
  exampleSentence: string;
  icon: string;
  color: string;
  category: 'motion' | 'force' | 'machine';
  funFact: string;
  interactiveType?: 'position_room' | 'swing' | 'gravity_drop' | 'force_energy' | 'push_pull' | 'friction_road' | 'ramp_box' | 'lever_seesaw' | 'pulley_flag';
}

export type QuestionType = 
  | 'multiple_choice'
  | 'match_pairs'
  | 'fill_in_blank'
  | 'listen_pick'
  | 'true_false'
  | 'interactive_scenario';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  promptSpanish?: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  imageHint?: string;
  pairs?: { english: string; spanish: string }[];
  scenarioType?: 'kick_strength' | 'friction_surface' | 'simple_machine_picker';
}

export interface LessonUnit {
  id: string;
  unitNumber: number;
  lessonTitle: string;
  lessonSubtitle: string;
  colorTheme: {
    primary: string;
    border: string;
    light: string;
    gradient: string;
  };
  icon: string;
  terms: VocabularyTerm[];
  quizzes: QuizQuestion[];
  chapterReference: string;
}

export interface UserProgress {
  hearts: number;
  maxHearts: number;
  gems: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedTerms: string[];
  completedUnits: string[];
  completedQuizzes: string[];
  unlockedAccessories: AccessoryId[];
  equippedAccessory: AccessoryId;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requiredCondition: string;
}
