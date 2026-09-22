import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager, speakEnglish } from '../utils/audio';

interface SimProps {
  type:
    | 'position_room'
    | 'swing'
    | 'gravity_drop'
    | 'force_energy'
    | 'push_pull'
    | 'friction_road'
    | 'ramp_box'
    | 'lever_seesaw'
    | 'pulley_flag';
}

export const InteractiveSim: React.FC<SimProps> = ({ type }) => {
  // 1. Position Room State
  const [ballPos, setBallPos] = useState<'desk' | 'under' | 'bed' | 'shelf' | 'next_to'>('desk');

  // 2. Swing / Carousel State
  const [motionType, setMotionType] = useState<'swing' | 'circle' | 'straight'>('swing');

  // 3. Gravity Drop State
  const [gravityZone, setGravityZone] = useState<'earth' | 'space'>('earth');
  const [appleDropped, setAppleDropped] = useState(false);

  // 4. Force & Energy State
  const [energyLevel, setEnergyLevel] = useState<'none' | 'small' | 'huge'>('none');

  // 5. Push & Pull State
  const [cartAction, setCartAction] = useState<'idle' | 'push' | 'pull'>('idle');

  // 6. Friction Road State
  const [surface, setSurface] = useState<'cement' | 'grass' | 'gravel'>('cement');
  const [isBraking, setIsBraking] = useState(false);

  // 7. Ramp State
  const [rampMode, setRampMode] = useState<'straight_lift' | 'with_ramp'>('with_ramp');

  // 8. Lever See-Saw State
  const [leverSide, setLeverSide] = useState<'neutral' | 'left_down' | 'right_down'>('neutral');

  // 9. Pulley Flagpole State
  const [flagHeight, setFlagHeight] = useState(25); // 10% to 90%

  /* =========================================================================
     1. POSITION ROOM (BEDROOM: ON DESK, UNDER DESK, ON BED, ON SHELF)
     ========================================================================= */
  if (type === 'position_room') {
    const handlePickPos = (pos: 'desk' | 'under' | 'bed' | 'shelf' | 'next_to', desc: string) => {
      soundManager.playPop();
      setBallPos(pos);
      speakEnglish(`The soccer ball is ${desc}!`);
    };

    const ballCoordinates = {
      bed: { cx: 135, cy: 220, shadowX: 135, shadowY: 232, label: 'ON TOP OF THE BED' },
      desk: { cx: 440, cy: 195, shadowX: 440, shadowY: 206, label: 'ON TOP OF THE DESK' },
      under: { cx: 440, cy: 300, shadowX: 440, shadowY: 318, label: 'UNDER THE DESK' },
      shelf: { cx: 440, cy: 75, shadowX: 440, shadowY: 86, label: 'ABOVE ON THE SHELF' },
      next_to: { cx: 250, cy: 305, shadowX: 250, shadowY: 320, label: 'NEXT TO THE BED' },
    };

    const currentCoord = ballCoordinates[ballPos];

    return (
      <div className="bg-gradient-to-b from-amber-50/90 to-sky-50/90 rounded-3xl p-4 md:p-5 border-3 border-amber-300 text-center my-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-base shadow">
              📍
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                Where is the ball? (Position & Location)
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Tap the bed, desk, under desk, or buttons below!
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-800 rounded-full border border-sky-300 shadow-xs hidden sm:inline-block">
            {currentCoord.label}
          </span>
        </div>

        {/* Vector Bedroom SVG */}
        <div className="relative w-full rounded-2xl border-3 border-amber-300/80 shadow-lg overflow-hidden bg-[#eaf4fc]">
          <svg viewBox="0 0 600 360" className="w-full h-auto block select-none">
            <defs>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dcedf7" />
                <stop offset="100%" stopColor="#dfeef8" />
              </linearGradient>
              <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d49b5c" />
                <stop offset="100%" stopColor="#a97033" />
              </linearGradient>
              <linearGradient id="bedWood" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a75b22" />
                <stop offset="100%" stopColor="#632e07" />
              </linearGradient>
              <linearGradient id="deskWood" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e2aa68" />
                <stop offset="100%" stopColor="#aa6f30" />
              </linearGradient>
              <linearGradient id="duvetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4fc3f7" />
                <stop offset="100%" stopColor="#01579b" />
              </linearGradient>
              <radialGradient id="ballShine" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#e0e0e0" />
                <stop offset="100%" stopColor="#9e9e9e" />
              </radialGradient>
            </defs>

            {/* Back wall & baseboard */}
            <rect x="0" y="0" width="600" height="260" fill="url(#wallGrad)" />
            <rect x="0" y="254" width="600" height="8" fill="#ffffff" />
            <rect x="0" y="260" width="600" height="6" fill="#8d5621" />

            {/* Sunny window */}
            <g transform="translate(240, 25)">
              <rect x="0" y="0" width="110" height="110" rx="8" fill="#ffffff" stroke="#90a4ae" strokeWidth="3" />
              <rect x="8" y="8" width="94" height="94" rx="4" fill="#81d4fa" />
              <circle cx="28" cy="28" r="14" fill="#ffeb3b" />
              <line x1="55" y1="8" x2="55" y2="102" stroke="#ffffff" strokeWidth="4" />
              <line x1="8" y1="55" x2="102" y2="55" stroke="#ffffff" strokeWidth="4" />
            </g>

            {/* Floor */}
            <rect x="0" y="266" width="600" height="94" fill="url(#floorGrad)" />
            <ellipse cx="260" cy="315" rx="65" ry="22" fill="#fff9c4" stroke="#fbc02d" strokeWidth="2.5" strokeDasharray="5 3" />

            {/* Kid's Bed */}
            <g id="kid-bed" className="cursor-pointer" onClick={() => handlePickPos('bed', 'on top of the bed')}>
              <ellipse cx="120" cy="328" rx="100" ry="14" fill="#422108" opacity="0.4" />
              <rect x="18" y="120" width="12" height="180" rx="4" fill="url(#bedWood)" stroke="#4a1f04" strokeWidth="1.5" />
              <rect x="206" y="150" width="12" height="150" rx="4" fill="url(#bedWood)" stroke="#4a1f04" strokeWidth="1.5" />
              <rect x="26" y="135" width="184" height="60" rx="6" fill="url(#bedWood)" stroke="#4a1f04" strokeWidth="2" />
              <rect x="28" y="275" width="10" height="45" rx="2" fill="url(#bedWood)" stroke="#4a1f04" strokeWidth="1.5" />
              <rect x="198" y="275" width="10" height="45" rx="2" fill="url(#bedWood)" stroke="#4a1f04" strokeWidth="1.5" />
              <rect x="22" y="262" width="192" height="18" rx="3" fill="url(#bedWood)" stroke="#4a1f04" strokeWidth="2" />
              <rect x="26" y="246" width="184" height="20" rx="5" fill="#f5f5f5" stroke="#cfd8dc" strokeWidth="2" />
              <ellipse cx="66" cy="226" rx="26" ry="14" fill="#ffffff" stroke="#b0bec5" strokeWidth="2" />
              <path d="M 80 220 Q 150 205 204 218 L 208 268 L 76 268 Z" fill="url(#duvetGrad)" stroke="#01579b" strokeWidth="2.5" />
              <rect x="70" y="172" width="94" height="20" rx="10" fill="#ffffff" stroke="#0288d1" strokeWidth="2" />
              <text x="117" y="186" fontSize="10" fontWeight="900" fill="#0277bd" textAnchor="middle">🛏️ KID'S BED</text>
            </g>

            {/* Wall Shelf */}
            <g id="wall-shelf" className="cursor-pointer" onClick={() => handlePickPos('shelf', 'above the desk on the shelf')}>
              <rect x="360" y="94" width="165" height="14" rx="3" fill="#8d4b1a" stroke="#4e2608" strokeWidth="2" />
              <rect x="375" y="58" width="12" height="36" rx="2" fill="#e53935" />
              <rect x="389" y="52" width="14" height="42" rx="2" fill="#43a047" />
              <rect x="405" y="56" width="12" height="38" rx="2" fill="#1e88e5" />
              <rect x="400" y="28" width="88" height="18" rx="9" fill="#ffffff" stroke="#8d4b1a" strokeWidth="1.5" />
              <text x="444" y="41" fontSize="9" fontWeight="900" fill="#6d350d" textAnchor="middle">📚 WALL SHELF</text>
            </g>

            {/* Study Desk */}
            <g id="study-desk" className="cursor-pointer" onClick={() => handlePickPos('desk', 'on top of the desk')}>
              <ellipse cx="445" cy="330" rx="95" ry="14" fill="#422108" opacity="0.38" />
              <rect x="350" y="222" width="12" height="96" rx="3" fill="url(#bedWood)" stroke="#522505" strokeWidth="2" />
              <rect x="460" y="222" width="70" height="94" rx="4" fill="url(#deskWood)" stroke="#522505" strokeWidth="2" />
              <rect x="464" y="226" width="62" height="40" rx="3" fill="#df9e57" stroke="#8d4c15" strokeWidth="1.5" />
              <circle cx="495" cy="246" r="4.5" fill="#ffd54f" />
              <rect x="464" y="270" width="62" height="42" rx="3" fill="#df9e57" stroke="#8d4c15" strokeWidth="1.5" />
              <circle cx="495" cy="291" r="4.5" fill="#ffd54f" />
              <rect x="335" y="208" width="205" height="18" rx="4" fill="url(#deskWood)" stroke="#4e2406" strokeWidth="2.5" />
              <rect x="390" y="212" width="102" height="18" rx="9" fill="#ffffff" stroke="#e65100" strokeWidth="1.5" />
              <text x="441" y="225" fontSize="9" fontWeight="900" fill="#bf360c" textAnchor="middle">🖥️ STUDY DESK</text>
            </g>

            {/* Under Desk Target */}
            <g className="cursor-pointer" onClick={() => handlePickPos('under', 'under the desk')}>
              <rect x="382" y="278" width="76" height="16" rx="8" fill="#fff3e0" stroke="#ff9800" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="420" y="290" fontSize="8" fontWeight="bold" fill="#e65100" textAnchor="middle">UNDER DESK ⬇️</text>
            </g>

            {/* Animated Soccer Ball */}
            <motion.ellipse
              animate={{ cx: currentCoord.shadowX, cy: currentCoord.shadowY }}
              transition={{ duration: 0.4 }}
              rx="18"
              ry="6"
              fill="#1b0000"
              opacity="0.38"
            />
            <motion.g
              animate={{ x: currentCoord.cx - 20, y: currentCoord.cy - 20 }}
              transition={{ duration: 0.4 }}
            >
              <circle cx="20" cy="20" r="18" fill="url(#ballShine)" stroke="#212121" strokeWidth="2.2" />
              <polygon points="20,13 26,17 24,24 16,24 14,17" fill="#212121" />
            </motion.g>
          </svg>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3.5">
          <button
            onClick={() => handlePickPos('desk', 'on top of the study desk')}
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all border-b-4 ${
              ballPos === 'desk' ? 'bg-sky-500 text-white border-sky-700 shadow-md' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            🖥️ On Desk
          </button>
          <button
            onClick={() => handlePickPos('under', 'under the study desk')}
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all border-b-4 ${
              ballPos === 'under' ? 'bg-amber-500 text-white border-amber-700 shadow-md' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            ⬇️ Under Desk
          </button>
          <button
            onClick={() => handlePickPos('bed', 'on top of the bed')}
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all border-b-4 ${
              ballPos === 'bed' ? 'bg-sky-500 text-white border-sky-700 shadow-md' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            🛏️ On Bed
          </button>
          <button
            onClick={() => handlePickPos('shelf', 'above the desk on the shelf')}
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all border-b-4 ${
              ballPos === 'shelf' ? 'bg-purple-500 text-white border-purple-700 shadow-md' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            📚 On Shelf
          </button>
          <button
            onClick={() => handlePickPos('next_to', 'next to the bed')}
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all border-b-4 col-span-2 sm:col-span-1 ${
              ballPos === 'next_to' ? 'bg-emerald-500 text-white border-emerald-700 shadow-md' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            ↔️ Next to Bed
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. GRAVITY DROP SIMULATION (EARTH PULL VS SPACE FLOATING!)
     ========================================================================= */
  if (type === 'gravity_drop') {
    const handleDrop = () => {
      soundManager.playPop();
      setAppleDropped(false);
      setTimeout(() => {
        setAppleDropped(true);
        if (gravityZone === 'earth') {
          soundManager.playCorrect();
          speakEnglish('Whoosh! Gravity pulls the apple down to Earth! Thud on the ground!');
        } else {
          speakEnglish('In outer space, there is no strong gravity! The apple floats in the air!');
        }
      }, 50);
    };

    return (
      <div className="bg-gradient-to-b from-purple-50 to-indigo-50 rounded-3xl p-4 md:p-5 border-3 border-purple-300 text-center my-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-base shadow">
              🌍
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                What is Gravity? (Earth's Invisible Pull!)
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Earth pulls everything DOWN unless something holds it up!
              </p>
            </div>
          </div>

          <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-900 rounded-full border border-purple-300 hidden sm:inline-block">
            {gravityZone === 'earth' ? '🌍 ON EARTH (Strong Pull)' : '🚀 IN SPACE (Zero Gravity)'}
          </span>
        </div>

        {/* Gravity Stage */}
        <div
          className={`relative h-52 w-full rounded-2xl border-3 shadow-lg overflow-hidden transition-colors duration-500 flex flex-col justify-between p-3 ${
            gravityZone === 'earth'
              ? 'bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 border-purple-300'
              : 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 border-indigo-500'
          }`}
        >
          {gravityZone === 'earth' ? (
            <>
              {/* Earth Cloud and Sun */}
              <div className="flex justify-between items-start px-2">
                <div className="text-2xl">☀️</div>
                <div className="text-xl text-white">☁️ ☁️</div>
              </div>

              {/* Pulsing Gravity Arrows pointing down */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                <div className="text-purple-700 font-black text-xs uppercase tracking-widest animate-bounce">
                  ⬇️ INVISIBLE GRAVITY PULL ⬇️
                </div>
                <div className="w-1 h-20 bg-purple-500/50 rounded-full" />
              </div>

              {/* Earth Grass Floor */}
              <div className="w-full h-8 bg-emerald-600 border-t-3 border-emerald-700 rounded-b-xl flex items-center justify-center text-[10px] font-black text-emerald-100">
                🌱 EARTH'S SURFACE (Ground)
              </div>
            </>
          ) : (
            <>
              {/* Stars in Space */}
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-4 left-8 text-yellow-200 text-xs">★</span>
                <span className="absolute top-12 right-12 text-yellow-100 text-xs">✦</span>
                <span className="absolute bottom-16 left-24 text-white text-xs">★</span>
                <span className="absolute top-8 right-32 text-indigo-300 text-xs">★</span>
              </div>
              <div className="flex justify-between items-start px-2 z-10">
                <div className="bg-indigo-900/80 text-indigo-200 text-[10px] font-black px-2.5 py-1 rounded-full border border-indigo-400">
                  Zero Gravity: Floating in Outer Space!
                </div>
                <div className="text-2xl">🪐</div>
              </div>
              <div className="w-full h-6 bg-slate-800/60 rounded-b-xl flex items-center justify-center text-[9px] font-bold text-slate-400">
                NO GROUND HERE (Objects Float Forever!)
              </div>
            </>
          )}

          {/* Animated Dropping / Floating Apple */}
          <motion.div
            key={`${gravityZone}-${appleDropped}`}
            initial={{ y: 20, x: 120 }}
            animate={
              gravityZone === 'earth'
                ? {
                    y: appleDropped ? 128 : 20,
                    x: 120,
                  }
                : {
                    y: appleDropped ? [20, 60, 20] : 20,
                    x: appleDropped ? [120, 150, 120] : 120,
                  }
            }
            transition={
              gravityZone === 'earth'
                ? { duration: 0.5, ease: 'easeIn' }
                : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
            }
            className="absolute top-6 left-1/2 -ml-6 flex flex-col items-center select-none"
          >
            <span className="text-4xl filter drop-shadow">🍎</span>
            {appleDropped && gravityZone === 'earth' && (
              <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full text-purple-900 border border-purple-300 shadow -mt-1">
                💥 THUD! Pulled Down!
              </span>
            )}
            {gravityZone === 'space' && appleDropped && (
              <span className="text-[10px] font-black bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400 -mt-1">
                🛸 Floating in air!
              </span>
            )}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => {
              soundManager.playPop();
              setGravityZone('earth');
              setAppleDropped(false);
            }}
            className={`py-2 rounded-2xl text-xs font-black border-b-4 transition ${
              gravityZone === 'earth'
                ? 'bg-purple-600 text-white border-purple-800 shadow'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            🌍 On Earth (Pull Down)
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setGravityZone('space');
              setAppleDropped(false);
            }}
            className={`py-2 rounded-2xl text-xs font-black border-b-4 transition ${
              gravityZone === 'space'
                ? 'bg-indigo-600 text-white border-indigo-800 shadow'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            🚀 In Space (Zero Gravity)
          </button>
        </div>

        <button
          onClick={handleDrop}
          className="mt-2.5 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-2xl border-b-4 border-emerald-700 active:translate-y-0.5 shadow flex items-center justify-center gap-2"
        >
          <span>🍎 Let Go of the Apple (Watch Gravity Pull!)</span>
        </button>
      </div>
    );
  }

  /* =========================================================================
     3. FORCE & ENERGY (ENERGY BATTERY & POWER SURGE KICK)
     ========================================================================= */
  if (type === 'force_energy') {
    const handleTriggerForce = (level: 'small' | 'huge') => {
      soundManager.playPop();
      setEnergyLevel(level);
      if (level === 'small') {
        speakEnglish('Small push gives a little energy! The cart moves slowly for 1 meter.');
      } else {
        soundManager.playCorrect();
        speakEnglish('POWER FORCE! Big push fills the energy battery to 100%! The ball blasts with speed lines all the way to the goal!');
      }
    };

    return (
      <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-3xl p-4 md:p-5 border-3 border-orange-300 text-center my-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-base shadow">
              ⚡
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                Force & Energy (Pushes Give Energy to Move!)
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                A large force gives BIG energy to go fast and far!
              </p>
            </div>
          </div>
        </div>

        {/* Energy Battery Gauge Indicator */}
        <div className="bg-white rounded-2xl p-3 border-2 border-orange-200 mb-3 shadow-inner">
          <div className="flex justify-between items-center text-xs font-black text-slate-700 mb-1">
            <span className="flex items-center gap-1">🔋 Energy Battery:</span>
            <span
              className={
                energyLevel === 'huge'
                  ? 'text-rose-600 font-extrabold text-sm animate-pulse'
                  : energyLevel === 'small'
                  ? 'text-amber-600'
                  : 'text-slate-400'
              }
            >
              {energyLevel === 'huge' ? '100% MAXIMUM ENERGY! 🔥' : energyLevel === 'small' ? '25% Low Energy' : '0% No Energy (Stationary)'}
            </span>
          </div>

          {/* Gauge Bar */}
          <div className="w-full h-5 bg-slate-200 rounded-full p-1 overflow-hidden shadow-inner flex">
            <motion.div
              animate={{
                width: energyLevel === 'huge' ? '100%' : energyLevel === 'small' ? '30%' : '5%',
              }}
              transition={{ duration: 0.4 }}
              className={`h-full rounded-full transition-colors duration-300 ${
                energyLevel === 'huge'
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600'
                  : energyLevel === 'small'
                  ? 'bg-amber-400'
                  : 'bg-slate-300'
              }`}
            />
          </div>
        </div>

        {/* Soccer Stadium Stage */}
        <div className="relative h-40 w-full rounded-2xl border-3 border-emerald-400 shadow-lg overflow-hidden bg-[#2e7d32] flex items-center px-4">
          {/* Goal post on the right */}
          <div className="absolute right-2 top-4 bottom-4 w-20 border-r-6 border-t-6 border-b-6 border-white rounded-r bg-white/10 flex items-center justify-center">
            <span className="text-white font-black text-xs -rotate-90">GOAL 🥅</span>
          </div>

          {/* Kicker Shoe */}
          <motion.div
            animate={{
              rotate: energyLevel === 'huge' ? [-25, 20, 0] : energyLevel === 'small' ? [-10, 5, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
            className="text-4xl select-none z-10"
          >
            👟
          </motion.div>

          {/* Ball with dynamic speed trail and distance */}
          <motion.div
            key={energyLevel}
            animate={{
              x: energyLevel === 'huge' ? 260 : energyLevel === 'small' ? 90 : 0,
              rotate: energyLevel === 'huge' ? 720 : energyLevel === 'small' ? 180 : 0,
            }}
            transition={{ duration: energyLevel === 'huge' ? 0.6 : 0.5, ease: 'easeOut' }}
            className="text-3xl ml-3 z-10"
          >
            ⚽
          </motion.div>

          {/* Energy Surge Speed Lines */}
          {energyLevel === 'huge' && (
            <div className="absolute left-16 right-24 h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-transparent animate-pulse" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={() => handleTriggerForce('small')}
            className="px-3 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl border-b-4 border-amber-600 active:translate-y-0.5 transition text-xs sm:text-sm shadow"
          >
            👟 Little Push (Small Energy)
          </button>
          <button
            onClick={() => handleTriggerForce('huge')}
            className="px-3 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl border-b-4 border-rose-700 active:translate-y-0.5 transition text-xs sm:text-sm shadow"
          >
            ⚡ BIG FORCE (Huge Energy!)
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     4. PUSH & PULL (DIRECTIONS OF FORCE: AWAY VS CLOSER)
     ========================================================================= */
  if (type === 'push_pull') {
    const [actionPhase, setActionPhase] = useState<'idle' | 'pushing' | 'pulling'>('idle');

    const handleTriggerPush = () => {
      soundManager.playPop();
      setCartAction('push');
      setActionPhase('pushing');
      soundManager.playCorrect();
      speakEnglish('Push! Your hands press forward and move the heavy box AWAY from your body!');
    };

    const handleTriggerPull = () => {
      soundManager.playPop();
      setCartAction('pull');
      setActionPhase('pulling');
      soundManager.playCorrect();
      speakEnglish('Pull! Your hands tug the rope backward and bring the wagon CLOSER to your body!');
    };

    return (
      <div className="bg-gradient-to-b from-sky-50 to-blue-50 rounded-3xl p-4 md:p-5 border-3 border-sky-300 text-center my-3 shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-base shadow">
              🛒
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                Push moves AWAY ➡️ | Pull brings CLOSER ⬅️
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Notice the direction: Away from your body vs Towards your body!
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-black px-3 py-1 rounded-full border hidden sm:inline-block ${
              cartAction === 'push'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : cartAction === 'pull'
                ? 'bg-sky-100 text-sky-800 border-sky-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {cartAction === 'push'
              ? '➡️ PUSH = AWAY FROM BODY'
              : cartAction === 'pull'
              ? '⬅️ PULL = TOWARDS BODY'
              : '👉 CHOOSE AN ACTION BELOW'}
          </span>
        </div>

        {/* Interactive Clear Stage */}
        <div className="relative h-56 w-full rounded-2xl border-3 border-sky-300 shadow-lg overflow-hidden bg-gradient-to-b from-amber-50 via-sky-50 to-amber-100 p-2 select-none">
          {/* Wooden Floor Plank Texture */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#d7a15c] border-t-3 border-[#9b6329]">
            {/* Floor distance marker lines */}
            <div className="w-full h-full flex justify-between px-6 pt-1">
              {[0, 1, 2, 3, 4, 5].map((m) => (
                <div key={m} className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-[#804618]/60" />
                  <span className="text-[9px] font-black text-[#5c300e]">{m}m</span>
                </div>
              ))}
            </div>
          </div>

          {/* Large Direction Indicator Banner at the Top */}
          <div className="absolute top-2 left-2 right-2 flex justify-center z-20">
            {cartAction === 'push' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-500 text-white text-xs sm:text-sm font-black px-4 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-2 animate-pulse"
              >
                <span>➡️ PUSHING FORWARD: Force moves the box AWAY from Pip!</span>
              </motion.div>
            )}
            {cartAction === 'pull' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-sky-600 text-white text-xs sm:text-sm font-black px-4 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-2 animate-pulse"
              >
                <span>⬅️ PULLING BACKWARD: Force brings the wagon CLOSER to Pip!</span>
              </motion.div>
            )}
            {cartAction === 'idle' && (
              <div className="bg-white/90 text-slate-700 text-xs font-bold px-3 py-1 rounded-full shadow border border-slate-200">
                Tap "Push the Box" or "Pull the Wagon" below to see how they move!
              </div>
            )}
          </div>

          {/* ================= SCENARIO A: PUSH A HEAVY WOODEN BOX ================= */}
          {cartAction !== 'pull' && (
            <div className="absolute inset-0 pt-8 flex items-end pb-8">
              {/* Pip on the left in Pushing Stance */}
              <div className="absolute left-8 bottom-12 flex flex-col items-center z-20">
                <svg viewBox="0 0 90 90" className="w-20 h-20 overflow-visible">
                  {/* Pip Body leaned forward */}
                  <motion.g
                    animate={{
                      rotate: actionPhase === 'pushing' ? 12 : 0,
                      x: actionPhase === 'pushing' ? 8 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Shadow */}
                    <ellipse cx="45" cy="85" rx="28" ry="6" fill="#422006" opacity="0.3" />
                    {/* Feet planted */}
                    <ellipse cx="32" cy="80" rx="10" ry="5" fill="#3e2723" />
                    <ellipse cx="58" cy="80" rx="10" ry="5" fill="#3e2723" />
                    {/* Fluffy tail */}
                    <path d="M 20 60 Q 5 45 15 35 Q 25 45 28 55 Z" fill="#e65100" />
                    <path d="M 15 35 Q 18 40 22 45 Z" fill="#ffffff" />
                    {/* Orange Torso */}
                    <rect x="30" y="42" width="30" height="36" rx="12" fill="#ff7043" stroke="#bf360c" strokeWidth="2" />
                    <ellipse cx="45" cy="60" rx="9" ry="12" fill="#fff3e0" />
                    {/* Arms reaching FORWARD towards the box */}
                    <motion.path
                      animate={{
                        d:
                          actionPhase === 'pushing'
                            ? 'M 40 50 L 75 48 L 78 54'
                            : 'M 40 54 L 62 55 L 64 60',
                      }}
                      stroke="#bf360c"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <motion.path
                      animate={{
                        d:
                          actionPhase === 'pushing'
                            ? 'M 40 50 L 75 48 L 78 54'
                            : 'M 40 54 L 62 55 L 64 60',
                      }}
                      stroke="#ff7043"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* White paws pressing */}
                    <circle cx={actionPhase === 'pushing' ? 76 : 64} cy="52" r="5" fill="#ffffff" stroke="#bf360c" strokeWidth="1.5" />
                    {/* Head */}
                    <circle cx="45" cy="30" r="18" fill="#ff7043" stroke="#bf360c" strokeWidth="2" />
                    {/* Ears */}
                    <polygon points="32,18 25,2 40,14" fill="#e65100" />
                    <polygon points="58,18 65,2 50,14" fill="#e65100" />
                    <polygon points="33,16 28,6 38,13" fill="#ffe0b2" />
                    {/* Eyes & smile */}
                    <circle cx="40" cy="28" r="2.5" fill="#212121" />
                    <circle cx="52" cy="28" r="2.5" fill="#212121" />
                    <polygon points="46,32 44,35 48,35" fill="#212121" />
                    {/* Sweat drop of effort when pushing */}
                    {actionPhase === 'pushing' && (
                      <path d="M 60 20 Q 64 15 62 10 Q 58 15 60 20 Z" fill="#29b6f6" />
                    )}
                  </motion.g>
                </svg>
                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full text-orange-950 border border-orange-200 shadow -mt-2">
                  PIP
                </span>
              </div>

              {/* Glowing Arrow: PUSH FORWARD AWAY */}
              {actionPhase === 'pushing' && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 140, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-28 bottom-22 z-30 flex items-center"
                >
                  <div className="h-4 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-l flex-1 shadow-md flex items-center justify-center">
                    <span className="text-[9px] font-black text-emerald-950 px-1 tracking-wider uppercase">
                      FORCE ➡️
                    </span>
                  </div>
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-lime-400 drop-shadow" />
                </motion.div>
              )}

              {/* Wooden Crate Sliding Away from Pip */}
              <motion.div
                animate={{
                  x: actionPhase === 'pushing' ? 240 : 80,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute left-20 bottom-12 z-20 flex flex-col items-center"
              >
                <div className="w-22 h-22 bg-[#8d5621] rounded-xl border-3 border-[#4e2706] shadow-xl relative flex flex-col items-center justify-center p-1">
                  {/* Crate Cross Braces */}
                  <div className="absolute inset-1.5 border-2 border-[#5c3008] rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#ffcc80] font-black text-xs tracking-wider">
                    📦 HEAVY CRATE
                  </div>
                  <div className="mt-10 bg-amber-400 text-amber-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                    50 KG
                  </div>
                </div>
                {/* Dust Puffs when sliding */}
                {actionPhase === 'pushing' && (
                  <motion.div
                    initial={{ opacity: 1, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="text-xs -mt-1"
                  >
                    💨 💨
                  </motion.div>
                )}
                <span className="text-[9px] font-black text-[#5c300e] mt-0.5">
                  {actionPhase === 'pushing' ? '➡️ PUSHED AWAY!' : 'Ready to push'}
                </span>
              </motion.div>
            </div>
          )}

          {/* ================= SCENARIO B: PULL A RED TOY WAGON ================= */}
          {cartAction === 'pull' && (
            <div className="absolute inset-0 pt-8 flex items-end pb-8">
              {/* Red Toy Wagon on the Left */}
              <motion.div
                animate={{
                  x: actionPhase === 'pulling' ? 180 : 20,
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute left-4 bottom-12 z-20 flex flex-col items-center"
              >
                <div className="relative w-28 h-18 flex flex-col justify-end">
                  {/* Teddy bear passenger */}
                  <div className="text-3xl ml-4 -mb-1 select-none">🧸</div>
                  {/* Wagon body */}
                  <div className="w-28 h-10 bg-[#e53935] rounded-lg border-2 border-[#b71c1c] shadow-lg flex items-center justify-center">
                    <span className="text-white text-[10px] font-black tracking-wider">
                      RED WAGON
                    </span>
                  </div>
                  {/* Wagon wheels */}
                  <div className="flex justify-between px-3 -mt-3">
                    <motion.div
                      animate={{ rotate: actionPhase === 'pulling' ? 720 : 0 }}
                      transition={{ duration: 0.7 }}
                      className="w-7 h-7 rounded-full bg-amber-400 border-3 border-slate-900 shadow flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-slate-900 rounded-full" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: actionPhase === 'pulling' ? 720 : 0 }}
                      transition={{ duration: 0.7 }}
                      className="w-7 h-7 rounded-full bg-amber-400 border-3 border-slate-900 shadow flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-slate-900 rounded-full" />
                    </motion.div>
                  </div>
                </div>
                <span className="text-[9px] font-black text-rose-900 mt-1">
                  {actionPhase === 'pulling' ? '⬅️ PULLED CLOSER!' : 'Attached to Rope'}
                </span>
              </motion.div>

              {/* Braided Rope Connecting Wagon to Pip */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                <motion.line
                  x1={actionPhase === 'pulling' ? 275 : 120}
                  y1={170}
                  x2={365}
                  y2={155}
                  stroke="#a16207"
                  strokeWidth="4"
                  strokeDasharray="4 2"
                />
              </svg>

              {/* Glowing Arrow: PULL TOWARDS PIP */}
              {actionPhase === 'pulling' && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 130, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-40 bottom-24 z-30 flex items-center"
                >
                  <div className="h-4 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-l flex-1 shadow-md flex items-center justify-center">
                    <span className="text-[9px] font-black text-sky-950 px-1 tracking-wider uppercase">
                      ⬅️ PULL FORCE
                    </span>
                  </div>
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-cyan-400 drop-shadow" />
                </motion.div>
              )}

              {/* Pip on the Right in Pulling Stance */}
              <div className="absolute right-10 bottom-12 flex flex-col items-center z-20">
                <svg viewBox="0 0 90 90" className="w-20 h-20 overflow-visible">
                  {/* Pip Body leaned backward */}
                  <motion.g
                    animate={{
                      rotate: actionPhase === 'pulling' ? -15 : 0,
                      x: actionPhase === 'pulling' ? 4 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Shadow */}
                    <ellipse cx="45" cy="85" rx="26" ry="6" fill="#422006" opacity="0.3" />
                    {/* Planted Boots */}
                    <ellipse cx="32" cy="80" rx="10" ry="5" fill="#3e2723" />
                    <ellipse cx="58" cy="80" rx="10" ry="5" fill="#3e2723" />
                    {/* Tail */}
                    <path d="M 65 60 Q 80 45 75 35 Q 65 45 62 55 Z" fill="#e65100" />
                    {/* Orange Torso */}
                    <rect x="30" y="42" width="30" height="36" rx="12" fill="#ff7043" stroke="#bf360c" strokeWidth="2" />
                    <ellipse cx="45" cy="60" rx="9" ry="12" fill="#fff3e0" />
                    {/* Arms pulling rope backwards towards chest */}
                    <motion.path
                      animate={{
                        d:
                          actionPhase === 'pulling'
                            ? 'M 45 52 L 20 54 L 18 48'
                            : 'M 45 54 L 28 58 L 26 52',
                      }}
                      stroke="#bf360c"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <motion.path
                      animate={{
                        d:
                          actionPhase === 'pulling'
                            ? 'M 45 52 L 20 54 L 18 48'
                            : 'M 45 54 L 28 58 L 26 52',
                      }}
                      stroke="#ff7043"
                      strokeWidth="5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Paws grasping rope */}
                    <circle cx={actionPhase === 'pulling' ? 20 : 28} cy="52" r="5" fill="#ffffff" stroke="#bf360c" strokeWidth="1.5" />
                    {/* Head */}
                    <circle cx="45" cy="30" r="18" fill="#ff7043" stroke="#bf360c" strokeWidth="2" />
                    {/* Ears */}
                    <polygon points="32,18 25,2 40,14" fill="#e65100" />
                    <polygon points="58,18 65,2 50,14" fill="#e65100" />
                    {/* Face */}
                    <circle cx="38" cy="28" r="2.5" fill="#212121" />
                    <circle cx="50" cy="28" r="2.5" fill="#212121" />
                    <polygon points="44,32 42,35 46,35" fill="#212121" />
                    {/* Effort sweat when tugging */}
                    {actionPhase === 'pulling' && (
                      <path d="M 30 20 Q 26 15 28 10 Q 32 15 30 20 Z" fill="#29b6f6" />
                    )}
                  </motion.g>
                </svg>
                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full text-orange-950 border border-orange-200 shadow -mt-2">
                  PIP
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Big Clear Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={handleTriggerPush}
            className={`px-3 py-3 rounded-2xl font-black text-xs sm:text-sm border-b-4 transition shadow flex items-center justify-center gap-2 active:translate-y-0.5 ${
              cartAction === 'push'
                ? 'bg-emerald-500 text-white border-emerald-700 ring-2 ring-emerald-300'
                : 'bg-white hover:bg-emerald-50 text-emerald-800 border-slate-300'
            }`}
          >
            <span>💪 ➡️ PUSH BOX (Moves Away)</span>
          </button>
          <button
            onClick={handleTriggerPull}
            className={`px-3 py-3 rounded-2xl font-black text-xs sm:text-sm border-b-4 transition shadow flex items-center justify-center gap-2 active:translate-y-0.5 ${
              cartAction === 'pull'
                ? 'bg-sky-500 text-white border-sky-700 ring-2 ring-sky-300'
                : 'bg-white hover:bg-sky-50 text-sky-800 border-slate-300'
            }`}
          >
            <span>🪢 ⬅️ PULL WAGON (Brings Closer)</span>
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     5. FRICTION: RUBBING FORCES, BRAKE CLAMP & SKID MARKS!
     ========================================================================= */
  if (type === 'friction_road') {
    const handleSurface = (surf: 'cement' | 'grass' | 'gravel') => {
      soundManager.playPop();
      setSurface(surf);
      setIsBraking(false);
      if (surf === 'cement') {
        speakEnglish('Smooth cement has low friction! Bicycle tires glide forward easily with little rubbing!');
      } else if (surf === 'grass') {
        speakEnglish('Grass has medium friction. The green blades rub against tires to slow you down!');
      } else {
        speakEnglish('Rough gravel has HIGH friction! Sharp rocks rub hard against the rubber wheels, stopping the bike!');
      }
    };

    const handleBrake = () => {
      soundManager.playPop();
      setIsBraking(true);
      soundManager.playCorrect();
      speakEnglish('Screeech! The black rubber brake pads clamp tightly onto the spinning wheels! Friction rubbing creates heat and stops the bicycle!');
    };

    return (
      <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-3xl p-4 md:p-5 border-3 border-emerald-300 text-center my-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-base shadow">
              🚴
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                Friction: The Rubbing Force that Slows Things Down!
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Notice the bicycle moves FORWARD ➡️ and stops when brake rubber rubs!
              </p>
            </div>
          </div>
        </div>

        {/* Microscope Zoom-In on Rubbing Surfaces */}
        <div className="bg-white rounded-2xl p-2.5 border-2 border-emerald-200 mb-2.5 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔬</span>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-emerald-800 block">
                Surface Rubbing Microscope:
              </span>
              <span className="text-xs font-bold text-slate-700">
                {surface === 'cement' && '🔹 Flat & Smooth: Tires glide smoothly with minimal rubbing (Fast!)'}
                {surface === 'grass' && '🌿 Flexible Grass: Blades brush and rub the wheels, slowing them down.'}
                {surface === 'gravel' && '🪨 Sharp Jagged Rocks: Strong friction scratches and rubs hard against tires!'}
              </span>
            </div>
          </div>
        </div>

        {/* Road Track Stage */}
        <div
          className={`h-44 rounded-2xl border-3 relative flex items-center overflow-hidden transition-colors duration-400 shadow-lg select-none ${
            surface === 'cement'
              ? 'bg-[#78909c] border-slate-600'
              : surface === 'grass'
              ? 'bg-[#388e3c] border-emerald-800'
              : 'bg-[#6d4c41] border-amber-950'
          }`}
        >
          {/* Surface Texture */}
          {surface === 'cement' && (
            <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
              <div className="w-full h-1 bg-white/70" />
              <div className="mt-8 w-full border-b-2 border-dashed border-yellow-300" />
              <div className="absolute top-2 left-3 bg-slate-900/70 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                Smooth Asphalt (Low Friction ⚡ Fast!)
              </div>
            </div>
          )}

          {surface === 'grass' && (
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
              <div className="flex justify-around text-xs opacity-80">🌱 🌼 🌱 🌼 🌱</div>
              <div className="absolute top-2 left-3 bg-emerald-950/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                Lawn Grass (Medium Friction 🌿)
              </div>
              <div className="flex justify-around text-xs opacity-80">🌱 🌱 🌼 🌱 🌱</div>
            </div>
          )}

          {surface === 'gravel' && (
            <div className="absolute inset-0 p-2 pointer-events-none">
              <div className="absolute top-2 left-3 bg-amber-950/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                Rough Rocks & Gravel (HIGH Friction! 🪨 Heavy Rubbing!)
              </div>
              <div className="flex justify-around mt-8 text-xs opacity-70">🪨 ▫️ 🪨 ▫️ 🪨 ▫️ 🪨</div>
            </div>
          )}

          {/* Black Tire Skid Marks when braking */}
          {isBraking && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ duration: 0.3 }}
              className="absolute left-10 bottom-8 h-2.5 bg-black/90 rounded-full blur-[0.5px] shadow-sm z-5"
            />
          )}

          {/* ================= FORWARD-FACING (RIGHT ➡️) SVG BICYCLE WITH KID RIDER ================= */}
          <motion.div
            key={`${surface}-${isBraking}`}
            animate={{
              x: isBraking ? 150 : [-80, 480],
              y: surface === 'gravel' ? [0, -3, 0] : 0,
            }}
            transition={{
              repeat: isBraking ? 0 : Infinity,
              duration: surface === 'cement' ? 2.2 : surface === 'grass' ? 3.8 : 5.8,
              ease: isBraking ? 'easeOut' : 'linear',
            }}
            className="absolute bottom-6 z-15 select-none"
          >
            <svg viewBox="0 0 160 110" className="w-36 h-26 overflow-visible drop-shadow-md">
              {/* Back Wheel (x=35, y=75, radius 22) */}
              <g transform="translate(35, 75)">
                {/* Rubber Tire */}
                <circle cx="0" cy="0" r="22" fill="none" stroke="#212121" strokeWidth="5" />
                <circle cx="0" cy="0" r="20" fill="none" stroke="#e0e0e0" strokeWidth="1.5" />
                {/* Rotating Spokes */}
                <motion.g
                  animate={{ rotate: isBraking ? 0 : 360 }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                >
                  <line x1="-20" y1="0" x2="20" y2="0" stroke="#757575" strokeWidth="1.5" />
                  <line x1="0" y1="-20" x2="0" y2="20" stroke="#757575" strokeWidth="1.5" />
                  <line x1="-14" y1="-14" x2="14" y2="14" stroke="#757575" strokeWidth="1.5" />
                  <line x1="-14" y1="14" x2="14" y2="-14" stroke="#757575" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="4" fill="#424242" />
                </motion.g>
                {/* Rear Brake Pad Clamp */}
                {isBraking && (
                  <g>
                    <rect x="-6" y="-23" width="12" height="6" rx="2" fill="#d32f2f" stroke="#ffffff" strokeWidth="1" />
                    {/* Friction Sparks */}
                    <text x="-8" y="-25" fontSize="12">✨</text>
                    <text x="-2" y="-30" fontSize="10">💨</text>
                  </g>
                )}
              </g>

              {/* Front Wheel (x=120, y=75, radius 22) - FACING FORWARD TO THE RIGHT */}
              <g transform="translate(120, 75)">
                <circle cx="0" cy="0" r="22" fill="none" stroke="#212121" strokeWidth="5" />
                <circle cx="0" cy="0" r="20" fill="none" stroke="#e0e0e0" strokeWidth="1.5" />
                <motion.g
                  animate={{ rotate: isBraking ? 0 : 360 }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                >
                  <line x1="-20" y1="0" x2="20" y2="0" stroke="#757575" strokeWidth="1.5" />
                  <line x1="0" y1="-20" x2="0" y2="20" stroke="#757575" strokeWidth="1.5" />
                  <line x1="-14" y1="-14" x2="14" y2="14" stroke="#757575" strokeWidth="1.5" />
                  <line x1="-14" y1="14" x2="14" y2="-14" stroke="#757575" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="4" fill="#424242" />
                </motion.g>
                {/* Front Brake Pad Clamp */}
                {isBraking && (
                  <g>
                    <rect x="-6" y="-23" width="12" height="6" rx="2" fill="#d32f2f" stroke="#ffffff" strokeWidth="1" />
                    <text x="2" y="-25" fontSize="12">✨</text>
                    <text x="6" y="-30" fontSize="10">💨</text>
                  </g>
                )}
              </g>

              {/* Bicycle Diamond Frame (Red Sport Bike) */}
              {/* Chain Stay */}
              <line x1="35" y1="75" x2="72" y2="75" stroke="#212121" strokeWidth="3" />
              {/* Seat Stay */}
              <line x1="35" y1="75" x2="60" y2="45" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
              {/* Seat Tube */}
              <line x1="72" y1="75" x2="60" y2="45" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
              {/* Top Tube */}
              <line x1="60" y1="45" x2="105" y2="40" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
              {/* Down Tube */}
              <line x1="72" y1="75" x2="105" y2="40" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
              {/* Front Fork */}
              <line x1="105" y1="40" x2="120" y2="75" stroke="#e53935" strokeWidth="4" strokeLinecap="round" />
              {/* Handlebar Stem & Grips (Facing Right ➡️) */}
              <line x1="105" y1="40" x2="110" y2="28" stroke="#757575" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 106 28 L 115 28 L 118 32" stroke="#212121" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Saddle */}
              <path d="M 50 43 Q 60 40 70 43 Z" fill="#212121" />

              {/* Pedal Crank */}
              <g transform="translate(72, 75)">
                <circle cx="0" cy="0" r="7" fill="#9e9e9e" stroke="#424242" strokeWidth="1.5" />
                <motion.g
                  animate={{ rotate: isBraking ? 0 : 360 }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                >
                  <line x1="0" y1="0" x2="8" y2="8" stroke="#424242" strokeWidth="3" />
                  <rect x="5" y="7" width="6" height="3" rx="1" fill="#212121" />
                </motion.g>
              </g>

              {/* Kid Rider Sitting Facing FORWARD (Right ➡️) */}
              <g>
                {/* Legs pedaling */}
                <path d="M 60 46 L 72 65 L 75 76" stroke="#1565c0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <ellipse cx="76" cy="78" rx="5" ry="3" fill="#ffb300" />
                {/* Torso leaning forward to the right */}
                <path d="M 58 46 L 76 26" stroke="#43a047" strokeWidth="12" strokeLinecap="round" />
                {/* Arm holding handlebars on the right */}
                <path d="M 72 28 L 96 30 L 112 28" stroke="#ffb74d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                {/* Kid Head & Helmet */}
                <circle cx="82" cy="15" r="11" fill="#ffb74d" />
                {/* Blue Safety Helmet */}
                <path d="M 71 14 Q 82 2 95 12 Q 97 16 93 16 L 71 16 Z" fill="#0288d1" stroke="#01579b" strokeWidth="1.5" />
                <ellipse cx="94" cy="14" rx="3" ry="1.5" fill="#ffffff" />
                {/* Face looking forward to the right */}
                <circle cx="89" cy="16" r="1.8" fill="#212121" />
                <path d="M 87 20 Q 90 23 93 20" stroke="#212121" strokeWidth="1.2" fill="none" />
              </g>
            </svg>
          </motion.div>

          {/* Brake Clamp Rubbing Notification */}
          {isBraking && (
            <div className="absolute right-3 top-8 bg-rose-600 text-white text-xs font-black px-3 py-2 rounded-2xl shadow-xl border-2 border-white animate-bounce z-30">
              🛑 FRICTION BRAKE! Rubber clamps wheel to stop!
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => handleSurface('cement')}
            className={`px-2 py-2 rounded-2xl text-xs font-black border-b-4 transition ${
              surface === 'cement' ? 'bg-slate-700 text-white border-slate-900 shadow' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            Smooth Cement (Fast)
          </button>
          <button
            onClick={() => handleSurface('grass')}
            className={`px-2 py-2 rounded-2xl text-xs font-black border-b-4 transition ${
              surface === 'grass' ? 'bg-emerald-600 text-white border-emerald-800 shadow' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            Lawn Grass (Medium)
          </button>
          <button
            onClick={() => handleSurface('gravel')}
            className={`px-2 py-2 rounded-2xl text-xs font-black border-b-4 transition ${
              surface === 'gravel' ? 'bg-amber-800 text-white border-amber-950 shadow' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            Rough Gravel (Slow)
          </button>
        </div>

        {/* Brake Button */}
        <button
          onClick={handleBrake}
          className="mt-2.5 w-full py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-black rounded-2xl border-b-4 border-rose-700 active:translate-y-0.5 shadow flex items-center justify-center gap-2"
        >
          <span>🛑 Squeeze Brakes (Watch Rubber Clamp Wheels & Stop!)</span>
        </button>
      </div>
    );
  }

  /* =========================================================================
     6. THE RAMP (INCLINED PLANE: STRAIGHT LIFT VS SLANTED RAMP)
     ========================================================================= */
  if (type === 'ramp_box') {
    const handleToggleRamp = (mode: 'straight_lift' | 'with_ramp') => {
      soundManager.playPop();
      setRampMode(mode);
      if (mode === 'straight_lift') {
        speakEnglish('Lifting straight up is super heavy! You fight full gravity with 100% effort!');
      } else {
        soundManager.playCorrect();
        speakEnglish('A slanted ramp makes it easy! You only need a gentle push to slide the heavy box up!');
      }
    };

    return (
      <div className="bg-gradient-to-b from-purple-50 to-indigo-50 rounded-3xl p-4 md:p-5 border-3 border-purple-300 text-center my-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-base shadow">
              📐
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                Simple Machines: The Slanted Ramp (Inclined Plane)
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Lifting straight up is HARD. A ramp spreads work so it takes LESS FORCE!
              </p>
            </div>
          </div>
        </div>

        {/* Effort Meter Comparison */}
        <div className="bg-white rounded-2xl p-3 border-2 border-purple-200 mb-3 flex items-center justify-between shadow-inner">
          <div className="text-left">
            <span className="text-[10px] font-black uppercase text-purple-900 block">
              Effort & Force Needed:
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              {rampMode === 'straight_lift'
                ? '🥵 100% MAXIMUM FORCE (Heavy & Straining!)'
                : '😄 25% LOW FORCE (Smooth & Easy!)'}
            </span>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-black ${
              rampMode === 'straight_lift'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {rampMode === 'straight_lift' ? 'HARD LIFT' : 'EASY RAMP'}
          </div>
        </div>

        {/* Stage */}
        <div className="relative h-48 w-full rounded-2xl border-3 border-purple-300 shadow-lg overflow-hidden bg-gradient-to-b from-sky-200 to-slate-200 flex items-end justify-between p-3">
          {/* Ground Pavement */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-slate-600 border-t-2 border-slate-700" />

          {/* Delivery Truck on the Right */}
          <div className="relative w-44 h-36 flex flex-col justify-end z-10">
            <div className="w-34 h-28 bg-amber-500 rounded-t-lg border-2 border-amber-800 shadow-md relative flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-amber-950 uppercase">MOVING TRUCK</span>
              <div className="w-26 h-18 bg-amber-950/70 rounded border border-amber-950 flex items-center justify-center text-[10px] text-amber-100 font-bold">
                TRUCK BED
              </div>
            </div>
            {/* Wheels */}
            <div className="flex gap-16 px-4 -mt-2">
              <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-400" />
              <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-400" />
            </div>
          </div>

          {/* Ramp Mode Visualization */}
          {rampMode === 'with_ramp' ? (
            /* Solid Triangular Slanted Ramp */
            <div className="absolute left-8 bottom-6 right-36 h-22 [clip-path:polygon(0%_100%,100%_0%,100%_100%)] bg-gradient-to-r from-slate-400 to-slate-300 border-b-4 border-slate-700 flex items-center justify-center">
              <span className="text-[11px] font-black text-slate-800 rotate-[-18deg]">
                SLANTED RAMP (Easy Slide!)
              </span>
            </div>
          ) : (
            /* Straight Up Lift with Sweating Indicator */
            <div className="absolute left-14 bottom-16 bg-rose-100 border-2 border-rose-400 text-rose-800 text-xs font-black px-3 py-1.5 rounded-2xl shadow animate-bounce">
              🥵 Trembling! Lifting 50kg straight up fights full gravity!
            </div>
          )}

          {/* Heavy Wooden Box */}
          <motion.div
            key={rampMode}
            animate={
              rampMode === 'with_ramp'
                ? { x: [20, 165], y: [0, -55] }
                : { y: [0, -35, 0] }
            }
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="w-12 h-12 bg-amber-700 text-amber-100 font-black rounded-lg shadow-lg border-2 border-amber-950 flex flex-col items-center justify-center text-[10px] z-20"
          >
            <span>📦</span>
            <span className="text-[8px] font-black">50 KG</span>
          </motion.div>
        </div>

        {/* Toggle Mode Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={() => handleToggleRamp('straight_lift')}
            className={`py-2.5 rounded-2xl text-xs sm:text-sm font-black border-b-4 transition ${
              rampMode === 'straight_lift'
                ? 'bg-rose-500 text-white border-rose-700 shadow'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            🥵 Lift Straight Up (Hard Work!)
          </button>
          <button
            onClick={() => handleToggleRamp('with_ramp')}
            className={`py-2.5 rounded-2xl text-xs sm:text-sm font-black border-b-4 transition ${
              rampMode === 'with_ramp'
                ? 'bg-emerald-500 text-white border-emerald-700 shadow'
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            📐 Use Slanted Ramp (Easy Work!)
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     7. THE LEVER: SEE-SAW BALANCE (PUSH DOWN ⬇️ TO SHOOT UP ⬆️)
     ========================================================================= */
  if (type === 'lever_seesaw') {
    const handlePushLever = (side: 'left_down' | 'right_down') => {
      soundManager.playPop();
      setLeverSide(side);
      if (side === 'left_down') {
        soundManager.playCorrect();
        speakEnglish('When you push down on the left side, the right side goes UP! That is a lever!');
      } else {
        speakEnglish('Pushing down on the right side lifts the left side up!');
      }
    };

    return (
      <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-3xl p-4 md:p-5 border-3 border-purple-300 text-center my-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-base shadow">
              ⚖️
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                The Lever: Playground See-Saw (Changes Direction!)
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                A stiff bar pivoting on a fixed point! Push DOWN ⬇️ to lift UP ⬆️!
              </p>
            </div>
          </div>
        </div>

        {/* See-Saw Stage */}
        <div className="relative h-44 w-full rounded-2xl border-3 border-purple-300 shadow-lg overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 flex flex-col justify-end items-center p-3">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-emerald-600 border-t-2 border-emerald-700" />

          {/* Central Triangular Fulcrum (Fixed Point) */}
          <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[36px] border-b-slate-700 z-10" />
          <div className="w-5 h-2 bg-yellow-400 rounded-full z-10 -mt-1" />

          {/* Animated Lever Bar Pivoting Around Fulcrum */}
          <motion.div
            animate={{
              rotate: leverSide === 'left_down' ? -20 : leverSide === 'right_down' ? 20 : 0,
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ transformOrigin: 'center center' }}
            className="absolute bottom-12 w-64 h-3 bg-amber-800 rounded-full border-2 border-amber-950 flex items-center justify-between px-3 shadow-md z-20"
          >
            {/* Left Seat */}
            <div className="flex flex-col items-center -mt-8">
              <span className="text-2xl">🦊</span>
              <span className="text-[9px] font-black bg-white px-1.5 rounded shadow text-orange-950">PIP</span>
            </div>

            {/* Right Seat */}
            <div className="flex flex-col items-center -mt-8">
              <span className="text-2xl">🐘</span>
              <span className="text-[9px] font-black bg-white px-1.5 rounded shadow text-slate-950">FRIEND</span>
            </div>
          </motion.div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={() => handlePushLever('left_down')}
            className="px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl border-b-4 border-purple-800 active:translate-y-0.5 transition text-xs sm:text-sm shadow"
          >
            ⬇️ Push Down on Pip (Friend Goes UP! ⬆️)
          </button>
          <button
            onClick={() => handlePushLever('right_down')}
            className="px-3 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-2xl border-b-4 border-pink-700 active:translate-y-0.5 transition text-xs sm:text-sm shadow"
          >
            ⬇️ Push Down on Friend (Pip Goes UP! ⬆️)
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     8. SIMPLE MACHINES: THE PULLEY FLAGPOLE
     ========================================================================= */
  if (type === 'pulley_flag') {
    const handlePull = (up: boolean) => {
      soundManager.playPop();
      setFlagHeight((prev) => {
        const next = up ? Math.min(prev + 25, 90) : Math.max(prev - 25, 10);
        if (next >= 85) {
          soundManager.playCorrect();
          speakEnglish('Hooray! You pulled down on the rope, and the flag raised all the way to the top!');
        } else {
          speakEnglish('Pull down on the rope to lift the flag up!');
        }
        return next;
      });
    };

    return (
      <div className="bg-gradient-to-b from-rose-50 to-orange-50 rounded-3xl p-4 md:p-5 border-3 border-rose-300 text-center my-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-base shadow">
              🚩
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                The Pulley: Grooved Wheel & Rope
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Changes direction: Pull rope DOWN ⬇️ and the flag climbs UP ⬆️!
              </p>
            </div>
          </div>
        </div>

        {/* Flagpole Canvas */}
        <div className="relative h-48 w-full rounded-2xl border-3 border-rose-300 shadow-lg overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 flex justify-center items-end p-2">
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-emerald-600 border-t-2 border-emerald-700" />

          {/* Sturdy Tall Flagpole */}
          <div className="w-3 h-40 bg-slate-300 border-x border-slate-500 rounded-t relative flex flex-col items-center">
            {/* Golden Pulley Wheel at Top */}
            <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-amber-600 -top-3.5 absolute flex items-center justify-center text-[10px] shadow">
              ⚙️
            </div>
            {/* Braided Rope */}
            <div className="w-0.5 h-full bg-amber-800 absolute -left-1" />
            <div className="w-0.5 h-full bg-amber-800 absolute -right-1" />

            {/* Waving Fabric Flag */}
            <motion.div
              animate={{ bottom: `${flagHeight}%` }}
              transition={{ duration: 0.3 }}
              className="absolute left-3 w-16 h-10 bg-blue-600 border-2 border-white rounded-r-md shadow-lg flex items-center justify-center text-xl select-none"
            >
              🇺🇸
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center mt-3">
          <button
            onClick={() => handlePull(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl border-b-4 border-emerald-700 text-xs sm:text-sm active:translate-y-0.5 shadow flex items-center gap-1.5"
          >
            <span>⬇️ Pull Rope DOWN</span>
            <span>(Flag Climbs UP! ⬆️)</span>
          </button>
          <button
            onClick={() => handlePull(false)}
            className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-2xl border-b-4 border-slate-300 text-xs sm:text-sm active:translate-y-0.5"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     9. KINDS OF MOTION (SWING, CAROUSEL, STRAIGHT SPRINT)
     ========================================================================= */
  if (type === 'swing') {
    return (
      <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-3xl p-4 md:p-5 border-3 border-emerald-300 text-center my-3 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-base shadow">
              🎠
            </span>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-900 tracking-tight">
                Kinds of Motion: How Do Things Move?
              </h4>
              <p className="text-[11px] font-bold text-slate-500">
                Back and forth, in a circle, or in a straight line!
              </p>
            </div>
          </div>
        </div>

        {/* Playground Stage */}
        <div className="relative h-48 w-full rounded-2xl border-3 border-emerald-300 shadow-lg overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 flex items-center justify-center">
          <div className="absolute top-2 left-6 text-2xl">☀️</div>
          <div className="absolute top-3 right-8 text-xl text-white">☁️</div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-emerald-500 border-t-2 border-emerald-600" />

          {motionType === 'swing' && (
            <div className="relative flex flex-col items-center z-10">
              <div className="w-48 h-3.5 bg-amber-800 rounded-full border-2 border-amber-950 shadow relative" />
              <motion.div
                animate={{ rotate: [-36, 36, -36] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center' }}
                className="flex flex-col items-center"
              >
                <div className="flex justify-between w-10">
                  <div className="w-0.5 h-24 bg-slate-400 border-r border-slate-600" />
                  <div className="w-0.5 h-24 bg-slate-400 border-r border-slate-600" />
                </div>
                <div className="w-14 h-4 bg-amber-700 rounded-md border border-amber-950 shadow flex items-center justify-center relative">
                  <span className="text-xl -mt-6">👧</span>
                </div>
              </motion.div>
              <span className="mt-3 text-xs font-black text-emerald-950 bg-white/90 px-3 py-1 rounded-full shadow border border-emerald-300">
                🔁 Back and Forth (Playground Swing!)
              </span>
            </div>
          )}

          {motionType === 'circle' && (
            <div className="relative flex flex-col items-center z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                className="w-32 h-32 rounded-full border-4 border-dashed border-purple-500 bg-purple-50/80 shadow-xl relative flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-amber-600 flex items-center justify-center text-xs font-black text-amber-900 shadow">
                  ★
                </div>
                <div className="absolute -top-3 text-2xl">🎠</div>
                <div className="absolute -bottom-3 text-2xl">🦁</div>
                <div className="absolute -left-3 text-2xl">🦄</div>
                <div className="absolute -right-3 text-2xl">🐻</div>
              </motion.div>
              <span className="mt-3 text-xs font-black text-purple-950 bg-white/90 px-3 py-1 rounded-full shadow border border-purple-300">
                🔄 In a Circle (Merry-Go-Round!)
              </span>
            </div>
          )}

          {motionType === 'straight' && (
            <div className="w-full px-6 flex flex-col items-center z-10">
              <div className="w-full max-w-md h-12 bg-rose-700 rounded-xl border-2 border-rose-900 relative flex items-center px-4 shadow-inner overflow-hidden">
                <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/70" />
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/70" />
                <motion.div
                  animate={{ x: [-130, 130, -130] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                  className="w-10 h-10 bg-white rounded-full shadow-lg border-2 border-slate-900 flex items-center justify-center text-xl"
                >
                  🏃
                </motion.div>
              </div>
              <span className="mt-3 text-xs font-black text-sky-950 bg-white/90 px-3 py-1 rounded-full shadow border border-sky-300">
                ➡️ In a Straight Line (From Start to Finish!)
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => {
              soundManager.playPop();
              setMotionType('swing');
              speakEnglish('Moving back and forth like a playground swing!');
            }}
            className={`px-2 py-2 rounded-2xl text-xs font-black border-b-4 transition ${
              motionType === 'swing' ? 'bg-emerald-500 text-white border-emerald-700 shadow' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Back & Forth
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setMotionType('circle');
              speakEnglish('Moving in a circle like a merry-go-round!');
            }}
            className={`px-2 py-2 rounded-2xl text-xs font-black border-b-4 transition ${
              motionType === 'circle' ? 'bg-purple-500 text-white border-purple-700 shadow' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            In a Circle
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setMotionType('straight');
              speakEnglish('Moving in a straight line!');
            }}
            className={`px-2 py-2 rounded-2xl text-xs font-black border-b-4 transition ${
              motionType === 'straight' ? 'bg-sky-500 text-white border-sky-700 shadow' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Straight Line
          </button>
        </div>
      </div>
    );
  }

  return null;
};
