import React from 'react';
import { ModuleMetaFields, ModuleSectionHeader } from './ModuleMetaFields.jsx';
import { ItemActionControls } from './ItemActionControls.jsx';
import { createModuleListHandlers } from '../../../utils/arrayUtils.js';

export function ArsenalForm({ module, onUpdateModule }) {
  const gearList = createModuleListHandlers(module, 'gear', onUpdateModule);

  const addGear = () => {
    gearList.add({ title: 'INSTRUMENT / HARDWARE', desc: 'Hardware or software role.' });
  };

  return (
    <div className="editor-form-container">
      <ModuleSectionHeader
        module={module}
        suffix="WORKBENCH GEAR"
        actionLabel="ADD GEAR"
        onAction={addGear}
      />

      <ModuleMetaFields module={module} onUpdateModule={onUpdateModule} />

      <div className="editor-grid-2">
        {module.gear.map((g, idx) => (
          <div key={idx} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-badge">
                SLOT [{String(idx + 1).padStart(2, '0')}]
              </span>
              <ItemActionControls
                index={idx}
                total={module.gear.length}
                onMoveUp={() => gearList.move(idx, idx - 1)}
                onMoveDown={() => gearList.move(idx, idx + 1)}
                onDelete={() => gearList.remove(idx)}
              />
            </div>

            <div>
              <label className="editor-label">Tool / Rig Title</label>
              <input
                type="text"
                value={g.title}
                onChange={(e) => gearList.updateField(idx, 'title', e.target.value)}
                className="editor-input"
              />
            </div>

            <div>
              <label className="editor-label">Specification Description</label>
              <textarea
                rows={2}
                value={g.desc}
                onChange={(e) => gearList.updateField(idx, 'desc', e.target.value)}
                className="editor-textarea"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
