import React from 'react';
import { getChannelIcon } from '../../Icons.jsx';
import { ModuleMetaFields, ModuleSectionHeader } from './ModuleMetaFields.jsx';
import { ItemActionControls } from './ItemActionControls.jsx';
import { createModuleListHandlers } from '../../../utils/arrayUtils.js';

export function TransmissionsForm({ module, onUpdateModule }) {
  const channels = createModuleListHandlers(module, 'channels', onUpdateModule);

  const addChannel = () => {
    channels.add({ label: 'CHANNEL PROTOCOL', address: 'handle / link', href: 'https://' });
  };

  return (
    <div className="editor-form-container">
      <ModuleSectionHeader
        module={module}
        suffix="COMMUNICATION UPLINKS"
        actionLabel="ADD UPLINK CHANNEL"
        onAction={addChannel}
      />

      <ModuleMetaFields module={module} onUpdateModule={onUpdateModule} />

      <div className="editor-items-stack">
        {module.channels.map((comm, idx) => (
          <div key={idx} className="editor-card">
            <div className="editor-card-header">
              <span
                className="editor-card-badge"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {getChannelIcon(comm.label, { size: 13 })}
                <span>
                  UPLINK [{String(idx + 1).padStart(2, '0')}] // {comm.label}
                </span>
              </span>
              <ItemActionControls
                index={idx}
                total={module.channels.length}
                onMoveUp={() => channels.move(idx, idx - 1)}
                onMoveDown={() => channels.move(idx, idx + 1)}
                onDelete={() => channels.remove(idx)}
                deleteLabel="DELETE"
              />
            </div>

            <div className="editor-channel-row">
              <div>
                <label className="editor-label">Protocol Label</label>
                <input
                  type="text"
                  value={comm.label}
                  onChange={(e) => channels.updateField(idx, 'label', e.target.value)}
                  className="editor-input"
                />
              </div>

              <div>
                <label className="editor-label">Display Address</label>
                <input
                  type="text"
                  value={comm.address}
                  onChange={(e) => channels.updateField(idx, 'address', e.target.value)}
                  className="editor-input"
                />
              </div>

              <div>
                <label className="editor-label">Target URL / Href</label>
                <input
                  type="text"
                  value={comm.href}
                  onChange={(e) => channels.updateField(idx, 'href', e.target.value)}
                  className="editor-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
