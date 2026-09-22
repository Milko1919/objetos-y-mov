import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonUnit, QuizQuestion, AccessoryId } from '../types';
import { MascotPip } from './MascotPip';
import { soundManager, speakEnglish } from '../utils/audio';
import { Volume2, Snail, Heart, X, Check, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  unit: LessonUnit;
  hearts: number;
  onLoseHeart: () => void;
  onRefillHearts: () => void;
  onQuizComplete: (score: number, total: number) => void;
  onExit: () => void;
  showSpanishHint: boolean;
  accessory: AccessoryId;
}

export const QuizView: React.FC<QuizViewProps> = ({
  unit,
  hearts,
  onLoseHeart,
  onRefillHearts,
  onQuizComplete,
  onExit,
  showSpanishHint,
  accessory,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const nextTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isCancelledRef = useRef(false);

  const question: QuizQuestion = unit.quizzes[currentIdx];
  const totalQuestions = unit.quizzes.length;
  const progressPercent = Math.round((currentIdx / totalQuestions) * 100);

  // Clean up timers and audio on unmount
  useEffect(() => {
    isCancelledRef.current = false;
    return () => {
      isCancelledRef.current = true;
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
        nextTimerRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-speak question prompt when arriving at a new question
  useEffect(() => {
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }

    setIsAnswerChecked(false);
    setIsSpeakingExplanation(false);
    setSelectedOption(null);
    setSelectedLeft(null);
    setMatchedPairs({});

    if (question) {
      const speech = question.audioText || question.prompt;
      speakEnglish(speech);
    }
  }, [currentIdx, question]);

  const handlePlayAudio = (slow: boolean = false) => {
    soundManager.playPop();
    const speech = question.audioText || question.prompt;
    speakEnglish(speech, slow);
  };

  // Immediate evaluation function: triggers right upon selecting an option
  const handleEvaluateAnswer = async (
    selected: string,
    isMatchPairsType: boolean = false,
    pairsToCheck?: Record<string, string>
  ) => {
    if (isAnswerChecked || isCancelledRef.current) return;

    let correct = false;
    if (isMatchPairsType && question.pairs) {
      const currentPairs = pairsToCheck || matchedPairs;
      correct = !!question.pairs.every((p) => currentPairs[p.english] === p.spanish);
    } else {
      correct = selected === question.correctAnswer;
    }

    setSelectedOption(selected);
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    setIsSpeakingExplanation(true);

    let updatedScore = correctAnswersCount;
    if (correct) {
      updatedScore = correctAnswersCount + 1;
      setCorrectAnswersCount(updatedScore);
      soundManager.playCorrect();
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 },
      });
    } else {
      soundManager.playIncorrect();
      onLoseHeart();
    }

    // Complete English narration explaining whether it was correct or not, followed by the explanation
    const speechText = correct
      ? `Super job! That is correct! ${question.explanation}`
      : `Not quite! The correct answer is: ${question.explanation}`;

    // Speak explanation in English and automatically advance when speech completes
    try {
      await speakEnglish(speechText);
    } catch {
      // Fallback if audio fails
    }

    if (!isCancelledRef.current) {
      setIsSpeakingExplanation(false);
      // Brief pause after speech completes so the student comfortably absorbs the result
      nextTimerRef.current = setTimeout(() => {
        if (!isCancelledRef.current) {
          advanceToNext(updatedScore, correct);
        }
      }, 600);
    }
  };

  // Pair Matching Logic
  const handleSelectLeftPair = (item: string) => {
    if (isAnswerChecked) return;
    soundManager.playPop();
    setSelectedLeft(item);
  };

  const handleSelectRightPair = (item: string) => {
    if (!selectedLeft || isAnswerChecked) return;
    soundManager.playPop();
    const newMatched = { ...matchedPairs, [selectedLeft]: item };
    setMatchedPairs(newMatched);
    setSelectedLeft(null);

    // If all pairs are matched, instantly evaluate and explain!
    if (question.pairs && Object.keys(newMatched).length === question.pairs.length) {
      handleEvaluateAnswer('all_matched', true, newMatched);
    }
  };

  // Advance to next question or complete quiz
  const advanceToNext = (scoreToUse = correctAnswersCount, lastWasCorrect = isCorrect) => {
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Quiz Finished!
      onQuizComplete(scoreToUse, totalQuestions);
    }
  };

  // If no hearts left, show recovery modal
  if (hearts <= 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border-4 border-rose-400 shadow-2xl"
        >
          <MascotPip mood="oops" accessory={accessory} size="lg" speechBubble="Out of hearts! Let's recharge!" />
          <h3 className="text-2xl font-black text-slate-800 mt-3">Need More Hearts?</h3>
          <p className="text-slate-600 text-sm mt-1 font-bold">
            Don't give up! Pip gives you a full heart recharge so you can keep exploring science!
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              onClick={() => {
                soundManager.playPop();
                onRefillHearts();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl border-b-4 border-emerald-700 active:translate-y-1 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white" />
              Refill Full Hearts (Free!)
            </button>
            <button
              onClick={onExit}
              className="w-full py-2.5 text-slate-500 hover:text-slate-700 font-bold text-sm cursor-pointer"
            >
              Return to Map
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 py-4 flex flex-col min-h-[calc(100vh-65px)]">
      {/* Top Header: Exit, Progress Bar, Lives */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={onExit}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          title="Quit Quiz"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>

        {/* Hearts indicator */}
        <div className="flex items-center gap-1 text-rose-500 font-black text-sm">
          <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Main Question Body */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-5 md:p-7"
          >
            {/* Pip Speech & Prompt Header */}
            <div className="flex items-start gap-4 mb-6">
              <MascotPip
                mood={
                  isAnswerChecked
                    ? isCorrect
                      ? 'celebrating'
                      : 'oops'
                    : 'waving'
                }
                accessory={accessory}
                size="md"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    Question {currentIdx + 1} of {totalQuestions}
                  </span>
                  <button
                    onClick={() => handlePlayAudio(false)}
                    className="p-1.5 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition cursor-pointer"
                    title="Listen to question"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePlayAudio(true)}
                    className="p-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition cursor-pointer"
                    title="Listen slowly"
                  >
                    <Snail className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug">
                  {question.prompt}
                </h3>

                {showSpanishHint && question.promptSpanish && (
                  <p className="text-xs text-slate-500 mt-1 font-semibold italic">
                    {question.promptSpanish}
                  </p>
                )}
              </div>
            </div>

            {/* Question Type 1: Listen & Pick */}
            {question.type === 'listen_pick' && (
              <div className="mb-6 flex flex-col items-center">
                <button
                  onClick={() => handlePlayAudio(false)}
                  className="w-20 h-20 bg-sky-500 hover:bg-sky-600 text-white rounded-3xl border-b-4 border-sky-700 active:translate-y-1 transition shadow-lg flex items-center justify-center mb-2 cursor-pointer"
                  title="Listen to audio prompt"
                >
                  <Volume2 className="w-10 h-10" />
                </button>
                <span className="text-xs font-bold text-slate-400">
                  Tap speaker to listen again!
                </span>
              </div>
            )}

            {/* Question Type 2: Match Pairs */}
            {question.type === 'match_pairs' && question.pairs && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Left column */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block text-center">
                    Object / Motion
                  </span>
                  {question.pairs.map((pair) => {
                    const isMatched = !!matchedPairs[pair.english];
                    const isSelected = selectedLeft === pair.english;
                    return (
                      <button
                        key={pair.english}
                        disabled={isMatched || isAnswerChecked}
                        onClick={() => handleSelectLeftPair(pair.english)}
                        className={`w-full p-3 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-80'
                            : isSelected
                            ? 'bg-sky-100 border-sky-500 text-sky-900 scale-102'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pair.english}
                      </button>
                    );
                  })}
                </div>

                {/* Right column */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block text-center">
                    How it moves / Friction
                  </span>
                  {question.pairs.map((pair) => {
                    const matchedKey = Object.keys(matchedPairs).find(
                      (k) => matchedPairs[k] === pair.spanish
                    );
                    const isMatched = !!matchedKey;
                    return (
                      <button
                        key={pair.spanish}
                        disabled={isMatched || isAnswerChecked}
                        onClick={() => handleSelectRightPair(pair.spanish)}
                        className={`w-full p-3 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-80'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pair.spanish}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Standard Options (Multiple Choice, Fill in Blank, True/False, Listen & Pick) */}
            {question.options && question.type !== 'match_pairs' && (
              <div
                className={`grid gap-3 ${
                  question.type === 'true_false' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isTargetCorrect = option === question.correctAnswer;

                  let cardStyle =
                    'bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer';

                  if (isAnswerChecked) {
                    if (isTargetCorrect) {
                      cardStyle =
                        'bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-black';
                    } else if (isSelected && !isCorrect) {
                      cardStyle =
                        'bg-rose-100 border-2 border-rose-500 text-rose-900 line-through';
                    } else {
                      cardStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => {
                        soundManager.playPop();
                        handleEvaluateAnswer(option, false);
                      }}
                      className={`p-4 rounded-2xl font-bold text-sm sm:text-base text-left border-b-4 transition-all flex items-center gap-3 ${cardStyle}`}
                    >
                      <span className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-500 flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Feedback Drawer (Automatic Explanation & Next Step) */}
      <div
        className={`mt-4 rounded-3xl p-4 transition-colors duration-300 border-2 ${
          !isAnswerChecked
            ? 'bg-white/80 border-slate-200'
            : isCorrect
            ? 'bg-[#d7ffb8] border-emerald-300'
            : 'bg-[#ffdfe0] border-rose-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Feedback text and explanation */}
          <div className="flex items-center gap-3 flex-1">
            {isAnswerChecked ? (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black shadow-md flex-shrink-0 ${
                  isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              >
                {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1">
              {isAnswerChecked ? (
                <>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-black text-lg ${
                        isCorrect ? 'text-emerald-800' : 'text-rose-800'
                      }`}
                    >
                      {isCorrect ? 'Super Job!' : 'Not Quite!'}
                    </h4>
                    {isSpeakingExplanation && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white/70 px-2 py-0.5 rounded-full animate-pulse">
                        <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                        Speaking explanation in English...
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {question.explanation}
                  </p>
                </>
              ) : (
                <p className="text-xs sm:text-sm font-bold text-slate-500">
                  Tap an answer to check instantly! Pip will explain in English and automatically move to the next question.
                </p>
              )}
            </div>
          </div>

          {/* Quick Next Button if user wants to skip waiting for the voice */}
          {isAnswerChecked && (
            <button
              onClick={() => advanceToNext(correctAnswersCount, isCorrect)}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm border-b-4 active:translate-y-1 transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                isCorrect
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700'
                  : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-700'
              }`}
              title="Next question"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
