import React from 'react';
import { ModuleMetaFields, ModuleSectionHeader } from './ModuleMetaFields.jsx';
import { ItemActionControls } from './ItemActionControls.jsx';
import { createModuleListHandlers } from '../../../utils/arrayUtils.js';

export function ChroniclesForm({ module, onUpdateModule }) {
  const quests = createModuleListHandlers(module, 'quests', onUpdateModule, { prepend: true });

  const addQuest = () => {
    quests.add({
      year: '2026',
      title: 'MILESTONE OR PROJECT TITLE',
      role: 'LEAD DEVELOPER',
      description: 'Detailed description of the accomplishments and objectives completed.'
    });
  };

  return (
    <div className="editor-form-container">
      <ModuleSectionHeader
        module={module}
        suffix="TIMELINE & QUESTS"
        actionLabel="ADD TIMELINE QUEST"
        onAction={addQuest}
      />

      <ModuleMetaFields module={module} onUpdateModule={onUpdateModule} />

      <div className="editor-items-stack">
        {module.quests.map((q, idx) => (
          <div key={idx} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-badge">
                MILESTONE [{String(idx + 1).padStart(2, '0')}] // {q.year}
              </span>
              <ItemActionControls
                index={idx}
                total={module.quests.length}
                onMoveUp={() => quests.move(idx, idx - 1)}
                onMoveDown={() => quests.move(idx, idx + 1)}
                onDelete={() => quests.remove(idx)}
                deleteLabel="DELETE"
              />
            </div>

            <div className="editor-grid-2">
              <div>
                <label className="editor-label">Timeline Period (Year)</label>
                <input
                  type="text"
                  value={q.year}
                  onChange={(e) => quests.updateField(idx, 'year', e.target.value)}
                  className="editor-input"
                />
              </div>
              <div>
                <label className="editor-label">Designation / Role</label>
                <input
                  type="text"
                  value={q.role}
                  onChange={(e) => quests.updateField(idx, 'role', e.target.value)}
                  className="editor-input"
                />
              </div>
            </div>

            <div>
              <label className="editor-label">Milestone Title</label>
              <input
                type="text"
                value={q.title}
                onChange={(e) => quests.updateField(idx, 'title', e.target.value)}
                className="editor-input"
              />
            </div>

            <div>
              <label className="editor-label">Quest Description</label>
              <textarea
                rows={3}
                value={q.description}
                onChange={(e) => quests.updateField(idx, 'description', e.target.value)}
                className="editor-textarea"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
