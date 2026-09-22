import React from 'react';
import { motion } from 'motion/react';
import { LessonUnit, UserProgress } from '../types';
import { MascotPip } from './MascotPip';
import { soundManager, speakEnglish } from '../utils/audio';
import { getLevelStatus } from '../utils/levels';
import { Check, Lock, Star, Sparkles, BookOpen, Gift, Trophy, RotateCcw } from 'lucide-react';

interface UnitPathProps {
  units: LessonUnit[];
  progress: UserProgress;
  onSelectLearn: (unit: LessonUnit, termId?: string) => void;
  onSelectQuiz: (unit: LessonUnit) => void;
  onClaimChest: (unitId: string) => void;
  claimedChests: string[];
  onResetProgress?: () => void;
  onOpenJournal?: () => void;
}

interface PathNode {
  id: string;
  type: 'term' | 'quiz' | 'chest';
  unit: LessonUnit;
  termId?: string;
  title: string;
  subtitle: string;
  icon: string | React.ReactNode;
  isCompleted: boolean;
  isUnlocked: boolean;
  isActive: boolean;
  offsetClass: string;
}

export const UnitPath: React.FC<UnitPathProps> = ({
  units,
  progress,
  onSelectLearn,
  onSelectQuiz,
  onClaimChest,
  claimedChests,
  onResetProgress,
  onOpenJournal,
}) => {
  const completedTerms = progress.completedTerms || [];

  const isTermDone = (termId: string) => completedTerms.includes(termId);
  const isQuizDone = (unitId: string) => progress.completedQuizzes.includes(unitId);
  const isChestDone = (unitId: string) => claimedChests.includes(unitId);

  // 1. Completion status of every step in the entire adventure
  const posDone = isTermDone('position');
  const motDone = isTermDone('motion');
  const gravDone = isTermDone('gravity');
  const q1Done = isQuizDone('unit-1');
  const chest1Done = isChestDone('unit-1');

  const forceDone = isTermDone('force');
  const pushDone = isTermDone('push_pull');
  const fricDone = isTermDone('friction');
  const q2Done = isQuizDone('unit-2');
  const chest2Done = isChestDone('unit-2');

  const speedDone = isTermDone('speed_distance');
  const rampDone = isTermDone('ramp');
  const leverDone = isTermDone('lever');
  const pulleyDone = isTermDone('pulley');
  const q3Done = isQuizDone('unit-3');
  const chest3Done = isChestDone('unit-3');

  // 2. Strict sequential unlock rules: ONLY the very first step (position) starts unlocked!
  // Each subsequent step unlocks ONLY when the immediately preceding step is completed!
  const nodeUnlockMap: Record<string, boolean> = {
    // Unit 1
    'unit-1-term-position': true, // Step 1: ALWAYS unlocked initially!
    'unit-1-term-motion': posDone, // Step 2: Unlocks ONLY when position is done!
    'unit-1-term-gravity': motDone, // Step 3: Unlocks ONLY when motion is done!
    'unit-1-quiz': gravDone, // Step 4: Unlocks ONLY when gravity is done!
    'unit-1-chest': q1Done, // Step 5: Unlocks ONLY when quiz 1 is passed!

    // Unit 2
    'unit-2-term-force': q1Done, // Step 6: Unlocks ONLY when Unit 1 quiz is passed!
    'unit-2-term-push_pull': forceDone, // Step 7: Unlocks ONLY when force is done!
    'unit-2-term-friction': pushDone, // Step 8: Unlocks ONLY when push_pull is done!
    'unit-2-quiz': fricDone, // Step 9: Unlocks ONLY when friction is done!
    'unit-2-chest': q2Done, // Step 10: Unlocks ONLY when quiz 2 is passed!

    // Unit 3
    'unit-3-term-speed_distance': q2Done, // Step 11: Unlocks ONLY when Unit 2 quiz is passed!
    'unit-3-term-ramp': speedDone, // Step 12: Unlocks ONLY when speed is done!
    'unit-3-term-lever': rampDone, // Step 13: Unlocks ONLY when ramp is done!
    'unit-3-term-pulley': leverDone, // Step 14: Unlocks ONLY when lever is done!
    'unit-3-quiz': pulleyDone, // Step 15: Unlocks ONLY when pulley is done!
    'unit-3-chest': q3Done, // Step 16: Unlocks ONLY when quiz 3 is passed!
  };

  // Build the complete list of nodes
  const allNodes: PathNode[] = [];
  let foundFirstIncomplete = false;

  units.forEach((unit) => {
    // Term nodes
    unit.terms.forEach((term) => {
      const nodeId = `${unit.id}-term-${term.id}`;
      const isDone = isTermDone(term.id);
      const isUnlocked = !!nodeUnlockMap[nodeId];

      const isActive = isUnlocked && !isDone && !foundFirstIncomplete;
      if (isActive) foundFirstIncomplete = true;

      const offsetIndex = allNodes.length % 4;
      const offsetClass =
        offsetIndex === 1
          ? 'translate-x-6 sm:translate-x-10'
          : offsetIndex === 3
          ? '-translate-x-6 sm:-translate-x-10'
          : 'translate-x-0';

      allNodes.push({
        id: nodeId,
        type: 'term',
        unit,
        termId: term.id,
        title: term.word,
        subtitle: term.spanishTranslation,
        icon:
          term.interactiveType === 'push_pull'
            ? '🛒'
            : term.interactiveType === 'friction_road'
            ? '🚴'
            : term.interactiveType === 'gravity_drop'
            ? '🌍'
            : term.interactiveType === 'lever_seesaw'
            ? '⚖️'
            : term.interactiveType === 'ramp_box'
            ? '📐'
            : term.interactiveType === 'pulley_flag'
            ? '🚩'
            : '📍',
        isCompleted: isDone,
        isUnlocked,
        isActive,
        offsetClass,
      });
    });

    // Quiz node
    const quizNodeId = `${unit.id}-quiz`;
    const quizDone = isQuizDone(unit.id);
    const quizUnlocked = !!nodeUnlockMap[quizNodeId];
    const isQuizActive = quizUnlocked && !quizDone && !foundFirstIncomplete;
    if (isQuizActive) foundFirstIncomplete = true;

    allNodes.push({
      id: quizNodeId,
      type: 'quiz',
      unit,
      title: `Unit ${unit.unitNumber} Quiz`,
      subtitle: 'Pass to unlock next unit!',
      icon: <Star className="w-8 h-8 fill-amber-300 text-amber-500" />,
      isCompleted: quizDone,
      isUnlocked: quizUnlocked,
      isActive: isQuizActive,
      offsetClass: 'translate-x-4 sm:translate-x-6',
    });

    // Chest node
    const chestNodeId = `${unit.id}-chest`;
    const chestClaimed = isChestDone(unit.id);
    const chestUnlocked = !!nodeUnlockMap[chestNodeId];
    const isChestActive = chestUnlocked && !chestClaimed && !foundFirstIncomplete;
    if (isChestActive) foundFirstIncomplete = true;

    allNodes.push({
      id: chestNodeId,
      type: 'chest',
      unit,
      title: unit.id === 'unit-3' ? 'Grand Champion Trophy' : `Unit ${unit.unitNumber} Chest`,
      subtitle: chestClaimed ? 'Claimed Prize' : 'Mystery Reward & Gems!',
      icon: chestClaimed ? '📭' : unit.id === 'unit-3' ? '👑' : '🎁',
      isCompleted: chestClaimed,
      isUnlocked: chestUnlocked,
      isActive: isChestActive,
      offsetClass: '-translate-x-4 sm:-translate-x-6',
    });
  });

  const levelStatus = getLevelStatus(progress.xp);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col items-center select-none">
      {/* Duolingo Hero Chapter Banner */}
      <div className="w-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl mb-6 border-b-6 border-orange-600">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full w-fit mb-1.5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>Science Grade 2 • Chapter 12</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-sm">
              Objects in Motion
            </h2>
            <p className="text-orange-100 text-xs sm:text-sm font-bold mt-1 max-w-xs">
              Start at <strong className="text-white underline">Position</strong>! Unlock each step as you explore with Pip!
            </p>
          </div>
          <div className="flex-shrink-0">
            <MascotPip
              mood="celebrating"
              accessory={progress.equippedAccessory}
              size="md"
            />
          </div>
        </div>

        {/* Science Level Progress in Adventure Map */}
        <div className="mt-4 pt-3 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">{levelStatus.currentLevel.icon}</span>
            <div>
              <span className="text-[10px] font-black text-amber-100 uppercase tracking-wider block leading-none">
                Science Level {levelStatus.currentLevel.level}
              </span>
              <span className="text-sm font-black text-white leading-tight">
                {levelStatus.currentLevel.title}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-48 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-bold text-orange-100">
              <span>{progress.xp} XP Total</span>
              {levelStatus.nextLevel && (
                <span>+{levelStatus.xpToNext} XP to Level {levelStatus.nextLevel.level}</span>
              )}
            </div>
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full bg-yellow-300 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${levelStatus.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Row: Pip's Field Journal & Reset Button */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-5 px-1">
        {onOpenJournal && (
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenJournal();
            }}
            className="w-full sm:w-auto flex-1 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-2 border-amber-300 hover:border-amber-400 px-4 py-2.5 rounded-2xl shadow-xs transition active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-inner">
                📖
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm font-black text-amber-950 block leading-tight">
                  Pip's Science Journal
                </span>
                <span className="text-[11px] font-bold text-amber-700 block">
                  {completedTerms.length} of 10 Concepts Mastered • Tap to Review Cards
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-amber-600 bg-white px-2.5 py-1 rounded-xl border border-amber-200 shadow-2xs">
              Open ➔
            </span>
          </button>
        )}

        {/* Reset to Step 1 Button (for Parent / Testing) */}
        {onResetProgress && (
          <button
            onClick={onResetProgress}
            className="text-[11px] font-bold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer self-end sm:self-center"
            title="Start from the beginning (Position)"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart Map</span>
          </button>
        )}
      </div>

      {/* Course Progression Trail */}
      <div className="w-full relative flex flex-col items-center">
        {/* Continuous Winding Background Path Line */}
        <div className="absolute top-16 bottom-20 w-4 bg-slate-200 rounded-full -z-10 shadow-inner" />
        <div className="absolute top-16 bottom-20 w-1.5 bg-emerald-300/60 rounded-full -z-10" />

        {/* Group Nodes by Unit for clear chapter headers */}
        {units.map((unit) => {
          const unitNodes = allNodes.filter((n) => n.unit.id === unit.id);
          const isUnitPassed = isQuizDone(unit.id);
          const isUnitStarted = unitNodes.some((n) => n.isUnlocked);

          return (
            <div key={unit.id} className="w-full flex flex-col items-center mb-10">
              {/* Unit Chapter Milestone Header */}
              <div
                className={`w-full rounded-2xl p-4 text-white shadow-lg mb-8 border-b-4 flex items-center justify-between transition-all ${
                  !isUnitStarted
                    ? 'bg-slate-400 border-slate-500 opacity-75'
                    : unit.id === 'unit-1'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-700'
                    : unit.id === 'unit-2'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-700'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 border-sky-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-white/90 bg-black/15 px-2 py-0.5 rounded-full">
                      Unit {unit.unitNumber}
                    </span>
                    {isUnitPassed ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" /> Completed!
                      </span>
                    ) : !isUnitStarted ? (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 text-white/90 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 text-white px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black mt-1">{unit.lessonTitle}</h3>
                  <span className="text-xs text-white/90 font-medium">
                    {unit.lessonSubtitle}
                  </span>
                </div>
                <span className="text-3xl filter drop-shadow">{unit.icon}</span>
              </div>

              {/* Stepping Stones on the Trail */}
              <div className="w-full flex flex-col items-center space-y-7">
                {unitNodes.map((node) => {
                  return (
                    <div
                      key={node.id}
                      className={`relative flex flex-col items-center ${node.offsetClass} transition-transform duration-300`}
                    >
                      {/* Pip the Fox positioned next to the ACTIVE step */}
                      {node.isActive && (
                        <div className="absolute -top-12 -left-26 sm:-left-30 z-30 pointer-events-none">
                          <MascotPip
                            mood="waving"
                            accessory={progress.equippedAccessory}
                            size="sm"
                            speechBubble={
                              node.id === 'unit-1-term-position'
                                ? 'Start here! 📍'
                                : node.type === 'term'
                                ? `Next: ${node.title}! 🚀`
                                : node.type === 'quiz'
                                ? 'Quiz time! ⭐'
                                : 'Open reward! 🎁'
                            }
                          />
                        </div>
                      )}

                      {/* Main Stepping Stone Button */}
                      <motion.button
                        whileHover={node.isUnlocked ? { scale: 1.08 } : {}}
                        whileTap={node.isUnlocked ? { scale: 0.94 } : {}}
                        disabled={!node.isUnlocked}
                        onClick={() => {
                          if (!node.isUnlocked) {
                            soundManager.playPop();
                            speakEnglish('This step is locked! Complete the previous step to unlock it!');
                            return;
                          }

                          if (node.type === 'term') {
                            soundManager.playPop();
                            onSelectLearn(node.unit, node.termId);
                          } else if (node.type === 'quiz') {
                            soundManager.playPop();
                            onSelectQuiz(node.unit);
                          } else if (node.type === 'chest') {
                            soundManager.playChest();
                            onClaimChest(node.unit.id);
                          }
                        }}
                        className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full border-b-6 flex flex-col items-center justify-center transition-all shadow-xl relative cursor-pointer ${
                          !node.isUnlocked
                            ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-80 shadow-none'
                            : node.isCompleted
                            ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-emerald-800 text-white'
                            : node.isActive
                            ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-700 text-amber-950 ring-4 ring-amber-300 ring-offset-2 animate-bounce'
                            : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                        }`}
                      >
                        {/* Icon or Status */}
                        {node.isCompleted ? (
                          <div className="flex flex-col items-center">
                            <Check className="w-8 h-8 stroke-[3.5] text-white drop-shadow" />
                          </div>
                        ) : !node.isUnlocked ? (
                          <div className="flex flex-col items-center">
                            <Lock className="w-7 h-7 text-slate-500" />
                          </div>
                        ) : typeof node.icon === 'string' ? (
                          <span className="text-3xl filter drop-shadow">{node.icon}</span>
                        ) : (
                          node.icon
                        )}

                        {/* Pulsing indicator on active */}
                        {node.isActive && (
                          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 border-2 border-white text-white text-[10px] font-black flex items-center justify-center shadow">
                            ⚡
                          </span>
                        )}
                      </motion.button>

                      {/* Step Text Label Below Stone */}
                      <div className="flex flex-col items-center mt-2 max-w-[130px] text-center">
                        <span
                          className={`text-xs font-black tracking-tight ${
                            node.isActive
                              ? 'text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-sm'
                              : node.isCompleted
                              ? 'text-emerald-800 font-extrabold'
                              : node.isUnlocked
                              ? 'text-slate-800 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {node.title}
                        </span>
                        {node.subtitle && (
                          <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[110px]">
                            {node.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Trophy Footer */}
      <div className="w-full text-center mt-4 p-4 bg-white/70 rounded-2xl border-2 border-slate-200">
        <p className="text-xs font-bold text-slate-500">
          🏆 Complete all 3 units to unlock the Science Grand Master Crown!
        </p>
      </div>
    </div>
  );
};
