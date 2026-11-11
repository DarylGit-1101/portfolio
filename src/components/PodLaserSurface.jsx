import React from 'react';

/**
 * PodLaserSurface — NieR: Automata Pod Optical Laser Scan & Holographic De-Cloak.
 *
 * Simulates a tactical optical laser scanning beam sweeping down the beige canvas:
 * - Leading edge: Razor-thin golden-amber laser beam with core white-hot intensity
 * - Anamorphic lens flare streak extending across margins
 * - Holographic phosphor wake with micro-scanline telemetry
 * - Laser slit collapse upon exit (CRT / holographic aperture shutter)
 */
export function PodLaserSurface({ state = 'idle' }) {
  if (state === 'idle') return null;

  const isScanning = state === 'scanning';
  const isSettled = state === 'settled';
  const isCollapsing = state === 'collapsing';

  return (
    <div className="pod-laser-surface">
      {/* 1. DE-CLOAKED HOLOGRAPHIC PARCHMENT BED */}
      {(isScanning || isSettled) && (
        <div
          className={`pod-decloak-sheet ${
            isScanning ? 'pod-sheet-entering' : 'pod-sheet-settled'
          }`}
        >
          {/* Subtle tactical micro-grid & scanlines */}
          <div className="pod-scanline-grid" />
        </div>
      )}

      {/* 2. THE OPTICAL LASER SCANNING BEAM (The moving aperture sweep) */}
      {isScanning && (
        <div className="pod-laser-curtain">
          {/* Trailing phosphor illumination wake */}
          <div className="laser-phosphor-wake" />

          {/* Laser Aperture Leading Edge */}
          <div className="pod-laser-beam-front">
            {/* Anamorphic Lens Flare Streak */}
            <div className="laser-anamorphic-flare" />

            {/* Core White-Hot Laser Filament */}
            <div className="laser-core-filament" />

            {/* Tactical Pod Telemetry Callout */}
            <div className="laser-telemetry-pill">
              <span>POD 042 // SCANNING OPTICAL DOSSIER</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. LASER SLIT COLLAPSE (Upon exit or switching sections) */}
      {isCollapsing && (
        <div className="laser-collapse-curtain">
          <div className="laser-collapse-slit" />
          <div className="laser-collapse-glow" />
        </div>
      )}
    </div>
  );
}
