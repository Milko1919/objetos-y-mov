import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress, VocabularyTerm } from '../types';
import { LESSON_UNITS } from '../data/lessonsData';
import { MascotPip } from './MascotPip';
import { soundManager, speakEnglish } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Volume2,
  Sparkles,
  Search,
  Lock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Compass,
  Lightbulb,
  Award,
  Filter,
  Layers,
} from 'lucide-react';

interface JournalTerm extends VocabularyTerm {
  unitId: string;
  unitNumber: number;
  unitTitle: string;
  isMastered: boolean;
}

interface PipsJournalModalProps {
  progress: UserProgress;
  showSpanishHint: boolean;
  onClose: () => void;
  onJumpToTerm: (unitId: string, termId: string) => void;
}

export const PipsJournalModal: React.FC<PipsJournalModalProps> = ({
  progress,
  showSpanishHint,
  onClose,
  onJumpToTerm,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'motion' | 'force' | 'machine'>('all');
  const [showOnlyMastered, setShowOnlyMastered] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Collect all terms from all lesson units with mastery status
  const allTerms: JournalTerm[] = LESSON_UNITS.flatMap((unit) =>
    unit.terms.map((term) => ({
      ...term,
      unitId: unit.id,
      unitNumber: unit.unitNumber,
      unitTitle: unit.lessonTitle,
      isMastered:
        (progress.completedTerms && progress.completedTerms.includes(term.id)) ||
        (progress.completedUnits && progress.completedUnits.includes(unit.id)) ||
        (progress.completedQuizzes && progress.completedQuizzes.includes(unit.id)),
    }))
  );

  const totalTermsCount = allTerms.length;
  const masteredCount = allTerms.filter((t) => t.isMastered).length;
  const masteryPercentage = Math.round((masteredCount / totalTermsCount) * 100);
  const isAllMastered = masteredCount === totalTermsCount;

  useEffect(() => {
    // Play sound and welcoming narration on mount
    soundManager.playPop();
    speakEnglish(
      `Welcome to Pip's Field Journal! You have mastered ${masteredCount} of ${totalTermsCount} science concepts!`
    );

    if (isAllMastered) {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.4 },
      });
    }
  }, []);

  // Filter terms by category, search, and mastered filter
  const filteredTerms = allTerms.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (showOnlyMastered && !item.isMastered) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchWord = item.word.toLowerCase().includes(q);
      const matchDef = item.definition.toLowerCase().includes(q);
      const matchSpanish = item.spanishTranslation.toLowerCase().includes(q);
      if (!matchWord && !matchDef && !matchSpanish) {
        return false;
      }
    }
    return true;
  });

  const handleSpeakTerm = async (term: JournalTerm, fullDefinition: boolean = false) => {
    soundManager.playPop();
    setActiveSpeechId(term.id);
    const textToSpeak = fullDefinition
      ? `${term.word}. ${term.definition}. Example: ${term.exampleSentence}`
      : `${term.word}. ${term.definition}`;

    try {
      await speakEnglish(textToSpeak);
    } finally {
      setActiveSpeechId(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          className="relative z-10 w-full max-w-4xl bg-[#fffef9] rounded-3xl sm:rounded-4xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Notebook Header */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-4 sm:px-6 py-4 border-b-4 border-amber-600 text-white relative flex-shrink-0">
            {/* Close Button */}
            <button
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95 cursor-pointer backdrop-blur-xs"
              aria-label="Close Journal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl shadow-inner backdrop-blur-xs flex-shrink-0">
                  📖
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/25 text-amber-950 font-black text-[11px] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 fill-amber-300" />
                    <span>Pip's Field Notes • Grade 2</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                    Pip's Science Journal
                  </h2>
                  {showSpanishHint && (
                    <p className="text-xs text-amber-100 font-bold mt-0.5">
                      Diario de Ciencias de Pip: Conceptos Dominados
                    </p>
                  )}
                </div>
              </div>

              {/* Mascot Mini Greeting */}
              <div className="hidden md:flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-2xl border border-white/20 backdrop-blur-xs">
                <MascotPip
                  mood={isAllMastered ? 'celebrating' : 'thinking'}
                  accessory={progress.equippedAccessory}
                  size="sm"
                />
                <div className="text-left">
                  <span className="text-[11px] font-black uppercase text-amber-100 block">Pip says:</span>
                  <p className="text-xs font-bold text-white max-w-[160px] leading-tight">
                    {isAllMastered
                      ? 'You are a master scientist!'
                      : 'Tap any card to hear me read it!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mastery Progress Bar */}
            <div className="mt-4 pt-3 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-200" />
                <span className="text-xs sm:text-sm font-black text-white">
                  {masteredCount} of {totalTermsCount} Terms Mastered ({masteryPercentage}%)
                </span>
              </div>

              <div className="w-full sm:w-64 bg-black/20 rounded-full h-3 p-0.5 shadow-inner overflow-hidden">
                <div
                  className="bg-yellow-300 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${masteryPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="bg-amber-50/70 border-b-2 border-amber-200 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
              <button
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-amber-100/80 border border-slate-200'
                }`}
              >
                <span>All Concepts</span>
                <span className="text-[10px] bg-black/15 px-1.5 py-0.5 rounded-full">
                  {allTerms.length}
                </span>
              </button>

              <button
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategory('motion');
                }}
                className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  selectedCategory === 'motion'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
                }`}
              >
                <span>🚀 Motion</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategory('force');
                }}
                className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  selectedCategory === 'force'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
                }`}
              >
                <span>⚡ Forces</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playPop();
                  setSelectedCategory('machine');
                }}
                className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  selectedCategory === 'machine'
                    ? 'bg-purple-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
                }`}
              >
                <span>⚙️ Machines</span>
              </button>
            </div>

            {/* Mastered Only Toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={showOnlyMastered}
                  onChange={(e) => {
                    soundManager.playPop();
                    setShowOnlyMastered(e.target.checked);
                  }}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <span>Mastered Only ⭐</span>
              </label>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 w-32 sm:w-40"
                />
              </div>
            </div>
          </div>

          {/* Mastered All Milestone Celebration Banner */}
          {isAllMastered && (
            <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-b-2 border-amber-300 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-900 leading-tight">
                    Master Junior Physicist Certificate!
                  </h4>
                  <p className="text-[11px] font-bold text-amber-700">
                    You discovered and mastered every single motion and machine term in Grade 2!
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.playLevelUp();
                  confetti({
                    particleCount: 60,
                    spread: 80,
                    origin: { y: 0.5 },
                  });
                }}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs active:translate-y-0.5 cursor-pointer transition flex items-center gap-1"
              >
                <span>Party 🎉</span>
              </button>
            </div>
          )}

          {/* Cards Grid / Scrollable Content */}
          <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-12 px-4">
                <span className="text-5xl block mb-2">🔍</span>
                <h3 className="text-lg font-black text-slate-700">No terms found</h3>
                <p className="text-xs font-bold text-slate-500 mt-1 max-w-sm mx-auto">
                  Try changing your category filter or unchecking "Mastered Only" to see all scientific terms!
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowOnlyMastered(false);
                    setSearchQuery('');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs cursor-pointer transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {filteredTerms.map((term) => {
                  const isSpeaking = activeSpeechId === term.id;

                  return (
                    <motion.div
                      key={term.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative rounded-3xl border-3 p-4 sm:p-5 transition-all flex flex-col justify-between ${
                        term.isMastered
                          ? 'bg-white border-amber-300 shadow-md hover:shadow-lg hover:border-amber-400'
                          : 'bg-slate-50/90 border-dashed border-slate-300 opacity-90'
                      }`}
                    >
                      {/* Card Top Row: Icon, Word, Pronunciation, Mastery Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xs border-2 flex-shrink-0"
                              style={{
                                backgroundColor: term.isMastered ? `${term.color}15` : '#f1f5f9',
                                borderColor: term.isMastered ? term.color : '#cbd5e1',
                              }}
                            >
                              {term.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight tracking-tight">
                                  {term.word}
                                </h3>
                                {/* Speaker Audio Button */}
                                <button
                                  onClick={() => handleSpeakTerm(term, false)}
                                  title="Listen to pronunciation and definition"
                                  className={`p-1.5 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                                    isSpeaking
                                      ? 'bg-amber-400 text-white border-amber-500 animate-pulse'
                                      : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                  }`}
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Phonetic guide */}
                              <span className="text-[11px] font-bold text-slate-400 font-mono">
                                {term.phonetic}
                              </span>

                              {/* Spanish Translation */}
                              {showSpanishHint && (
                                <p className="text-xs font-bold text-amber-600 mt-0.5">
                                  {term.spanishTranslation}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Mastered or Locked Badge */}
                          {term.isMastered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 text-[11px] font-black uppercase tracking-tight flex-shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mastered</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-tight flex-shrink-0">
                              <Lock className="w-3 h-3" />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>

                        {/* Science Definition */}
                        <div className="mt-2 bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
                          <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                            {term.definition}
                          </p>
                          {showSpanishHint && (
                            <p className="text-[11px] font-semibold text-slate-500 mt-1 italic">
                              "{term.spanishDefinition}"
                            </p>
                          )}
                        </div>

                        {/* Real-World Example Box */}
                        <div className="mt-2.5 flex items-start gap-2 text-xs font-medium text-slate-600 bg-sky-50/60 rounded-2xl p-2.5 border border-sky-100">
                          <span className="text-base leading-none">💡</span>
                          <p className="leading-snug">
                            <strong className="text-sky-900 font-bold">Real World: </strong>
                            {term.exampleSentence}
                          </p>
                        </div>

                        {/* Pip's Field Fun Fact */}
                        <div className="mt-2 flex items-start gap-2 text-[11px] font-medium text-amber-900 bg-amber-50/70 rounded-2xl p-2.5 border border-amber-200/70">
                          <span className="text-base leading-none">🦊</span>
                          <p className="leading-snug">
                            <strong className="text-amber-900 font-bold">Pip's Secret: </strong>
                            {term.funFact}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: Unit Tag & Interactive Simulation Replay Button */}
                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-400">
                          Unit {term.unitNumber} • {term.category.toUpperCase()}
                        </span>

                        <button
                          onClick={() => {
                            soundManager.playPop();
                            onJumpToTerm(term.unitId, term.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                            term.isMastered
                              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:translate-y-0.5'
                              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{term.isMastered ? 'Practice with Pip' : `Unlock in Unit ${term.unitNumber}`}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Bottom Action Bar */}
          <div className="bg-white border-t-2 border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              Keep discovering more concepts to earn your Master Scientist badge!
            </span>
            <button
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-sm shadow-md active:translate-y-0.5 transition cursor-pointer ml-auto"
            >
              Back to Adventure Map 🗺️
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
