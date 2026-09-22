import React from 'react';
import { motion } from 'motion/react';
import { MascotMood, AccessoryId } from '../types';

interface MascotPipProps {
  mood?: MascotMood;
  accessory?: AccessoryId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  onTap?: () => void;
  className?: string;
}

export const MascotPip: React.FC<MascotPipProps> = ({
  mood = 'happy',
  accessory = 'none',
  size = 'md',
  speechBubble,
  onTap,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  };

  // Bounce and animation variants based on mood
  const bounceVariants = {
    happy: {
      y: [0, -6, 0],
      rotate: [0, 1.5, -1.5, 0],
      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" as const }
    },
    waving: {
      y: [0, -4, 0],
      rotate: [0, 2, -2, 0],
      transition: { repeat: Infinity, duration: 1.8 }
    },
    celebrating: {
      y: [0, -16, 0],
      scale: [1, 1.08, 1],
      transition: { repeat: Infinity, duration: 0.9, ease: "backOut" as const }
    },
    thinking: {
      rotate: [-2, 2, -2],
      y: [0, -3, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" as const }
    },
    oops: {
      x: [0, -4, 4, -4, 0],
      transition: { duration: 0.5 }
    },
    pushing: {
      x: [-4, 4, -4],
      transition: { repeat: Infinity, duration: 1.2 }
    },
    pulley: {
      y: [0, 6, 0],
      transition: { repeat: Infinity, duration: 1.4 }
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Dynamic Speech Bubble if provided */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 max-w-xs bg-white text-slate-800 text-sm md:text-base font-bold px-4 py-2.5 rounded-2xl shadow-md border-2 border-slate-200 relative text-center"
        >
          {speechBubble}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-200 rotate-45" />
        </motion.div>
      )}

      {/* Mascot SVG Body with Motion */}
      <motion.div
        variants={bounceVariants}
        animate={mood}
        onClick={onTap}
        className={`${sizeMap[size]} cursor-pointer relative filter drop-shadow-md`}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="foxFur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff7a18" />
              <stop offset="100%" stopColor="#e65100" />
            </linearGradient>
            <linearGradient id="foxBelly" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fff3e0" />
            </linearGradient>
            <linearGradient id="capeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3366" />
              <stop offset="100%" stopColor="#cc0033" />
            </linearGradient>
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ff9900" />
            </linearGradient>
          </defs>

          {/* ACCESSORY: Cape (drawn behind body) */}
          {accessory === 'cape' && (
            <path
              d="M 65 110 C 30 140, 20 185, 45 195 C 70 180, 80 160, 90 140 Z"
              fill="url(#capeGrad)"
              stroke="#990026"
              strokeWidth="3"
            />
          )}

          {/* Fluffy Fox Tail with White Tip */}
          <g className="fox-tail origin-bottom-right">
            <path
              d="M 140 140 C 185 130, 205 85, 175 60 C 155 45, 135 75, 140 110 Z"
              fill="url(#foxFur)"
              stroke="#b33900"
              strokeWidth="4"
            />
            {/* White Tail Tip */}
            <path
              d="M 175 60 C 160 50, 148 65, 150 78 C 160 82, 170 80, 178 72 Z"
              fill="#ffffff"
            />
          </g>

          {/* Left Ear */}
          <path
            d="M 45 75 L 30 20 C 55 25, 75 45, 80 65 Z"
            fill="url(#foxFur)"
            stroke="#b33900"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Left Inner Ear (Pink) */}
          <path
            d="M 48 68 L 38 32 C 54 36, 68 50, 72 63 Z"
            fill="#ffccd5"
          />

          {/* Right Ear */}
          <path
            d="M 155 75 L 170 20 C 145 25, 125 45, 120 65 Z"
            fill="url(#foxFur)"
            stroke="#b33900"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Right Inner Ear (Pink) */}
          <path
            d="M 152 68 L 162 32 C 146 36, 132 50, 128 63 Z"
            fill="#ffccd5"
          />

          {/* Body */}
          <ellipse
            cx="100"
            cy="145"
            rx="52"
            ry="46"
            fill="url(#foxFur)"
            stroke="#b33900"
            strokeWidth="4"
          />
          {/* Belly Fluff */}
          <ellipse
            cx="100"
            cy="150"
            rx="32"
            ry="30"
            fill="url(#foxBelly)"
          />

          {/* Head Shape */}
          <ellipse
            cx="100"
            cy="95"
            rx="58"
            ry="48"
            fill="url(#foxFur)"
            stroke="#b33900"
            strokeWidth="4"
          />

          {/* White Cheek Tufts */}
          <path
            d="M 45 105 C 55 125, 75 135, 100 135 C 125 135, 145 125, 155 105 C 145 122, 125 128, 100 128 C 75 128, 55 122, 45 105 Z"
            fill="url(#foxBelly)"
          />
          <path
            d="M 42 95 Q 60 115 80 120 Q 60 100 42 95 Z"
            fill="#ffffff"
          />
          <path
            d="M 158 95 Q 140 115 120 120 Q 140 100 158 95 Z"
            fill="#ffffff"
          />

          {/* Cute Big Eyes */}
          {mood === 'celebrating' || mood === 'happy' ? (
            // Sparkly happy squint eyes (^ ^)
            <g>
              <path
                d="M 72 88 Q 82 78 92 88"
                fill="none"
                stroke="#2c1810"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 108 88 Q 118 78 128 88"
                fill="none"
                stroke="#2c1810"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          ) : mood === 'thinking' ? (
            // Curious upward looking eyes
            <g>
              <ellipse cx="80" cy="85" rx="8" ry="10" fill="#2c1810" />
              <ellipse cx="120" cy="85" rx="8" ry="10" fill="#2c1810" />
              <circle cx="82" cy="80" r="3.5" fill="#ffffff" />
              <circle cx="122" cy="80" r="3.5" fill="#ffffff" />
            </g>
          ) : mood === 'oops' ? (
            // Gentle caring eyes
            <g>
              <ellipse cx="80" cy="90" rx="7" ry="8" fill="#2c1810" />
              <ellipse cx="120" cy="90" rx="7" ry="8" fill="#2c1810" />
              <circle cx="82" cy="87" r="2.5" fill="#ffffff" />
              <circle cx="122" cy="87" r="2.5" fill="#ffffff" />
            </g>
          ) : (
            // Standard cheerful big shiny eyes
            <g>
              <ellipse cx="78" cy="88" rx="8.5" ry="11" fill="#2c1810" />
              <ellipse cx="122" cy="88" rx="8.5" ry="11" fill="#2c1810" />
              <circle cx="81" cy="83" r="3.8" fill="#ffffff" />
              <circle cx="125" cy="83" r="3.8" fill="#ffffff" />
              <circle cx="75" cy="93" r="1.8" fill="#ffffff" />
              <circle cx="119" cy="93" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="60" cy="104" rx="9" ry="5.5" fill="#ff708f" opacity="0.6" />
          <ellipse cx="140" cy="104" rx="9" ry="5.5" fill="#ff708f" opacity="0.6" />

          {/* Cute Nose and Mouth */}
          <path
            d="M 94 100 Q 100 97 106 100 Q 100 106 94 100 Z"
            fill="#2c1810"
          />
          {mood === 'celebrating' || mood === 'happy' || mood === 'waving' ? (
            // Big open happy mouth
            <path
              d="M 92 108 Q 100 120 108 108 Z"
              fill="#d81b60"
              stroke="#2c1810"
              strokeWidth="2"
            />
          ) : mood === 'oops' ? (
            // Soft small mouth
            <path
              d="M 94 112 Q 100 109 106 112"
              fill="none"
              stroke="#2c1810"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : (
            // Cute gentle smile
            <path
              d="M 93 107 Q 100 114 107 107"
              fill="none"
              stroke="#2c1810"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Front Paws / Hands based on mood */}
          {mood === 'waving' ? (
            <g>
              {/* Left waving paw */}
              <motion.g
                animate={{ rotate: [-15, 25, -15] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                style={{ transformOrigin: '40px 130px' }}
              >
                <ellipse cx="34" cy="115" rx="12" ry="10" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
                <circle cx="34" cy="115" r="4" fill="#ffccd5" />
              </motion.g>
              {/* Right resting paw */}
              <ellipse cx="140" cy="148" rx="12" ry="10" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
            </g>
          ) : mood === 'celebrating' ? (
            <g>
              {/* Both paws raised high! */}
              <ellipse cx="45" cy="95" rx="12" ry="10" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
              <ellipse cx="155" cy="95" rx="12" ry="10" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
              {/* Star sparkle in paw */}
              <text x="160" y="80" fontSize="18" fill="#ffd700">✨</text>
            </g>
          ) : mood === 'pushing' ? (
            <g>
              {/* Hands forward pushing */}
              <ellipse cx="70" cy="140" rx="11" ry="12" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
              <ellipse cx="130" cy="140" rx="11" ry="12" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
            </g>
          ) : mood === 'pulley' ? (
            <g>
              {/* Hands holding rope vertically */}
              <ellipse cx="100" cy="130" rx="10" ry="10" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
              <ellipse cx="100" cy="155" rx="10" ry="10" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
              <line x1="100" y1="90" x2="100" y2="185" stroke="#795548" strokeWidth="3" strokeDasharray="3 2" />
            </g>
          ) : (
            <g>
              {/* Rested paws on belly */}
              <ellipse cx="78" cy="150" rx="11" ry="10" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
              <ellipse cx="122" cy="150" rx="11" ry="10" fill="#ffffff" stroke="#b33900" strokeWidth="3" />
            </g>
          )}

          {/* Little Fox Feet */}
          <ellipse cx="75" cy="188" rx="16" ry="9" fill="#2c1810" />
          <ellipse cx="125" cy="188" rx="16" ry="9" fill="#2c1810" />

          {/* ACCESSORY: Science Goggles */}
          {accessory === 'goggles' && (
            <g>
              <rect x="52" y="66" width="36" height="24" rx="8" fill="#00e5ff" opacity="0.75" stroke="#00838f" strokeWidth="3" />
              <rect x="112" y="66" width="36" height="24" rx="8" fill="#00e5ff" opacity="0.75" stroke="#00838f" strokeWidth="3" />
              <line x1="88" y1="78" x2="112" y2="78" stroke="#37474f" strokeWidth="4" />
              <line x1="30" y1="78" x2="52" y2="78" stroke="#37474f" strokeWidth="4" />
              <line x1="148" y1="78" x2="170" y2="78" stroke="#37474f" strokeWidth="4" />
              <circle cx="62" cy="74" r="3" fill="#ffffff" opacity="0.8" />
              <circle cx="122" cy="74" r="3" fill="#ffffff" opacity="0.8" />
            </g>
          )}

          {/* ACCESSORY: Crown */}
          {accessory === 'crown' && (
            <g transform="translate(68, 12)">
              <polygon
                points="0,32 12,8 32,22 52,8 64,32"
                fill="url(#crownGrad)"
                stroke="#b8860b"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="8" r="3.5" fill="#ff0055" />
              <circle cx="32" cy="22" r="3" fill="#00e5ff" />
              <circle cx="52" cy="8" r="3.5" fill="#00e676" />
            </g>
          )}

          {/* ACCESSORY: Astronaut Helmet */}
          {accessory === 'astronaut' && (
            <g>
              <circle cx="100" cy="95" r="58" fill="none" stroke="#b0bec5" strokeWidth="5" />
              <path
                d="M 60 75 Q 100 60 140 75 Q 150 115 130 125 Q 100 135 70 125 Z"
                fill="#80d8ff"
                opacity="0.35"
              />
              <ellipse cx="100" cy="154" rx="28" ry="6" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="2" />
            </g>
          )}

          {/* ACCESSORY: Detective Hat */}
          {accessory === 'detective' && (
            <g transform="translate(60, 22)">
              <ellipse cx="40" cy="28" rx="46" ry="12" fill="#8d6e63" stroke="#4e342e" strokeWidth="3" />
              <path
                d="M 12 28 C 15 0, 65 0, 68 28 Z"
                fill="#a1887f"
                stroke="#4e342e"
                strokeWidth="3"
              />
              <rect x="18" y="24" width="44" height="6" fill="#3e2723" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
