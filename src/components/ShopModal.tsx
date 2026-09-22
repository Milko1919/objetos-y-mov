import React from 'react';
import { motion } from 'motion/react';
import { ACCESSORIES } from '../data/lessonsData';
import { AccessoryId, UserProgress } from '../types';
import { MascotPip } from './MascotPip';
import { soundManager, speakEnglish } from '../utils/audio';
import { X, Check, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShopModalProps {
  progress: UserProgress;
  onBuyAccessory: (accId: AccessoryId, cost: number) => void;
  onEquipAccessory: (accId: AccessoryId) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  progress,
  onBuyAccessory,
  onEquipAccessory,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-5 md:p-6 max-w-lg w-full border-4 border-amber-300 shadow-2xl relative max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Pip's Science Closet
              </h3>
              <p className="text-xs font-bold text-slate-400">
                Dress up Pip with your earned Motion Gems!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl text-sky-600 font-black text-sm">
              <span>💎</span>
              <span>{progress.gems}</span>
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
        </div>

        {/* Live Pip Avatar Preview */}
        <div className="py-4 bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl my-3 flex flex-col items-center justify-center border border-amber-200">
          <MascotPip
            mood="happy"
            accessory={progress.equippedAccessory}
            size="lg"
            speechBubble="How do I look, scientist?"
          />
          <span className="mt-2 text-xs font-black text-orange-950 uppercase tracking-wide">
            Currently Wearing: {ACCESSORIES.find(a => a.id === progress.equippedAccessory)?.name}
          </span>
        </div>

        {/* Accessory Cards Grid */}
        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {ACCESSORIES.map((item) => {
            const isUnlocked = progress.unlockedAccessories.includes(item.id as AccessoryId);
            const isEquipped = progress.equippedAccessory === item.id;
            const canAfford = progress.gems >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                  isEquipped
                    ? 'bg-amber-50 border-amber-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                      {item.name}
                      {isEquipped && (
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-md">
                          Equipped
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  {isEquipped ? (
                    <button
                      disabled
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl flex items-center gap-1 cursor-default"
                    >
                      <Check className="w-4 h-4" />
                      Active
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        soundManager.playPop();
                        onEquipAccessory(item.id as AccessoryId);
                        speakEnglish(`Equipped ${item.name}! Looking great!`);
                      }}
                      className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl border-b-3 border-sky-700 active:translate-y-0.5 transition cursor-pointer"
                    >
                      Equip
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          soundManager.playVictory();
                          confetti({ particleCount: 40, spread: 50 });
                          onBuyAccessory(item.id as AccessoryId, item.cost);
                          speakEnglish(`Awesome! You unlocked ${item.name}!`);
                        }
                      }}
                      className={`px-3 py-1.5 font-black text-xs rounded-xl border-b-3 flex items-center gap-1 transition ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-600 active:translate-y-0.5 cursor-pointer'
                          : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <span>💎</span>
                      <span>{item.cost}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
