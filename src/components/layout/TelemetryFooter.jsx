import React from 'react';
import { RadarCrosshairIcon } from '../Icons.jsx';

export function TelemetryFooter({ mode, profile }) {
  const idleStatus = profile?.status || 'ORBITAL IDLE // HOVER SHURIKEN';
  const locationText = profile?.location || 'SABAH_04.88N_116.54E';

  return (
    <footer className="telemetry-footer">
      <div className="telemetry-footer-group telemetry-status-group">
        <span className="telemetry-footer-pip" />
        <span className="telemetry-status-text">
          STATUS:{' '}
          {mode === 'circle'
            ? idleStatus
            : 'ENGAGED // TAP DICE TO RETURN'}
        </span>
      </div>

      <div className="telemetry-footer-group telemetry-coords-group">
        <RadarCrosshairIcon size={12} color="var(--text-faint)" />
        <span>COORDINATES: {locationText} // 60.0 FPS</span>
      </div>
    </footer>
  );
}
