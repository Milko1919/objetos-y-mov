import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScienceLevel } from '../utils/levels';
import { MascotPip } from './MascotPip';
import { AccessoryId } from '../types';
import { soundManager, speakEnglish } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Star, Award, ArrowRight } from 'lucide-react';

interface LevelUpOverlayProps {
  oldLevel: ScienceLevel;
  newLevel: ScienceLevel;
  rewardGems: number;
  newXP: number;
  accessory: AccessoryId;
  showSpanishHint?: boolean;
  onClose: () => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({
  oldLevel,
  newLevel,
  rewardGems,
  newXP,
  accessory,
  showSpanishHint = true,
  onClose,
}) => {
  useEffect(() => {
    // 1. Play grand celebratory level-up fanfare
    soundManager.playLevelUp();

    // 2. Kid-friendly English speech narration
    speakEnglish(
      `Hooray! Level Up! You reached Science Level ${newLevel.level}: ${newLevel.title}! You are a super scientist!`
    );

    // 3. Multi-stage confetti celebration
    // Initial blast
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#fbbf24', '#34d399', '#f43f5e', '#a855f7'],
    });

    // Secondary star bursts after 400ms
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#ffd700', '#ff69b4', '#00e5ff'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#ffd700', '#ff69b4', '#00e5ff'],
      });
    }, 450);

    return () => {
      clearTimeout(timer1);
    };
  }, [newLevel]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Darkened backdrop with radial illumination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Rotating Sunburst / Light Rays behind modal */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="w-[800px] h-[800px] rounded-full bg-[conic-gradient(from_0deg,#f59e0b_0deg,transparent_20deg,#38bdf8_45deg,transparent_65deg,#10b981_90deg,transparent_110deg,#ec4899_135deg,transparent_155deg,#8b5cf6_180deg,transparent_200deg,#f59e0b_225deg,transparent_245deg,#38bdf8_270deg,transparent_290deg,#10b981_315deg,transparent_335deg,#ec4899_360deg)]"
          />
        </div>

        {/* Floating Science Sparkles */}
        <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
          <motion.span
            animate={{ y: [0, -25, 0], rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute top-12 left-10 text-3xl sm:text-4xl opacity-80"
          >
            🚀
          </motion.span>
          <motion.span
            animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-20 right-12 text-3xl sm:text-4xl opacity-80"
          >
            ⭐
          </motion.span>
          <motion.span
            animate={{ y: [0, 20, 0], rotate: [0, -20, 20, 0] }}
            transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.8 }}
            className="absolute bottom-16 left-14 text-3xl sm:text-4xl opacity-80"
          >
            ⚛️
          </motion.span>
          <motion.span
            animate={{ y: [0, -18, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-20 right-14 text-3xl sm:text-4xl opacity-80"
          >
            💎
          </motion.span>
        </div>

        {/* Main Celebratory Card */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0, y: 50, rotate: -4 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="relative z-10 bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 overflow-hidden my-auto"
        >
          {/* Top glowing ambient headers */}
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-amber-300/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-sky-300/40 rounded-full blur-2xl pointer-events-none" />

          {/* Top Banner Tag */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-md mb-2"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>SCIENCE LEVEL UP!</span>
            <Sparkles className="w-4 h-4 fill-white" />
          </motion.div>

          {/* Mascot Pip Celebrating */}
          <div className="flex justify-center my-1">
            <MascotPip
              mood="celebrating"
              accessory={accessory}
              size="md"
              speechBubble="Super Scientist!"
            />
          </div>

          {/* Level Transition Shield & Badge */}
          <div className="relative my-3 flex items-center justify-center">
            {/* Pulsing ring aura */}
            <div className="absolute w-24 h-24 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />

            {/* Level Badge Crest */}
            <motion.div
              initial={{ scale: 0.7, rotate: -15 }}
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${newLevel.color.bg} border-4 border-white shadow-xl flex flex-col items-center justify-center relative`}
            >
              <span className="text-3xl leading-none drop-shadow-sm">{newLevel.icon}</span>
              <span className="text-white font-black text-base mt-1 tracking-tight drop-shadow-md">
                LVL {newLevel.level}
              </span>

              {/* Sparkle star pinned on crest */}
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-300 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                <Star className="w-4 h-4 text-amber-900 fill-amber-500" />
              </div>
            </motion.div>
          </div>

          {/* Level Titles */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {newLevel.title}
            </h3>

            {showSpanishHint && (
              <p className="text-xs sm:text-sm font-bold text-amber-600 mt-0.5">
                ¡Nivel {newLevel.level}: {newLevel.spanishTitle}!
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-2 px-3 leading-snug">
              "{newLevel.motto}"
            </p>
          </motion.div>

          {/* Level Up Rewards & Progress Breakdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 flex items-center justify-around gap-2"
          >
            {/* Level Increase Indicator */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Rank Jump
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-black text-slate-400">Lvl {oldLevel.level}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-base font-black text-emerald-600">Lvl {newLevel.level}</span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200" />

            {/* Gems Bonus Reward */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Bonus Reward
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-base font-black text-sky-500">💎 +{rewardGems}</span>
                <span className="text-xs font-bold text-slate-500">Gems</span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200" />

            {/* Total Science XP */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                Total XP
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Award className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm sm:text-base font-black text-amber-600">{newXP} XP</span>
              </div>
            </div>
          </motion.div>

          {/* Action Button: Claim & Continue */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-5"
          >
            <button
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base shadow-lg border-b-4 border-emerald-700 active:translate-y-1 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Keep Exploring!</span>
              <span className="text-xl">🚀</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
