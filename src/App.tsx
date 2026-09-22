import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UnitPath } from './components/UnitPath';
import { LessonLearnView } from './components/LessonLearnView';
import { QuizView } from './components/QuizView';
import { RewardModal } from './components/RewardModal';
import { ShopModal } from './components/ShopModal';
import { BadgesModal } from './components/BadgesModal';
import { LevelUpOverlay } from './components/LevelUpOverlay';
import { PipsJournalModal } from './components/PipsJournalModal';
import { LESSON_UNITS } from './data/lessonsData';
import { LessonUnit, UserProgress, AccessoryId } from './types';
import { soundManager, speakEnglish } from './utils/audio';
import { checkLevelUp, ScienceLevel } from './utils/levels';
import { safeStorage } from './utils/storage';

const STORAGE_KEY = 'motionkids_duo_progress_v2';

const INITIAL_PROGRESS: UserProgress = {
  hearts: 5,
  maxHearts: 5,
  gems: 60,
  xp: 10,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedTerms: [],
  completedUnits: [],
  completedQuizzes: [],
  unlockedAccessories: ['none'],
  equippedAccessory: 'none',
  unlockedBadges: ['first_step'],
};

export default function App() {
  // Load saved state or default
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          completedTerms: parsed.completedTerms || [],
        };
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROGRESS;
  });

  // UI Views: 'map' | 'learn' | 'quiz'
  const [currentView, setCurrentView] = useState<'map' | 'learn' | 'quiz'>('map');
  const [activeUnit, setActiveUnit] = useState<LessonUnit>(LESSON_UNITS[0]);
  const [activeTermId, setActiveTermId] = useState<string | undefined>(undefined);

  // Audio & Language Settings
  const [isMuted, setIsMuted] = useState(false);
  const [showSpanishHint, setShowSpanishHint] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  // Claimed Unit Treasure Chests
  const [claimedChests, setClaimedChests] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('motionkids_chests');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Modals
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [rewardData, setRewardData] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    xp: number;
    gems: number;
    accuracy?: number;
  } | null>(null);

  // Jump directly to an interactive science term from Pip's Journal
  const handleJumpToTerm = (unitId: string, termId: string) => {
    const targetUnit = LESSON_UNITS.find((u) => u.id === unitId) || LESSON_UNITS[0];
    setActiveUnit(targetUnit);
    setActiveTermId(termId);
    setCurrentView('learn');
    setIsJournalOpen(false);
  };

  // Screen-overlay animation state when user levels up
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    oldLevel: ScienceLevel;
    newLevel: ScienceLevel;
    rewardGems: number;
    newXP: number;
  } | null>(null);

  // Helper to trigger Level Up Screen-Overlay celebration
  const checkAndApplyLevelUp = (oldXP: number, newXP: number): number => {
    const result = checkLevelUp(oldXP, newXP);
    if (result.leveledUp) {
      setTimeout(() => {
        setLevelUpData({
          isOpen: true,
          oldLevel: result.oldLevel,
          newLevel: result.newLevel,
          rewardGems: result.rewardGems,
          newXP,
        });
      }, 350);
      return result.rewardGems;
    }
    return 0;
  };

  // Persist progress safely across all browsers
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  useEffect(() => {
    try {
      safeStorage.setItem('motionkids_chests', JSON.stringify(claimedChests));
    } catch {
      // Ignore
    }
  }, [claimedChests]);

  // Welcome greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speakEnglish("Hi! I'm Pip the Fox! Welcome to MotionKids! Let's explore how things move!");
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Check and unlock badges based on progress
  const evaluateBadges = (newProgress: UserProgress) => {
    const badges = [...newProgress.unlockedBadges];
    let added = false;

    if (!badges.includes('gravity_star') && newProgress.completedQuizzes.includes('unit-1')) {
      badges.push('gravity_star');
      added = true;
    }
    if (!badges.includes('friction_hero') && newProgress.completedQuizzes.includes('unit-2')) {
      badges.push('friction_hero');
      added = true;
    }
    if (!badges.includes('machine_genius') && newProgress.completedQuizzes.includes('unit-3')) {
      badges.push('machine_genius');
      added = true;
    }
    if (!badges.includes('streak_champ') && (newProgress.streak >= 2 || newProgress.completedQuizzes.length >= 2)) {
      badges.push('streak_champ');
      added = true;
    }
    if (!badges.includes('speed_expert') && newProgress.completedQuizzes.length === 3) {
      badges.push('speed_expert');
      added = true;
    }

    if (added) {
      return { ...newProgress, unlockedBadges: badges };
    }
    return newProgress;
  };

  // 1. Part 1: Learn Terms Clicked (can open specific term step from map)
  const handleSelectLearn = (unit: LessonUnit, termId?: string) => {
    setActiveUnit(unit);
    setActiveTermId(termId);
    setCurrentView('learn');
  };

  // Complete a single term step
  const handleCompleteSingleTerm = (termId: string) => {
    setProgress((prev) => {
      const currentCompleted = prev.completedTerms || [];
      if (currentCompleted.includes(termId)) return prev;

      const earnedXP = 10;
      const newXP = prev.xp + earnedXP;
      const bonusGems = checkAndApplyLevelUp(prev.xp, newXP);

      const updated = {
        ...prev,
        completedTerms: [...currentCompleted, termId],
        xp: newXP,
        gems: prev.gems + 5 + bonusGems,
      };
      return evaluateBadges(updated);
    });
  };

  // 2. Part 2 & 3: Quiz Clicked
  const handleSelectQuiz = (unit: LessonUnit) => {
    setActiveUnit(unit);
    setCurrentView('quiz');
  };

  // Complete Part 1 (Vocabulary Learning)
  const handleCompleteTerms = () => {
    setProgress((prev) => {
      const units = prev.completedUnits.includes(activeUnit.id)
        ? prev.completedUnits
        : [...prev.completedUnits, activeUnit.id];

      const earnedXP = 20;
      const newXP = prev.xp + earnedXP;
      const bonusGems = checkAndApplyLevelUp(prev.xp, newXP);

      const updated = {
        ...prev,
        completedUnits: units,
        xp: newXP,
        gems: prev.gems + 15 + bonusGems,
      };
      return evaluateBadges(updated);
    });

    setRewardData({
      isOpen: true,
      title: 'Science Terms Mastered!',
      subtitle: `You learned all key vocabulary for ${activeUnit.lessonTitle}!`,
      xp: 20,
      gems: 15,
      accuracy: 100,
    });
  };

  // Complete Part 2/3 (Quiz)
  const handleQuizComplete = (score: number, total: number) => {
    const accuracy = Math.round((score / total) * 100);
    const xpBonus = score * 5 + 10;
    const gemsBonus = score >= total ? 25 : 15;

    setProgress((prev) => {
      const quizzes = prev.completedQuizzes.includes(activeUnit.id)
        ? prev.completedQuizzes
        : [...prev.completedQuizzes, activeUnit.id];

      const newXP = prev.xp + xpBonus;
      const bonusGems = checkAndApplyLevelUp(prev.xp, newXP);

      const updated = {
        ...prev,
        completedQuizzes: quizzes,
        xp: newXP,
        gems: prev.gems + gemsBonus + bonusGems,
        streak: prev.streak + 1,
      };
      return evaluateBadges(updated);
    });

    setRewardData({
      isOpen: true,
      title: 'Quiz Complete!',
      subtitle: `You scored ${score} out of ${total} on ${activeUnit.lessonTitle}!`,
      xp: xpBonus,
      gems: gemsBonus,
      accuracy,
    });
  };

  // Claim Chest Reward
  const handleClaimChest = (unitId: string) => {
    if (claimedChests.includes(unitId)) return;

    setClaimedChests((prev) => [...prev, unitId]);
    setProgress((prev) => {
      const earnedXP = 30;
      const newXP = prev.xp + earnedXP;
      const bonusGems = checkAndApplyLevelUp(prev.xp, newXP);

      return {
        ...prev,
        gems: prev.gems + 40 + bonusGems,
        xp: newXP,
      };
    });

    setRewardData({
      isOpen: true,
      title: 'Treasure Chest Unlocked!',
      subtitle: 'Mystery rewards for finishing the whole unit!',
      xp: 30,
      gems: 40,
      accuracy: 100,
    });
  };

  // Heart refill
  const handleRefillHearts = () => {
    setProgress((prev) => ({
      ...prev,
      hearts: prev.maxHearts,
    }));
    soundManager.playCorrect();
    speakEnglish('Full hearts restored! Ready to learn more!');
  };

  const handleLoseHeart = () => {
    setProgress((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  // Shop actions
  const handleBuyAccessory = (accId: AccessoryId, cost: number) => {
    setProgress((prev) => ({
      ...prev,
      gems: prev.gems - cost,
      unlockedAccessories: [...prev.unlockedAccessories, accId],
      equippedAccessory: accId,
    }));
  };

  const handleEquipAccessory = (accId: AccessoryId) => {
    setProgress((prev) => ({
      ...prev,
      equippedAccessory: accId,
    }));
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleResetProgress = () => {
    safeStorage.removeItem('motionkids_duo_progress_v2');
    safeStorage.removeItem('motionkids_duo_progress_v1');
    safeStorage.removeItem('motionkids_chests');
    setProgress(INITIAL_PROGRESS);
    setClaimedChests([]);
    setActiveTermId(undefined);
    setCurrentView('map');
    setShowResetModal(false);
    soundManager.playPop();
    speakEnglish('Adventure restarted! First step is Position!');
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] flex flex-col font-sans text-slate-800">
      {/* Top App Header */}
      <Navbar
        progress={progress}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenJournal={() => setIsJournalOpen(true)}
        showSpanishHint={showSpanishHint}
        onToggleSpanishHint={() => setShowSpanishHint((prev) => !prev)}
        onHeartRefill={handleRefillHearts}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'map' && (
          <UnitPath
            units={LESSON_UNITS}
            progress={progress}
            onSelectLearn={handleSelectLearn}
            onSelectQuiz={handleSelectQuiz}
            onClaimChest={handleClaimChest}
            claimedChests={claimedChests}
            onResetProgress={() => setShowResetModal(true)}
            onOpenJournal={() => setIsJournalOpen(true)}
          />
        )}

        {currentView === 'learn' && (
          <LessonLearnView
            unit={activeUnit}
            initialTermId={activeTermId}
            showSpanishHint={showSpanishHint}
            onCompleteSingleTerm={handleCompleteSingleTerm}
            onCompleteTerms={handleCompleteTerms}
            onBackToMap={() => setCurrentView('map')}
            accessory={progress.equippedAccessory}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView
            unit={activeUnit}
            hearts={progress.hearts}
            onLoseHeart={handleLoseHeart}
            onRefillHearts={handleRefillHearts}
            onQuizComplete={handleQuizComplete}
            onExit={() => setCurrentView('map')}
            showSpanishHint={showSpanishHint}
            accessory={progress.equippedAccessory}
          />
        )}
      </main>

      {/* Celebration Reward Modal */}
      {rewardData?.isOpen && (
        <RewardModal
          title={rewardData.title}
          subtitle={rewardData.subtitle}
          xpEarned={rewardData.xp}
          gemsEarned={rewardData.gems}
          accuracyPercent={rewardData.accuracy}
          accessory={progress.equippedAccessory}
          onContinue={() => {
            setRewardData(null);
            setCurrentView('map');
          }}
        />
      )}

      {/* Screen-Overlay Animation: Science Level Up Celebration for 7-year-olds */}
      {levelUpData?.isOpen && (
        <LevelUpOverlay
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          rewardGems={levelUpData.rewardGems}
          newXP={levelUpData.newXP}
          accessory={progress.equippedAccessory}
          showSpanishHint={showSpanishHint}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* Pip's Closet Shop Modal */}
      {isShopOpen && (
        <ShopModal
          progress={progress}
          onBuyAccessory={handleBuyAccessory}
          onEquipAccessory={handleEquipAccessory}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* Trophies & Badges Modal */}
      {isBadgesOpen && (
        <BadgesModal
          progress={progress}
          onClose={() => setIsBadgesOpen(false)}
        />
      )}

      {/* Pip's Science Field Journal Modal */}
      {isJournalOpen && (
        <PipsJournalModal
          progress={progress}
          showSpanishHint={showSpanishHint}
          onClose={() => setIsJournalOpen(false)}
          onJumpToTerm={handleJumpToTerm}
        />
      )}

      {/* Restart Map Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-amber-300 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
              📍
            </div>
            <h3 className="text-xl font-black text-slate-800">
              Start from Position?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
              ¿Quieres reiniciar el mapa desde el primer paso (<strong>Position</strong>)? Todos los demás pasos volverán a bloquearse para que avances paso a paso.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition border-b-3 border-slate-300 active:translate-y-0.5"
              >
                Cancel
              </button>
              <button
                onClick={handleResetProgress}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl transition border-b-3 border-rose-700 active:translate-y-0.5 shadow-md"
              >
                Restart 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
