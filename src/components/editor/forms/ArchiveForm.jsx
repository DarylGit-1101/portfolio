import React from 'react';
import { CloseIcon } from '../../Icons.jsx';
import { ModuleMetaFields, ModuleSectionHeader } from './ModuleMetaFields.jsx';
import { ItemActionControls } from './ItemActionControls.jsx';
import { createModuleListHandlers, removeArrayItem } from '../../../utils/arrayUtils.js';

export function ArchiveForm({ module, onUpdateModule }) {
  const projects = createModuleListHandlers(module, 'items', onUpdateModule, { prepend: true });

  const addProject = () => {
    projects.add({
      title: 'NEW PROJECT TITLE',
      category: 'GAME SYSTEM // PROTOTYPE',
      tech: ['React', 'JavaScript'],
      description: 'Description of the newly created interactive experience.',
      stats: '60 FPS // STABLE'
    });
  };

  const addTechTag = (projIndex, tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const currentTech = module.items[projIndex].tech;
    projects.updateField(projIndex, 'tech', [...currentTech, trimmed]);
  };

  const removeTechTag = (projIndex, tagIndex) => {
    const currentTech = module.items[projIndex].tech;
    projects.updateField(projIndex, 'tech', removeArrayItem(currentTech, tagIndex));
  };

  return (
    <div className="editor-form-container">
      <ModuleSectionHeader
        module={module}
        suffix="PROJECTS"
        actionLabel="ADD NEW PROJECT"
        onAction={addProject}
      />

      <ModuleMetaFields module={module} onUpdateModule={onUpdateModule} />

      <div className="editor-items-stack">
        {module.items.map((proj, pIdx) => (
          <div key={pIdx} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-badge">
                PROJECT [{String(pIdx + 1).padStart(2, '0')}] // {proj.title}
              </span>
              <ItemActionControls
                index={pIdx}
                total={module.items.length}
                onMoveUp={() => projects.move(pIdx, pIdx - 1)}
                onMoveDown={() => projects.move(pIdx, pIdx + 1)}
                onDelete={() => projects.remove(pIdx)}
                deleteLabel="DELETE"
              />
            </div>

            <div className="editor-grid-3">
              <div>
                <label className="editor-label">Project Title</label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => projects.updateField(pIdx, 'title', e.target.value)}
                  className="editor-input"
                />
              </div>
              <div>
                <label className="editor-label">Category</label>
                <input
                  type="text"
                  value={proj.category}
                  onChange={(e) => projects.updateField(pIdx, 'category', e.target.value)}
                  className="editor-input"
                />
              </div>
              <div>
                <label className="editor-label">Stats Badge</label>
                <input
                  type="text"
                  value={proj.stats}
                  onChange={(e) => projects.updateField(pIdx, 'stats', e.target.value)}
                  className="editor-input"
                />
              </div>
            </div>

            <div>
              <label className="editor-label">Description</label>
              <textarea
                rows={3}
                value={proj.description}
                onChange={(e) => projects.updateField(pIdx, 'description', e.target.value)}
                className="editor-textarea"
              />
            </div>

            <div>
              <label className="editor-label">Technology Tags</label>
              <div className="editor-tags-row">
                {proj.tech.map((t, tIdx) => (
                  <span key={tIdx} className="editor-tag-pill">
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTechTag(pIdx, tIdx)}
                      className="editor-tag-remove"
                      title="Remove tag"
                    >
                      <CloseIcon size={10} />
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  placeholder="+ Add tag (Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTechTag(pIdx, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="editor-input editor-tag-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
