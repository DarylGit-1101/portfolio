import React, { useState, useEffect, useCallback } from 'react';
import { PodLaserSurface } from '../PodLaserSurface.jsx';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';
import { ExternalLinkIcon, ExpandIcon } from '../Icons.jsx';
import { sound } from '../../utils/audio.js';
import { getNormalizedProjectBlocks } from '../../utils/arrayUtils.js';
import { ArchiveLightboxModal } from './ArchiveLightboxModal.jsx';

/**
 * Left-side expanded project dossier inspection panel in Archive Split Mode.
 * Synchronizes with Pod optical laser scanning, LimeInk thermal text reveal,
 * and opens full-resolution screenshots in the ArchiveLightboxModal.
 */
export function ArchiveDetailPanel({
  selectedProject,
  selectedProjectIndex,
  totalProjects,
  detailLaserState,
  detailInkState,
  onCloseInspection,
  onStepProject
}) {
  const [lightboxBlockIdx, setLightboxBlockIdx] = useState(null);

  useEffect(() => {
    setLightboxBlockIdx(null);
  }, [selectedProjectIndex, selectedProject]);

  const projectBlocks = selectedProject ? getNormalizedProjectBlocks(selectedProject) : [];
  const imageBlocks = projectBlocks
    .map((block, bIdx) => ({ ...block, blockIndex: bIdx }))
    .filter((block) => block.type === 'image_text' && Boolean(block.imageUrl));

  const activeLightboxIdx =
    lightboxBlockIdx !== null
      ? imageBlocks.findIndex((b) => b.blockIndex === lightboxBlockIdx)
      : -1;

  const handleOpenLightbox = useCallback((bIdx) => {
    sound.playSelect();
    setLightboxBlockIdx(bIdx);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    sound.playSelect();
    setLightboxBlockIdx(null);
  }, []);

  const handleStepLightbox = useCallback(
    (delta) => {
      if (activeLightboxIdx < 0 || imageBlocks.length <= 1) return;
      sound.playSelect();
      const nextPos = (activeLightboxIdx + delta + imageBlocks.length) % imageBlocks.length;
      setLightboxBlockIdx(imageBlocks[nextPos].blockIndex);
    },
    [activeLightboxIdx, imageBlocks]
  );

  if (!selectedProject) return null;

  return (
    <div className="dossier-detail-frame">
      <PodLaserSurface state={detailLaserState} />
      <div className="dossier-corner tl">┌</div>
      <div className="dossier-corner tr">┐</div>
      <div className="dossier-corner bl">└</div>
      <div className="dossier-corner br">┘</div>

      {/* Mobile Tactical Record Navigation Bar (Sticky top bar on <= 768px) */}
      <div className="archive-mobile-nav-bar">
        <button
          type="button"
          className="archive-mobile-back-btn"
          onClick={onCloseInspection}
        >
          <span>← ARCHIVE LIST</span>
        </button>

        {totalProjects > 1 && (
          <div className="archive-mobile-stepper">
            <button
              type="button"
              className="archive-mobile-step-btn"
              onClick={() => onStepProject(-1)}
              aria-label="Previous Project"
            >
              ◄
            </button>
            <span className="archive-mobile-step-count">
              {`${String(selectedProjectIndex + 1).padStart(2, '0')} / ${String(
                totalProjects
              ).padStart(2, '0')}`}
            </span>
            <button
              type="button"
              className="archive-mobile-step-btn"
              onClick={() => onStepProject(1)}
              aria-label="Next Project"
            >
              ►
            </button>
          </div>
        )}
      </div>

      <div
        key={`detail-${selectedProjectIndex}`}
        className={`dossier-scroll-area archive-detail-scroll content-decloak-container ${
          detailLaserState === 'scanning' ? 'content-decloak-scanning' : ''
        }`}
      >
        <div className="archive-detail-header">
          <div className="archive-detail-meta-row">
            <span className="archive-detail-code">
              <LimeInkText state={detailInkState} delayMin={100} delayMax={380}>
                {`RECORD // [${String(selectedProjectIndex + 1).padStart(2, '0')}] // ${selectedProject.category}`}
              </LimeInkText>
            </span>
            {selectedProject.stats && (
              <LimeInkBlock
                state={detailInkState}
                delayMin={220}
                delayMax={560}
                className="archive-card-stats"
              >
                {selectedProject.stats}
              </LimeInkBlock>
            )}
          </div>

          <h2 className="archive-detail-title">
            <LimeInkText state={detailInkState} delayMin={180} delayMax={520}>
              {selectedProject.title}
            </LimeInkText>
          </h2>

          {selectedProject.links?.length > 0 && (
            <div className="archive-detail-links">
              {selectedProject.links.map((lnk, lIdx) => (
                <LimeInkBlock
                  key={lIdx}
                  state={detailInkState}
                  delayMin={280 + lIdx * 70}
                  delayMax={680 + lIdx * 90}
                >
                  <a
                    href={lnk.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.playHover()}
                    className="archive-detail-link-btn"
                  >
                    <span>{lnk.label}</span>
                    <ExternalLinkIcon size={11} />
                  </a>
                </LimeInkBlock>
              ))}
            </div>
          )}
        </div>

        <div className="archive-detail-body">
          {selectedProject.description && (
            <p className="archive-detail-desc">
              <LimeInkText state={detailInkState} delayMin={260} delayMax={720}>
                {selectedProject.description}
              </LimeInkText>
            </p>
          )}

          {/* Modular Content Blocks (Long Text & Image + Text Sections) */}
          {projectBlocks.length > 0 && (
            <div className="archive-detail-blocks">
              {projectBlocks.map((block, bIdx) => {
                const isImageBlock = block.type === 'image_text' && block.imageUrl;
                const layoutMode = block.layout || 'stack';
                const baseDelay = 320 + bIdx * 90;

                return (
                  <section
                    key={bIdx}
                    className={`archive-detail-block ${
                      isImageBlock ? `block-layout-${layoutMode}` : 'block-text-only'
                    }`}
                  >
                    {block.heading && (
                      <h3 className="archive-detail-block-heading">
                        <span className="archive-detail-block-pip" />
                        <span>
                          <LimeInkText
                            state={detailInkState}
                            delayMin={baseDelay}
                            delayMax={baseDelay + 350}
                          >
                            {block.heading}
                          </LimeInkText>
                        </span>
                      </h3>
                    )}

                    <div className="archive-detail-block-inner">
                      {isImageBlock && (
                        <LimeInkBlock
                          state={detailInkState}
                          delayMin={baseDelay + 60}
                          delayMax={baseDelay + 480}
                          className="archive-detail-figure is-expandable"
                          onMouseEnter={() => sound.playHover()}
                          onClick={() => handleOpenLightbox(bIdx)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Inspect full-resolution image: ${
                            block.caption ||
                            block.heading ||
                            `${selectedProject.title} figure ${bIdx + 1}`
                          }`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleOpenLightbox(bIdx);
                            }
                          }}
                        >
                          <div className="archive-detail-img-wrap">
                            <img
                              src={block.imageUrl}
                              alt={
                                block.caption ||
                                block.heading ||
                                `${selectedProject.title} figure ${bIdx + 1}`
                              }
                              className="archive-detail-img"
                            />
                            <div className="archive-detail-zoom-badge">
                              <ExpandIcon size={11} />
                              <span>INSPECT FULL-RES</span>
                            </div>
                          </div>
                          <div className="archive-detail-caption">
                            <span>FIG [{String(bIdx + 1).padStart(2, '0')}]</span>
                            <span className="archive-detail-caption-text">
                              {block.caption || block.heading || 'CLICK TO EXPAND IMAGE'}
                            </span>
                          </div>
                        </LimeInkBlock>
                      )}

                      {block.content && (
                        <div className="archive-detail-extended">
                          <LimeInkText
                            state={detailInkState}
                            delayMin={baseDelay + 80}
                            delayMax={baseDelay + 680}
                          >
                            {block.content}
                          </LimeInkText>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {selectedProject.tech?.length > 0 && (
          <div className="archive-detail-tech-section">
            <div className="archive-detail-label">
              <LimeInkText state={detailInkState} delayMin={420} delayMax={820}>
                INSTALLED MODULES &amp; TECH STACK
              </LimeInkText>
            </div>
            <div className="archive-tech-tags">
              {selectedProject.tech.map((t, tIdx) => (
                <LimeInkBlock
                  key={t}
                  state={detailInkState}
                  delayMin={460 + tIdx * 40}
                  delayMax={950 + tIdx * 60}
                  className="archive-tech-tag"
                >
                  {t}
                </LimeInkBlock>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Bottom Quick-Action Footer inside Detail Scroll */}
        <div className="archive-mobile-detail-footer">
          <button
            type="button"
            className="archive-mobile-footer-btn"
            onClick={onCloseInspection}
          >
            <span>← RETURN TO ARCHIVE</span>
          </button>
          {totalProjects > 1 && (
            <button
              type="button"
              className="archive-mobile-footer-btn is-primary"
              onClick={() => onStepProject(1)}
            >
              <span>NEXT RECORD ►</span>
            </button>
          )}
        </div>
      </div>

      {/* Full-Resolution Lightbox Portal */}
      <ArchiveLightboxModal
        projectTitle={selectedProject.title}
        imageBlocks={imageBlocks}
        activeLightboxIdx={activeLightboxIdx}
        onClose={handleCloseLightbox}
        onStep={handleStepLightbox}
      />
    </div>
  );
}
