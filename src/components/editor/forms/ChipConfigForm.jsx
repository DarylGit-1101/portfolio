import React from 'react';
import { PlusIcon, CloseIcon } from '../../Icons.jsx';
import { ModuleMetaFields, ModuleSectionHeader } from './ModuleMetaFields.jsx';
import { ItemActionControls } from './ItemActionControls.jsx';
import {
  createModuleListHandlers,
  updateArrayItem,
  removeArrayItem
} from '../../../utils/arrayUtils.js';

export function ChipConfigForm({ module, onUpdateModule }) {
  const categories = createModuleListHandlers(module, 'categories', onUpdateModule);

  const addCategory = () => {
    categories.add({
      category: 'NEW SKILL SECTOR',
      chips: [{ name: 'Primary Capability', value: '85%' }]
    });
  };

  const addChip = (catIdx) => {
    const currentChips = module.categories[catIdx].chips;
    categories.updateField(catIdx, 'chips', [
      ...currentChips,
      { name: 'Skill Module', value: '88%' }
    ]);
  };

  const updateChip = (catIdx, chipIdx, field, value) => {
    const currentChips = module.categories[catIdx].chips;
    categories.updateField(
      catIdx,
      'chips',
      updateArrayItem(currentChips, chipIdx, { [field]: value })
    );
  };

  const deleteChip = (catIdx, chipIdx) => {
    const currentChips = module.categories[catIdx].chips;
    categories.updateField(catIdx, 'chips', removeArrayItem(currentChips, chipIdx));
  };

  return (
    <div className="editor-form-container">
      <ModuleSectionHeader
        module={module}
        suffix="SKILL MATRIX"
        actionLabel="ADD SKILL SECTOR"
        onAction={addCategory}
      />

      <ModuleMetaFields module={module} onUpdateModule={onUpdateModule} />

      <div className="editor-items-stack">
        {module.categories.map((cat, cIdx) => (
          <div key={cIdx} className="editor-card">
            <div className="editor-card-header">
              <span className="editor-card-badge">
                SECTOR [{String(cIdx + 1).padStart(2, '0')}]
              </span>
              <div className="editor-item-actions">
                <button type="button" onClick={() => addChip(cIdx)} className="editor-btn">
                  <PlusIcon size={11} />
                  <span>ADD SKILL</span>
                </button>
                <ItemActionControls
                  index={cIdx}
                  total={module.categories.length}
                  onMoveUp={() => categories.move(cIdx, cIdx - 1)}
                  onMoveDown={() => categories.move(cIdx, cIdx + 1)}
                  onDelete={() => categories.remove(cIdx)}
                  deleteLabel="DELETE SECTOR"
                />
              </div>
            </div>

            <div>
              <label className="editor-label">Sector Heading</label>
              <input
                type="text"
                value={cat.category}
                onChange={(e) => categories.updateField(cIdx, 'category', e.target.value)}
                className="editor-input"
              />
            </div>

            <div className="editor-grid-2">
              {cat.chips.map((chip, chIdx) => (
                <div key={chIdx} className="editor-chip-box">
                  <div className="editor-chip-controls">
                    <input
                      type="text"
                      placeholder="Skill Name"
                      value={chip.name}
                      onChange={(e) => updateChip(cIdx, chIdx, 'name', e.target.value)}
                      className="editor-input"
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      placeholder="90%"
                      value={chip.value}
                      onChange={(e) => updateChip(cIdx, chIdx, 'value', e.target.value)}
                      className="editor-input"
                      style={{ width: '70px', textAlign: 'center' }}
                    />
                    <button
                      type="button"
                      onClick={() => deleteChip(cIdx, chIdx)}
                      className="editor-btn editor-btn-danger editor-btn-icon"
                      title="Remove skill"
                    >
                      <CloseIcon size={11} color="currentColor" />
                    </button>
                  </div>
                  <div className="editor-chip-preview-track">
                    <div
                      className="editor-chip-preview-fill"
                      style={{ width: chip.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
