import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonUnit, VocabularyTerm } from '../types';
import { MascotPip } from './MascotPip';
import { InteractiveSim } from './InteractiveSims';
import { soundManager, speakEnglish } from '../utils/audio';
import { Volume2, Snail, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonLearnViewProps {
  unit: LessonUnit;
  initialTermId?: string;
  showSpanishHint: boolean;
  onCompleteSingleTerm?: (termId: string) => void;
  onCompleteTerms: () => void;
  onBackToMap: () => void;
  accessory: any;
}

export const LessonLearnView: React.FC<LessonLearnViewProps> = ({
  unit,
  initialTermId,
  showSpanishHint,
  onCompleteSingleTerm,
  onCompleteTerms,
  onBackToMap,
  accessory,
}) => {
  const [currentIdx, setCurrentIdx] = useState(() => {
    if (initialTermId) {
      const idx = unit.terms.findIndex(t => t.id === initialTermId);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const [speaking, setSpeaking] = useState(false);
  const [hasPracticedWord, setHasPracticedWord] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialTermId) {
      const idx = unit.terms.findIndex(t => t.id === initialTermId);
      if (idx !== -1) setCurrentIdx(idx);
    }
  }, [initialTermId, unit]);

  const term: VocabularyTerm = unit.terms[currentIdx] || unit.terms[0];
  const isLastTerm = currentIdx === unit.terms.length - 1;
  const progressPercent = Math.round(((currentIdx + 1) / unit.terms.length) * 100);

  // Auto speak word on term change
  useEffect(() => {
    if (term) {
      setSpeaking(true);
      speakEnglish(`${term.word}. ${term.definition}`).finally(() => setSpeaking(false));
    }
  }, [currentIdx, term]);

  const handlePlayAudio = (slow: boolean = false) => {
    soundManager.playPop();
    setSpeaking(true);
    speakEnglish(term.word, slow).finally(() => setSpeaking(false));
  };

  const handlePlayFullSentence = () => {
    soundManager.playPop();
    setSpeaking(true);
    speakEnglish(`${term.word}. ${term.definition} For example: ${term.exampleSentence}`).finally(() => setSpeaking(false));
  };

  const handleNextTerm = () => {
    soundManager.playCorrect();
    setHasPracticedWord(prev => ({ ...prev, [term.id]: true }));
    onCompleteSingleTerm?.(term.id);

    if (isLastTerm) {
      // Completed all terms!
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
      speakEnglish(`Fantastic job! You finished learning all terms for Unit ${unit.unitNumber}! Now let's test your skills in the Quiz!`);
      onCompleteTerms();
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handleCompleteAndReturnToMap = () => {
    soundManager.playCorrect();
    setHasPracticedWord(prev => ({ ...prev, [term.id]: true }));
    onCompleteSingleTerm?.(term.id);

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (isLastTerm) {
      speakEnglish(`Fantastic! You mastered ${term.word}! The Unit ${unit.unitNumber} Quiz is now unlocked on your map!`);
      onCompleteTerms();
    } else {
      const nextTerm = unit.terms[currentIdx + 1];
      speakEnglish(`Awesome job! You completed ${term.word}! ${nextTerm ? nextTerm.word : 'Next step'} is now unlocked on your map!`);
    }

    onBackToMap();
  };

  const handlePrevTerm = () => {
    soundManager.playPop();
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 py-4 flex flex-col min-h-[calc(100vh-65px)]">
      {/* Top Header: Progress Bar & Exit */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={onBackToMap}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          title="Back to Lesson Map"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>

        <span className="text-xs font-black text-slate-500">
          {currentIdx + 1} / {unit.terms.length}
        </span>
      </div>

      {/* Main Learning Card */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={term.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-5 md:p-7 relative overflow-hidden"
          >
            {/* Textbook Reference Badge */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                <BookOpen className="w-3.5 h-3.5" />
                Part 1: Science Vocabulary
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {unit.chapterReference}
              </span>
            </div>

            {/* Word Header with Audio Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl">{term.icon}</span>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {term.word}
                    </h2>
                    <span className="text-sm font-bold text-slate-400 font-mono">
                      {term.phonetic}
                    </span>
                  </div>
                </div>

                {/* Spanish Translation Pill if enabled */}
                {showSpanishHint && (
                  <div className="mt-1.5 inline-block bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-lg">
                    En español: {term.spanishTranslation}
                  </div>
                )}
              </div>

              {/* Audio Listen Buttons (Duolingo Style) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayAudio(false)}
                  disabled={speaking}
                  className="px-3 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl border-b-4 border-sky-700 active:translate-y-1 transition font-black flex items-center gap-1.5 shadow-sm"
                  title="Listen in English"
                >
                  <Volume2 className="w-5 h-5" />
                  <span className="text-xs sm:text-sm">Listen</span>
                </button>

                <button
                  onClick={() => handlePlayAudio(true)}
                  disabled={speaking}
                  className="p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl border-b-4 border-amber-300 active:translate-y-1 transition font-bold"
                  title="Slow pronunciation for kids"
                >
                  <Snail className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Definition Box */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 mb-4">
              <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                {term.definition}
              </p>
              {showSpanishHint && (
                <p className="text-xs text-slate-500 mt-1 font-semibold italic">
                  "{term.spanishDefinition}"
                </p>
              )}

              {/* Textbook Example */}
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-start justify-between gap-2">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  <strong className="text-orange-600 font-black">Example: </strong>
                  {term.exampleSentence}
                </p>
                <button
                  onClick={handlePlayFullSentence}
                  className="text-sky-500 hover:text-sky-700 p-1 flex-shrink-0"
                  title="Read full example"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Hands-On Simulation Widget */}
            {term.interactiveType && (
              <InteractiveSim type={term.interactiveType} />
            )}

            {/* Fun Fact Card with Pip's Tip */}
            <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200 rounded-2xl p-3">
              <div className="flex-shrink-0">
                <MascotPip mood="thinking" accessory={accessory} size="sm" />
              </div>
              <div className="text-xs sm:text-sm text-amber-900 font-medium">
                <strong className="font-extrabold text-amber-950 block">Pip's Science Tip:</strong>
                {term.funFact}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Floating Navigation Bar */}
      <div className="mt-4 pt-3 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToMap}
          className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border-b-4 border-slate-300 rounded-2xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 active:translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          onClick={handleCompleteAndReturnToMap}
          className="flex-1 max-w-md px-5 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl border-b-5 border-emerald-800 font-black text-sm sm:text-base active:translate-y-1 transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>
            {isLastTerm
              ? `Complete "${term.word}" & Unlock Unit Quiz! 🏆`
              : `Complete "${term.word}" & Unlock Next Step! 🗺️`}
          </span>
        </button>
      </div>
    </div>
  );
};
