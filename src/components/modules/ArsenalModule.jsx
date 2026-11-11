import React from 'react';
import { LimeInkBlock } from '../LimeInkText.jsx';

export function ArsenalModule({ module, inkState }) {
  return (
    <div className="arsenal-grid">
      {module.gear.map((item, idx) => (
        <LimeInkBlock
          key={idx}
          state={inkState}
          delayMin={250 + idx * 100}
          delayMax={700 + idx * 150}
          className="arsenal-card"
        >
          <div className="arsenal-slot">
            SLOT [{String(idx + 1).padStart(2, '0')}]
          </div>
          <div className="arsenal-title">{item.title}</div>
          <div className="arsenal-desc">{item.desc}</div>
        </LimeInkBlock>
      ))}
    </div>
  );
}
