import React from 'react';
import { ClockIcon, SpeakerOnIcon, SpeakerOffIcon } from '../Icons.jsx';
import { useSystemClock } from '../../hooks/useSystemClock.js';

function SystemClock() {
  const clockRef = useSystemClock();
  return (
    <div className="telemetry-clock">
      <ClockIcon size={12} color="var(--text-dim)" />
      <span ref={clockRef}>CLOCK: 00:00:00.00</span>
    </div>
  );
}

export function TelemetryHeader({
  profile,
  soundEnabled,
  onToggleSound,
  pipClicks,
  onPipClick
}) {
  return (
    <header className="telemetry-header">
      <div className="telemetry-brand">
        <span
          onClick={onPipClick}
          title="System Status Pip"
          className={`telemetry-pip ${pipClicks > 0 ? 'pip-active' : ''}`}
        />
        <span className="telemetry-brand-name">SYSTEM // {profile.name}</span>
        <span className="telemetry-divider telemetry-hide-mobile">//</span>
        <span className="telemetry-codename telemetry-hide-mobile">{profile.codename} CORE</span>
        {profile.role && (
          <span className="telemetry-hide-tablet">
            <span className="telemetry-divider" style={{ marginRight: '10px' }}>//</span>
            <span>{profile.role}</span>
          </span>
        )}
      </div>

      <div className="telemetry-controls">
        <SystemClock />

        <button onClick={onToggleSound} className="hud-btn">
          {soundEnabled ? (
            <SpeakerOnIcon size={12} color="var(--text-main)" />
          ) : (
            <SpeakerOffIcon size={12} color="var(--text-dim)" />
          )}
          <span>AUDIO: {soundEnabled ? '[ON]' : '[OFF]'}</span>
        </button>
      </div>
    </header>
  );
}
