import React from 'react';
import { getModuleIcon, UnitDataIcon } from '../Icons.jsx';
import { sound } from '../../utils/audio.js';

function getModuleItemCount(mod) {
  if (mod.items) return mod.items.length;
  if (mod.specs) return mod.specs.length;
  if (mod.categories) return mod.categories.length;
  if (mod.quests) return mod.quests.length;
  if (mod.gear) return mod.gear.length;
  if (mod.channels) return mod.channels.length;
  return 0;
}

export function EditorSidebar({ modules, activeTab, onSelectTab }) {
  const handleSelect = (tabId) => {
    sound.playSelect();
    onSelectTab(tabId);
  };

  return (
    <aside className="editor-sidebar">
      <div className="editor-sidebar-heading">CONFIG MODULES</div>

      {/* Profile Tab */}
      <button
        onClick={() => handleSelect('profile')}
        className={`editor-nav-btn ${activeTab === 'profile' ? 'is-active' : ''}`}
      >
        <div className="editor-nav-label">
          <UnitDataIcon
            size={14}
            color={activeTab === 'profile' ? 'var(--text-main)' : 'var(--text-dim)'}
          />
          <span>[00] PROFILE & CORE</span>
        </div>
        <span className="editor-nav-count">CORE</span>
      </button>

      {/* 6 Portfolio Modules */}
      {modules.map((mod) => {
        const isActive = activeTab === mod.id;
        const count = getModuleItemCount(mod);
        return (
          <button
            key={mod.id}
            onClick={() => handleSelect(mod.id)}
            className={`editor-nav-btn ${isActive ? 'is-active' : ''}`}
          >
            <div className="editor-nav-label">
              {getModuleIcon(mod.id, {
                size: 14,
                color: isActive ? 'var(--text-main)' : 'var(--text-dim)'
              })}
              <span>
                [{mod.code}] {mod.title}
              </span>
            </div>
            <span className="editor-nav-count">{count}</span>
          </button>
        );
      })}

      <div className="editor-sidebar-info">
        <div className="editor-sidebar-info-title">STORAGE LOCATION</div>
        <div>src/data/portfolioData.json</div>
        <div style={{ marginTop: '8px' }}>
          Press <b>Ctrl + S</b> or click <b>SAVE CHANGES</b> to write directly to disk &amp; browser cache.
        </div>
      </div>
    </aside>
  );
}
