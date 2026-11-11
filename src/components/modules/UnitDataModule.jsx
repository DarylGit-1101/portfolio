import React from 'react';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';

export function UnitDataModule({ module, inkState }) {
  return (
    <div className="unit-data-layout">
      <div className="unit-bio-section">
        {module.biography.map((paragraph, idx) => (
          <p key={idx} className="unit-bio-paragraph">
            <LimeInkText state={inkState} delayMin={200 + idx * 150} delayMax={800 + idx * 200}>
              {paragraph}
            </LimeInkText>
          </p>
        ))}
      </div>

      {/* Specs Grid Box (Appears after optical laser sweep passes through) */}
      <LimeInkBlock
        state={inkState}
        delayMin={750}
        delayMax={950}
        className="unit-specs-grid"
      >
        {module.specs.map((spec) => (
          <div key={spec.label} className="unit-spec-item">
            <div className="unit-spec-label">{spec.label}</div>
            <div className="unit-spec-value">{spec.value}</div>
          </div>
        ))}
      </LimeInkBlock>
    </div>
  );
}
