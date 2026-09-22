import React, { useState } from 'react';
import { UserProgress } from '../types';
import { soundManager } from '../utils/audio';
import { getLevelStatus, SCIENCE_LEVELS } from '../utils/levels';
import { Volume2, VolumeX, Sparkles, Trophy, Heart, Flame, Star, Award, X } from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenShop: () => void;
  onOpenBadges: () => void;
  showSpanishHint: boolean;
  onToggleSpanishHint: () => void;
  onHeartRefill: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  isMuted,
  onToggleMute,
  onOpenShop,
  onOpenBadges,
  showSpanishHint,
  onToggleSpanishHint,
  onHeartRefill,
}) => {
  const [showLevelPopover, setShowLevelPopover] = useState(false);
  const levelStatus = getLevelStatus(progress.xp);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b-2 border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
      {/* Brand & Mascot Icon */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-2xl bg-orange-500 border-2 border-orange-600 flex items-center justify-center text-2xl shadow-sm">
          🦊
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-none flex items-center gap-1.5">
            Motion<span className="text-orange-500">Kids</span>
          </h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Science with Pip
          </span>
        </div>
      </div>

      {/* Gamification Stats: Science Level, Streak, Gems, Hearts */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Science Level Button */}
        <div className="relative">
          <button
            onClick={() => {
              soundManager.playPop();
              setShowLevelPopover((prev) => !prev);
            }}
            title={`Science Level ${levelStatus.currentLevel.level}: ${levelStatus.currentLevel.title}`}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-amber-400 px-2 sm:px-3 py-1 rounded-2xl transition cursor-pointer shadow-xs active:scale-95"
          >
            <span className="text-sm sm:text-base leading-none">
              {levelStatus.currentLevel.icon}
            </span>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-amber-900 uppercase tracking-tight leading-none">
                  Lvl {levelStatus.currentLevel.level}
                </span>
                <span className="text-[10px] font-bold text-amber-700 hidden md:inline leading-none">
                  · {levelStatus.currentLevel.title}
                </span>
              </div>
              <div className="w-12 sm:w-16 h-1.5 bg-amber-200 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${levelStatus.progressPercent}%` }}
                />
              </div>
            </div>
          </button>

          {/* Science Level Popover / Tooltip */}
          {showLevelPopover && (
            <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-white rounded-3xl p-4 shadow-2xl border-4 border-amber-300 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{levelStatus.currentLevel.icon}</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-tight">
                      Science Level {levelStatus.currentLevel.level}
                    </h4>
                    <span className="text-xs font-bold text-amber-600">
                      {levelStatus.currentLevel.title}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowLevelPopover(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-semibold mb-3">
                "{levelStatus.currentLevel.motto}"
              </p>

              {/* Progress to next level */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-2.5 mb-3">
                <div className="flex justify-between items-center text-[11px] font-black text-slate-500 mb-1">
                  <span>Progress to Next Rank</span>
                  <span className="text-amber-600 font-black">
                    {progress.xp} XP Total
                  </span>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${levelStatus.progressPercent}%` }}
                  />
                </div>
                {levelStatus.nextLevel ? (
                  <p className="text-[11px] text-slate-500 font-bold mt-1.5 flex items-center justify-between">
                    <span>Next: {levelStatus.nextLevel.icon} {levelStatus.nextLevel.title}</span>
                    <span className="text-amber-700 font-black">+{levelStatus.xpToNext} XP needed</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-600 font-black mt-1.5">
                    🏆 Max Level Reached! Master Scientist!
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowLevelPopover(false)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl border-b-2 border-amber-700 active:translate-y-0.5 transition cursor-pointer"
              >
                Got It! Keep Exploring 🚀
              </button>
            </div>
          )}
        </div>

        {/* Streak Flame */}
        <div
          title="Daily Streak!"
          className="flex items-center gap-1 bg-amber-50 border-2 border-amber-200 px-2 sm:px-2.5 py-1 rounded-2xl cursor-default"
        >
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-black text-amber-600">
            {progress.streak}
          </span>
        </div>

        {/* Gems / Rubies */}
        <button
          onClick={() => {
            soundManager.playPop();
            onOpenShop();
          }}
          title="Motion Gems - Open Shop!"
          className="flex items-center gap-1 bg-sky-50 border-2 border-sky-200 hover:border-sky-300 px-2 sm:px-2.5 py-1 rounded-2xl transition cursor-pointer"
        >
          <span className="text-sm sm:text-base">💎</span>
          <span className="text-xs sm:text-sm font-black text-sky-600">
            {progress.gems}
          </span>
        </button>

        {/* Hearts */}
        <button
          onClick={() => {
            soundManager.playPop();
            onHeartRefill();
          }}
          title="Lives left - Click to refill!"
          className="flex items-center gap-1 bg-rose-50 border-2 border-rose-200 hover:border-rose-300 px-2 sm:px-2.5 py-1 rounded-2xl transition cursor-pointer"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
          <span className="text-xs sm:text-sm font-black text-rose-600">
            {progress.hearts}
          </span>
        </button>

        {/* Badges / Trophies */}
        <button
          onClick={() => {
            soundManager.playPop();
            onOpenBadges();
          }}
          className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 border-2 border-purple-200 transition"
          title="Trophies & Badges"
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Pip's Closet Shop */}
        <button
          onClick={() => {
            soundManager.playPop();
            onOpenShop();
          }}
          className="p-2 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 border-2 border-amber-300 transition flex items-center gap-1"
          title="Pip's Closet"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs font-black hidden md:inline">Closet</span>
        </button>

        {/* Bilingual Helper Toggle */}
        <button
          onClick={() => {
            soundManager.playPop();
            onToggleSpanishHint();
          }}
          className={`px-2 py-1 rounded-xl text-xs font-black border-2 transition ${
            showSpanishHint
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
          }`}
          title="Toggle Spanish translation hints for 7yo learners"
        >
          {showSpanishHint ? 'ES Hints' : 'ES Off'}
        </button>

        {/* Audio Mute */}
        <button
          onClick={onToggleMute}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-300 transition"
          title={isMuted ? 'Unmute voice and sounds' : 'Mute sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
          ) : (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
};
