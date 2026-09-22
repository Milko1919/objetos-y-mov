import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { MascotPip } from './MascotPip';
import { AccessoryId } from '../types';
import { soundManager, speakEnglish } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Star, Trophy, Sparkles, ArrowRight } from 'lucide-react';

interface RewardModalProps {
  title: string;
  subtitle: string;
  xpEarned: number;
  gemsEarned: number;
  accuracyPercent?: number;
  accessory: AccessoryId;
  onContinue: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  title,
  subtitle,
  xpEarned,
  gemsEarned,
  accuracyPercent = 100,
  accessory,
  onContinue,
}) => {
  useEffect(() => {
    soundManager.playVictory();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
    });
    speakEnglish(`Congratulations! ${title}! You earned ${xpEarned} XP and ${gemsEarned} gems!`);
  }, [title, xpEarned, gemsEarned]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center border-4 border-amber-300 shadow-2xl relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot Celebrating */}
        <div className="flex justify-center mb-2">
          <MascotPip
            mood="celebrating"
            accessory={accessory}
            size="lg"
            speechBubble="You did it! Super Star!"
          />
        </div>

        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-sm font-bold text-slate-500 mt-1">
          {subtitle}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-6">
          {/* XP */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-amber-500 font-black text-xl flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-500" />
              +{xpEarned}
            </span>
            <span className="text-[11px] font-black text-amber-900 uppercase mt-0.5">
              XP Earned
            </span>
          </div>

          {/* Gems */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-sky-500 font-black text-xl flex items-center gap-1">
              💎 +{gemsEarned}
            </span>
            <span className="text-[11px] font-black text-sky-900 uppercase mt-0.5">
              Gems
            </span>
          </div>

          {/* Accuracy */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-emerald-600 font-black text-xl">
              {accuracyPercent}%
            </span>
            <span className="text-[11px] font-black text-emerald-900 uppercase mt-0.5">
              Accuracy
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            soundManager.playPop();
            onContinue();
          }}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl border-b-6 border-emerald-700 active:translate-y-1 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Claim Rewards & Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
