/**
 * Web Audio API synthesizer for instant zero-latency gamified sound effects
 * and Web Speech Synthesis manager for kid-friendly English narration.
 * 
 * Engineered to run smoothly on ANY browser (Chrome, Safari, iOS, Firefox, Edge, Android)
 * without requiring special permissions or prompts.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;

  constructor() {
    this.setupAutoUnlock();
  }

  // Silently unlocks audio on first user touch/click without any popups
  private setupAutoUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.initSilently();
      if (this.isUnlocked) {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('click', unlock);
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
  }

  public initSilently() {
    try {
      if (typeof window === 'undefined') return;
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.isUnlocked = true;
    } catch {
      // Gracefully ignore if blocked
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      if (this.isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // Ignore
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play Duolingo-style positive chime (2-step rising bell)
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      // Note 1: E5 (659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Note 2: A5 (880Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.12);
      gain2.gain.setValueAtTime(0.28, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } catch {
      // Fail silently if browser audio is temporarily paused
    }
  }

  // Play soft "thud" for incorrect answer
  public playIncorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25); // Drop to A2
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Fail silently
    }
  }

  // Crisp tactile button click
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Fail silently
    }
  }

  // Fanfare for completing a lesson/unit or opening a chest
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [
        { f: 523.25, d: 0.1 }, // C5
        { f: 659.25, d: 0.1 }, // E5
        { f: 783.99, d: 0.1 }, // G5
        { f: 1046.50, d: 0.35 }, // C6
      ];

      const now = ctx.currentTime;
      let offset = 0;

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + offset);

        gain.gain.setValueAtTime(0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + n.d);

        offset += n.d * 0.85;
      });
    } catch {
      // Fail silently
    }
  }

  // Alias for playFanfare used in RewardModal and ShopModal
  public playVictory() {
    this.playFanfare();
  }

  // Treasure chest opening sound
  public playChest() {
    this.playFanfare();
    setTimeout(() => this.playCoin(), 300);
  }

  // Coin / Gem collection chime
  public playCoin() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [987.77, 1318.51]; // B5 -> E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // Fail silently
    }
  }

  // Grand Level-Up celebratory fanfare for 7-year-olds!
  public playLevelUp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Ascending celebratory arpeggio: C4, E4, G4, C5, E5, G5, C6 (sparkling chime)
      const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      arpeggio.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i >= 4 ? 'sine' : 'triangle';
        const startTime = now + i * 0.09;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.26, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });

      // Harmonious shimmering chord on top at the peak
      const chordTime = now + arpeggio.length * 0.09;
      const chordNotes = [523.25, 659.25, 783.99, 1046.50];
      chordNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);
        gain.gain.setValueAtTime(0.18, chordTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(chordTime);
        osc.stop(chordTime + 1.2);
      });
    } catch {
      // Fail silently
    }
  }
}

export const soundManager = new SoundController();

// Voice cache pre-loader for Safari / mobile Chrome
let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      try {
        cachedVoices = window.speechSynthesis.getVoices();
      } catch {
        // Ignore
      }
    };
  } catch {
    // Ignore
  }
}

/**
 * Web Speech Synthesis helper for English audio.
 * Guaranteed to NEVER hang or block execution, even if browser speech is disabled,
 * blocked by policy, or has no voices installed.
 */
export const speakEnglish = (text: string, slow: boolean = false): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    if (soundManager.getMuted()) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
    } catch {
      // Ignore
    }

    const cleanText = text.replace(/[*_#]/g, '').trim();
    if (!cleanText) {
      resolve();
      return;
    }

    let hasCompleted = false;
    const complete = () => {
      if (!hasCompleted) {
        hasCompleted = true;
        resolve();
      }
    };

    // Calculate maximum duration based on word count:
    // Guarantees completion even if browser speech engine doesn't fire onend
    const wordCount = cleanText.split(/\s+/).length;
    const maxSpeechDurationMs = Math.max(1400, Math.min(6500, wordCount * (slow ? 450 : 300) + 750));
    const safetyTimeout = setTimeout(complete, maxSpeechDurationMs);

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      // Slightly slowed for kids to clearly understand every syllable
      utterance.rate = slow ? 0.6 : 0.9;
      utterance.pitch = 1.15; // friendly, upbeat pitch for 7yo kids

      // Pick best English voice if available
      const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Karen') ||
              v.name.includes('Daniel'))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        clearTimeout(safetyTimeout);
        complete();
      };
      utterance.onerror = () => {
        clearTimeout(safetyTimeout);
        complete();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      clearTimeout(safetyTimeout);
      complete();
    }
  });
};
