import React, { useState } from 'react';
import { sound } from '../../utils/audio.js';
import { LockIcon, EyeIcon, EyeOffIcon } from '../Icons.jsx';

export function ClearanceGate({ expectedKey = 'diceu', onUnlock, onAbort }) {
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [authError, setAuthError] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcodeAttempt.trim().toLowerCase() === expectedKey.trim().toLowerCase()) {
      sound.playSelect();
      onUnlock();
    } else {
      sound.playLaserCollapse();
      setAuthError(true);
    }
  };

  return (
    <div className="clearance-screen">
      <div className="clearance-grid-bg" />

      <div className="clearance-modal">
        <div className="clearance-banner">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
            <LockIcon size={12} color="currentColor" />
            <span>RESTRICTED ACCESS // LEVEL 4</span>
          </span>
          <span>POD 042 TELEMETRY</span>
        </div>

        <div className="clearance-body">
          <div className="clearance-subtitle">CLEARANCE VERIFICATION PROTOCOL</div>
          <h2 className="clearance-title">OPERATOR CLEARANCE</h2>
          <p className="clearance-desc">
            The Archive Configuration & Editing terminal is restricted. Input the operator clearance passcode to access system parameters.
          </p>

          <form onSubmit={handleSubmit} className="clearance-form">
            <div>
              <label className="editor-label">Operator Passcode</label>
              <div className="clearance-input-wrap">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  autoFocus
                  placeholder="ENTER PASSCODE"
                  value={passcodeAttempt}
                  onChange={(e) => {
                    setPasscodeAttempt(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  className={`editor-input clearance-passcode-input ${
                    authError ? 'has-error' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="clearance-toggle-btn"
                  title={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOffIcon size={13} /> : <EyeIcon size={13} />}
                  <span>{showPasscode ? 'HIDE' : 'SHOW'}</span>
                </button>
              </div>
            </div>

            {authError && (
              <div className="clearance-error">
                ACCESS DENIED // INVALID CLEARANCE HASH
              </div>
            )}

            <div className="clearance-actions">
              <button
                type="submit"
                className="editor-btn editor-btn-primary clearance-submit-btn"
              >
                VERIFY & UNLOCK
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playHover();
                  onAbort();
                }}
                className="editor-btn"
              >
                ABORT
              </button>
            </div>
          </form>
        </div>

        <div className="clearance-footer">
          <span>STATUS: AUTH_PENDING</span>
          <span>CLEARANCE LEVEL: OPERATOR</span>
        </div>
      </div>
    </div>
  );
}
