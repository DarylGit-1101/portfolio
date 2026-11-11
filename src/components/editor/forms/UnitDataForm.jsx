import React from 'react';
import { PlusIcon } from '../../Icons.jsx';
import { ModuleMetaFields, ModuleSectionHeader } from './ModuleMetaFields.jsx';
import { ItemActionControls } from './ItemActionControls.jsx';
import { createModuleListHandlers } from '../../../utils/arrayUtils.js';

export function UnitDataForm({ module, onUpdateModule }) {
  const biography = createModuleListHandlers(module, 'biography', onUpdateModule);
  const specs = createModuleListHandlers(module, 'specs', onUpdateModule);

  const addBioParagraph = () => {
    biography.add('New biography paragraph statement.');
  };

  const addSpec = () => {
    specs.add({ label: 'NEW SPEC', value: 'PARAMETER VALUE' });
  };

  return (
    <div className="editor-form-container">
      <ModuleSectionHeader module={module} suffix="BIOGRAPHY & SPECS" />

      <ModuleMetaFields module={module} onUpdateModule={onUpdateModule} />

      {/* Biography Section */}
      <div className="editor-card">
        <div className="editor-card-header">
          <span className="editor-card-badge">BIOGRAPHY PARAGRAPHS</span>
          <button onClick={addBioParagraph} className="editor-btn editor-btn-primary">
            <PlusIcon size={12} color="currentColor" />
            <span>ADD PARAGRAPH</span>
          </button>
        </div>

        <div className="editor-items-stack">
          {module.biography.map((p, idx) => (
            <div key={idx} className="editor-chip-box">
              <div className="editor-card-header">
                <span className="editor-label" style={{ margin: 0 }}>
                  PARAGRAPH [{String(idx + 1).padStart(2, '0')}]
                </span>
                <ItemActionControls
                  index={idx}
                  total={module.biography.length}
                  onMoveUp={() => biography.move(idx, idx - 1)}
                  onMoveDown={() => biography.move(idx, idx + 1)}
                  onDelete={() => biography.remove(idx)}
                />
              </div>
              <textarea
                rows={3}
                value={p}
                onChange={(e) => biography.replace(idx, e.target.value)}
                className="editor-textarea"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div className="editor-card">
        <div className="editor-card-header">
          <span className="editor-card-badge">TECHNICAL SPECS &amp; DIRECTIVES</span>
          <button onClick={addSpec} className="editor-btn editor-btn-primary">
            <PlusIcon size={12} color="currentColor" />
            <span>ADD SPEC</span>
          </button>
        </div>

        <div className="editor-grid-2">
          {module.specs.map((s, idx) => (
            <div key={idx} className="editor-chip-box">
              <div className="editor-card-header">
                <span className="editor-label" style={{ margin: 0 }}>
                  SPEC [{String(idx + 1).padStart(2, '0')}]
                </span>
                <ItemActionControls
                  index={idx}
                  total={module.specs.length}
                  onMoveUp={() => specs.move(idx, idx - 1)}
                  onMoveDown={() => specs.move(idx, idx + 1)}
                  onDelete={() => specs.remove(idx)}
                />
              </div>
              <div>
                <label className="editor-label">Spec Label</label>
                <input
                  type="text"
                  placeholder="SPEC LABEL"
                  value={s.label}
                  onChange={(e) => specs.updateField(idx, 'label', e.target.value)}
                  className="editor-input"
                />
              </div>
              <div>
                <label className="editor-label">Spec Value</label>
                <input
                  type="text"
                  placeholder="SPEC VALUE"
                  value={s.value}
                  onChange={(e) => specs.updateField(idx, 'value', e.target.value)}
                  className="editor-input"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
