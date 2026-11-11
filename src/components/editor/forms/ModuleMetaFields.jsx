import React from 'react';
import { PlusIcon } from '../../Icons.jsx';

/**
 * Shared top banner for a module editor form with an optional primary action button.
 */
export function ModuleSectionHeader({ module, suffix = '', actionLabel, onAction }) {
  return (
    <div className="editor-section-header">
      <div>
        <span className="editor-section-code">
          MODULE [{module.code}] // {module.subtitle}
        </span>
        <h2 className="editor-section-title">
          {module.title}
          {suffix ? ` (${suffix})` : ''}
        </h2>
      </div>

      {actionLabel && onAction && (
        <button onClick={onAction} className="editor-btn editor-btn-primary">
          <PlusIcon size={12} color="currentColor" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

/**
 * Shared metadata editor block for any portfolio module (Title, Subtitle, Tagline).
 */
export function ModuleMetaFields({ module, onUpdateModule }) {
  const updateMeta = (field, value) => {
    onUpdateModule({ ...module, [field]: value });
  };

  return (
    <div className="editor-meta-panel">
      <div className="editor-meta-panel-header">
        <span>MODULE HEADER TELEMETRY // [{module.code}]</span>
        <span className="editor-meta-id">ID: {module.id.toUpperCase()}</span>
      </div>

      <div className="editor-grid-3">
        <div>
          <label className="editor-label">Display Title</label>
          <input
            type="text"
            value={module.title}
            onChange={(e) => updateMeta('title', e.target.value)}
            className="editor-input"
          />
        </div>

        <div>
          <label className="editor-label">Subtitle Classification</label>
          <input
            type="text"
            value={module.subtitle}
            onChange={(e) => updateMeta('subtitle', e.target.value)}
            className="editor-input"
          />
        </div>

        <div>
          <label className="editor-label">Code Index</label>
          <input
            type="text"
            value={module.code}
            onChange={(e) => updateMeta('code', e.target.value)}
            className="editor-input"
          />
        </div>
      </div>

      <div>
        <label className="editor-label">Tagline / Dossier Summary</label>
        <input
          type="text"
          value={module.tagline}
          onChange={(e) => updateMeta('tagline', e.target.value)}
          className="editor-input"
        />
      </div>
    </div>
  );
}
