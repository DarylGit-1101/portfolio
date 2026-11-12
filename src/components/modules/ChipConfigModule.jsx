import React from 'react';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';

export function ChipConfigModule({ module, inkState }) {
  return (
    <div className="chip-sectors-list">
      {module.categories.map((cat) => (
        <div key={cat.category} className="chip-sector-card">
          <h3 className="chip-sector-header">
            <LimeInkText state={inkState} delayMin={200} delayMax={600}>
              {cat.category}
            </LimeInkText>
          </h3>

          <div className="chip-sector-grid">
            {cat.chips.map((item) => (
              <LimeInkBlock
                key={item.name}
                state={inkState}
                delayMin={350}
                delayMax={1000}
                className="chip-item"
              >
                <div className="chip-item-top">
                  <span className="chip-item-name">
                    <LimeInkText state={inkState} delayMin={300} delayMax={850}>
                      {item.name}
                    </LimeInkText>
                  </span>
                  <span className="chip-item-val">
                    <LimeInkText state={inkState} delayMin={400} delayMax={950}>
                      {item.value}
                    </LimeInkText>
                  </span>
                </div>
                <div className="chip-bar-track">
                  <div className="chip-bar-fill" style={{ width: item.value }} />
                </div>
              </LimeInkBlock>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
