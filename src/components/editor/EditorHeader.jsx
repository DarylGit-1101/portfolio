import React from 'react';
import {
  SaveIcon,
  DownloadIcon,
  UploadIcon,
  TrashIcon,
  LockIcon,
  ArrowLeftIcon,
  ResetIcon
} from '../Icons.jsx';

export function EditorHeader({
  codename,
  isDirty,
  onExit,
  onLock,
  onSave,
  onDiscard,
  onExport,
  onImportFile,
  onReset
}) {
  return (
    <header className="editor-header">
      <div className="editor-header-left">
        <button onClick={onExit} className="editor-btn editor-btn-primary">
          <ArrowLeftIcon size={12} color="currentColor" />
          <span>EXIT TO PORTFOLIO</span>
        </button>

        <button onClick={onLock} className="editor-btn" title="Lock clearance terminal">
          <LockIcon size={12} color="currentColor" />
          <span>LOCK TERMINAL</span>
        </button>

        <div className="editor-header-title">
          <span>SYSTEM // ARCHIVE EDITOR</span>
          <span className="editor-header-divider">//</span>
          <span style={{ color: 'var(--text-dim)' }}>{codename}</span>
        </div>

        <div className={`editor-sync-pill ${isDirty ? 'is-dirty' : ''}`}>
          <span className="editor-sync-dot" />
          <span>{isDirty ? 'UNSAVED CHANGES' : 'SYNCHRONIZED'}</span>
        </div>
      </div>

      <div className="editor-header-right">
        {isDirty && (
          <button
            onClick={onDiscard}
            className="editor-btn"
            title="Discard unsaved changes"
          >
            <ResetIcon size={12} />
            <span>DISCARD</span>
          </button>
        )}

        <button
          onClick={onSave}
          className="editor-btn editor-btn-save"
          title="Save changes to disk and localStorage (Ctrl+S)"
        >
          <SaveIcon size={13} color="#ffffff" />
          <span>SAVE CHANGES</span>
        </button>

        <button
          onClick={onExport}
          className="editor-btn"
          title="Download updated portfolioData.json"
        >
          <DownloadIcon size={13} />
          <span>EXPORT JSON</span>
        </button>

        <label className="editor-btn" title="Import an existing portfolioData.json">
          <UploadIcon size={13} />
          <span>IMPORT JSON</span>
          <input
            type="file"
            accept=".json"
            onChange={onImportFile}
            style={{ display: 'none' }}
          />
        </label>

        <button
          onClick={onReset}
          className="editor-btn editor-btn-danger"
          title="Restore factory defaults"
        >
          <TrashIcon size={12} color="currentColor" />
          <span>FACTORY RESET</span>
        </button>
      </div>
    </header>
  );
}
