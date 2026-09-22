import React from 'react';
import { motion } from 'motion/react';
import { BADGES } from '../data/lessonsData';
import { UserProgress } from '../types';
import { soundManager } from '../utils/audio';
import { X, Trophy, CheckCircle, Lock } from 'lucide-react';

interface BadgesModalProps {
  progress: UserProgress;
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  progress,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-5 md:p-6 max-w-md w-full border-4 border-purple-300 shadow-2xl relative max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Science Trophy Room
              </h3>
              <p className="text-xs font-bold text-slate-400">
                {progress.unlockedBadges.length} of {BADGES.length} Badges Unlocked
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges List */}
        <div className="overflow-y-auto flex-1 space-y-3 py-4 pr-1">
          {BADGES.map((badge) => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-purple-50/70 border-purple-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 flex-shrink-0 shadow-inner ${
                    isUnlocked
                      ? 'bg-white border-purple-300'
                      : 'bg-slate-200 border-slate-300 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-slate-900">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Earned!
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {badge.description}
                  </p>
                  <p className="text-[10px] text-purple-600 font-bold mt-1">
                    Goal: {badge.requiredCondition}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
