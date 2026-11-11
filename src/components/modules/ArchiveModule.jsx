import React from 'react';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';

export function ArchiveModule({ module, inkState }) {
  if (!module.items || module.items.length === 0) {
    return (
      <LimeInkBlock
        state={inkState}
        delayMin={250}
        delayMax={600}
        className="archive-empty-state"
      >
        <div className="archive-empty-code">ARCHIVE STATUS // NO ENTRIES LOGGED</div>
        <p className="archive-empty-desc">
          Project dossiers are currently being compiled or classified. Use the Archive Configuration Terminal to register new works.
        </p>
      </LimeInkBlock>
    );
  }

  return (
    <div className="archive-list">
      {module.items.map((proj, idx) => (
        <article key={idx} className="archive-card">
          <div className="archive-card-top">
            <div className="archive-card-title-group">
              <span className="archive-card-index">
                <LimeInkText state={inkState} delayMin={200} delayMax={500}>
                  {`[${String(idx + 1).padStart(2, '0')}]`}
                </LimeInkText>
              </span>
              <h3 className="archive-card-title">
                <LimeInkText state={inkState} delayMin={250} delayMax={700}>
                  {proj.title}
                </LimeInkText>
              </h3>
            </div>

            <LimeInkBlock
              state={inkState}
              delayMin={400}
              delayMax={900}
              className="archive-card-stats"
            >
              {proj.stats}
            </LimeInkBlock>
          </div>

          <div className="archive-card-category">
            <LimeInkText state={inkState} delayMin={350} delayMax={800}>
              {proj.category}
            </LimeInkText>
          </div>

          <p className="archive-card-desc">
            <LimeInkText state={inkState} delayMin={400} delayMax={1100}>
              {proj.description}
            </LimeInkText>
          </p>

          <div className="archive-tech-tags">
            {proj.tech.map((t) => (
              <LimeInkBlock
                key={t}
                state={inkState}
                delayMin={500}
                delayMax={1200}
                className="archive-tech-tag"
              >
                {t}
              </LimeInkBlock>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
