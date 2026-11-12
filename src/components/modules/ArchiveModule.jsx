import React from 'react';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';
import { sound } from '../../utils/audio.js';

export function ArchiveModule({
  module,
  inkState,
  isSplitMode = false,
  selectedProjectIndex = null,
  onSelectProject
}) {
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
    <div className={`archive-list ${isSplitMode ? 'is-compact-list' : ''}`}>
      {module.items.map((proj, idx) => {
        const isSelected = selectedProjectIndex === idx;

        return (
          <article
            key={idx}
            onMouseEnter={() => sound.playHover()}
            onClick={() => {
              if (onSelectProject) {
                sound.playSelect();
                onSelectProject(isSelected ? null : idx);
              }
            }}
            className={`archive-card is-interactive ${isSelected ? 'is-selected' : ''}`}
          >
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

              {!isSplitMode && proj.stats && (
                <LimeInkBlock
                  state={inkState}
                  delayMin={400}
                  delayMax={900}
                  className="archive-card-stats"
                >
                  {proj.stats}
                </LimeInkBlock>
              )}
            </div>

            <div className="archive-card-category">
              <LimeInkText state={inkState} delayMin={350} delayMax={800}>
                {proj.category}
              </LimeInkText>
            </div>

            {!isSplitMode && (
              <>
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
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
