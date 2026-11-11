/**
 * Delicate procedural Web Audio API sound generator (Zero external files needed).
 * Produces signature soft NieR: Automata interface clicks, Pod laser sweeps,
 * and holographic aperture collapse acoustics.
 */
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  _init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  _playTone({ type, startFreq, endFreq, freqRampEnd, gainPeak, gainRampEnd, stopAfter }) {
    if (this.muted) return;
    try {
      this._init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + freqRampEnd);

      gain.gain.setValueAtTime(gainPeak, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + gainRampEnd);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + stopAfter);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playHover() {
    this._playTone({
      type: 'sine',
      startFreq: 880, // High soft ping
      endFreq: 1320,
      freqRampEnd: 0.04,
      gainPeak: 0.04,
      gainRampEnd: 0.045,
      stopAfter: 0.05
    });
  }

  playSelect() {
    this._playTone({
      type: 'triangle',
      startFreq: 520,
      endFreq: 1040,
      freqRampEnd: 0.08,
      gainPeak: 0.06,
      gainRampEnd: 0.09,
      stopAfter: 0.1
    });
  }

  // NieR Pod 042 Optical Laser Scan Sweep Sound
  playLaserScan() {
    // Primary laser frequency modulation
    this._playTone({
      type: 'sine',
      startFreq: 680,
      endFreq: 1440,
      freqRampEnd: 0.14,
      gainPeak: 0.04,
      gainRampEnd: 0.15,
      stopAfter: 0.16
    });

    // High harmonic shimmer
    this._playTone({
      type: 'triangle',
      startFreq: 1800,
      endFreq: 2400,
      freqRampEnd: 0.08,
      gainPeak: 0.02,
      gainRampEnd: 0.09,
      stopAfter: 0.1
    });
  }

  // Optical Aperture / Laser Slit Shutter Snap
  playLaserCollapse() {
    this._playTone({
      type: 'triangle',
      startFreq: 1600,
      endFreq: 220,
      freqRampEnd: 0.09,
      gainPeak: 0.05,
      gainRampEnd: 0.1,
      stopAfter: 0.11
    });
  }

  // Cute companion hop sound for Diceu
  playDiceuJump() {
    this._playTone({
      type: 'sine',
      startFreq: 420,
      endFreq: 860,
      freqRampEnd: 0.11,
      gainPeak: 0.045,
      gainRampEnd: 0.12,
      stopAfter: 0.13
    });
  }

  // Expressive two-tone synth chirp for Diceu reactions
  playDiceuChirp() {
    this._playTone({
      type: 'triangle',
      startFreq: 740,
      endFreq: 1180,
      freqRampEnd: 0.06,
      gainPeak: 0.04,
      gainRampEnd: 0.07,
      stopAfter: 0.08
    });
    setTimeout(() => {
      this._playTone({
        type: 'sine',
        startFreq: 980,
        endFreq: 1480,
        freqRampEnd: 0.07,
        gainPeak: 0.04,
        gainRampEnd: 0.08,
        stopAfter: 0.09
      });
    }, 55);
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

export const sound = new SoundSystem();
