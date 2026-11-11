import React from 'react';

export function ProfileForm({ profile, onUpdateProfile }) {
  const updateField = (field, value) => {
    onUpdateProfile({ ...profile, [field]: value });
  };

  return (
    <div className="editor-form-container">
      <div className="editor-section-header">
        <div>
          <span className="editor-section-code">MODULE [00] // CORE TELEMETRY</span>
          <h2 className="editor-section-title">PROFILE &amp; IDENTITY IDENT</h2>
        </div>
      </div>

      <div className="editor-card">
        <div className="editor-card-header">
          <span className="editor-card-badge">OPERATOR IDENTITY PARAMETERS</span>
        </div>

        <div className="editor-grid-2">
          <div>
            <label className="editor-label">Full Name / Handle</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="editor-input"
            />
          </div>

          <div>
            <label className="editor-label">System Codename</label>
            <input
              type="text"
              value={profile.codename}
              onChange={(e) => updateField('codename', e.target.value)}
              className="editor-input"
            />
          </div>

          <div>
            <label className="editor-label">Professional Role</label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => updateField('role', e.target.value)}
              className="editor-input"
            />
          </div>

          <div>
            <label className="editor-label">Location / Origin</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="editor-input"
            />
          </div>
        </div>

        <div>
          <label className="editor-label">System Telemetry Status Bar</label>
          <input
            type="text"
            value={profile.status}
            onChange={(e) => updateField('status', e.target.value)}
            className="editor-input"
          />
        </div>
      </div>

      <div className="editor-security-box">
        <div className="editor-security-header">
          <label className="editor-label">Security Access Key (Editor Passcode)</label>
          <span className="editor-security-badge">SECURITY CLEARANCE GATE</span>
        </div>
        <input
          type="text"
          value={profile.accessKey || ''}
          onChange={(e) => updateField('accessKey', e.target.value)}
          placeholder="e.g. diceu"
          className="editor-input"
          style={{ letterSpacing: '2px', fontWeight: 700 }}
        />
        <span className="editor-security-hint">
          This secret passcode is required whenever anyone attempts to unlock the editor terminal. Default is &quot;diceu&quot;. Remember to click SAVE CHANGES (or press Ctrl+S) after updating.
        </span>
      </div>
    </div>
  );
}
