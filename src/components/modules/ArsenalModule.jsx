import React from 'react';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';

export function ArsenalModule({ module, inkState }) {
  return (
    <div className="arsenal-grid">
      {module.gear.map((item, idx) => (
        <LimeInkBlock
          key={idx}
          state={inkState}
          delayMin={200 + idx * 80}
          delayMax={600 + idx * 120}
          className="arsenal-card"
        >
          <div className="arsenal-slot">
            <LimeInkText state={inkState} delayMin={250 + idx * 80} delayMax={650 + idx * 100}>
              {`SLOT [${String(idx + 1).padStart(2, '0')}]`}
            </LimeInkText>
          </div>
          <div className="arsenal-title">
            <LimeInkText state={inkState} delayMin={300 + idx * 80} delayMax={780 + idx * 110}>
              {item.title}
            </LimeInkText>
          </div>
          <div className="arsenal-desc">
            <LimeInkText state={inkState} delayMin={380 + idx * 80} delayMax={980 + idx * 120}>
              {item.desc}
            </LimeInkText>
          </div>
        </LimeInkBlock>
      ))}
    </div>
  );
}
