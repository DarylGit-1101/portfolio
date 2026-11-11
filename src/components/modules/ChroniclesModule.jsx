import React from 'react';
import { LimeInkText } from '../LimeInkText.jsx';

export function ChroniclesModule({ module, inkState }) {
  return (
    <div className="chronicles-timeline">
      {module.quests.map((quest, idx) => (
        <div key={idx} className="chronicles-item">
          <div className="chronicles-meta">
            <LimeInkText state={inkState} delayMin={250} delayMax={600}>
              {`${quest.year} // ${quest.role}`}
            </LimeInkText>
          </div>

          <h3 className="chronicles-title">
            <LimeInkText state={inkState} delayMin={350} delayMax={800}>
              {quest.title}
            </LimeInkText>
          </h3>

          <p className="chronicles-desc">
            <LimeInkText state={inkState} delayMin={450} delayMax={1100}>
              {quest.description}
            </LimeInkText>
          </p>
        </div>
      ))}
    </div>
  );
}
