import React, { useState, useEffect } from 'react';
import { PodLaserSurface } from '../PodLaserSurface.jsx';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';
import { getModuleIcon, ExternalLinkIcon, ExpandIcon, CloseIcon } from '../Icons.jsx';
import { sound } from '../../utils/audio.js';
import { getNormalizedProjectBlocks } from '../../utils/arrayUtils.js';
import { ArchiveModule } from '../modules/ArchiveModule.jsx';
import { UnitDataModule } from '../modules/UnitDataModule.jsx';
import { ChipConfigModule } from '../modules/ChipConfigModule.jsx';
import { ChroniclesModule } from '../modules/ChroniclesModule.jsx';
import { ArsenalModule } from '../modules/ArsenalModule.jsx';
import { TransmissionsModule } from '../modules/TransmissionsModule.jsx';

const MODULE_VIEWS = {
  archive: ArchiveModule,
  unit_data: UnitDataModule,
  chip_config: ChipConfigModule,
  chronicles: ChroniclesModule,
  arsenal: ArsenalModule,
  transmissions: TransmissionsModule
};

function DossierCorners() {
  return (
    <>
      <div className="dossier-corner tl">┌</div>
      <div className="dossier-corner tr">┐</div>
      <div className="dossier-corner bl">└</div>
      <div className="dossier-corner br">┘</div>
    </>
  );
}

export function DossierContainer({
  activeModule,
  laserState,
  inkState,
  isSplitMode = false,
  selectedProjectIndex = null,
  detailLaserState = 'settled',
  detailInkState = 'revealing',
  onSelectProject,
  onCloseProject
}) {
  const [isMobileIndexMinimized, setIsMobileIndexMinimized] = useState(true);
  const [lightboxBlockIdx, setLightboxBlockIdx] = useState(null);

  useEffect(() => {
    if (selectedProjectIndex !== null) {
      setIsMobileIndexMinimized(true);
    }
    setLightboxBlockIdx(null);
  }, [selectedProjectIndex, isSplitMode, activeModule?.id]);

  if (!activeModule) return null;

  const ModuleView = MODULE_VIEWS[activeModule.id];
  const totalProjects = activeModule.items?.length || 0;
  const selectedProject =
    isSplitMode && activeModule.items ? activeModule.items[selectedProjectIndex] : null;
  const projectBlocks = selectedProject ? getNormalizedProjectBlocks(selectedProject) : [];
  const imageBlocks = projectBlocks
    .map((block, bIdx) => ({ ...block, blockIndex: bIdx }))
    .filter((block) => block.type === 'image_text' && Boolean(block.imageUrl));
  const activeLightboxIdxInImages =
    lightboxBlockIdx !== null
      ? imageBlocks.findIndex((b) => b.blockIndex === lightboxBlockIdx)
      : -1;
  const activeLightboxItem =
    activeLightboxIdxInImages >= 0 ? imageBlocks[activeLightboxIdxInImages] : null;

  useEffect(() => {
    if (activeLightboxIdxInImages < 0) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        sound.playSelect();
        setLightboxBlockIdx(null);
      } else if (e.key === 'ArrowRight' && imageBlocks.length > 1) {
        e.preventDefault();
        sound.playSelect();
        const nextPos = (activeLightboxIdxInImages + 1) % imageBlocks.length;
        setLightboxBlockIdx(imageBlocks[nextPos].blockIndex);
      } else if (e.key === 'ArrowLeft' && imageBlocks.length > 1) {
        e.preventDefault();
        sound.playSelect();
        const prevPos =
          (activeLightboxIdxInImages - 1 + imageBlocks.length) % imageBlocks.length;
        setLightboxBlockIdx(imageBlocks[prevPos].blockIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIdxInImages, imageBlocks]);

  const handleOpenLightbox = (bIdx) => {
    sound.playSelect();
    setLightboxBlockIdx(bIdx);
  };

  const handleCloseLightbox = () => {
    sound.playSelect();
    setLightboxBlockIdx(null);
  };

  const handleStepLightbox = (delta) => {
    if (activeLightboxIdxInImages < 0 || imageBlocks.length <= 1) return;
    sound.playSelect();
    const nextPos =
      (activeLightboxIdxInImages + delta + imageBlocks.length) % imageBlocks.length;
    setLightboxBlockIdx(imageBlocks[nextPos].blockIndex);
  };

  const handleCloseInspection = () => {
    sound.playSelect();
    if (onCloseProject) {
      onCloseProject();
    } else if (onSelectProject) {
      onSelectProject(null);
    }
  };

  const handleStepProject = (delta) => {
    if (!totalProjects || selectedProjectIndex === null || !onSelectProject) return;
    sound.playSelect();
    const nextIdx = (selectedProjectIndex + delta + totalProjects) % totalProjects;
    onSelectProject(nextIdx);
  };

  const handleToggleMobileIndex = () => {
    sound.playSelect();
    setIsMobileIndexMinimized((prev) => !prev);
  };

  const handleArchiveCardSelect = (idx) => {
    if (!onSelectProject) return;
    const isMobileViewport =
      typeof window !== 'undefined' &&
      (document.documentElement.clientWidth || window.innerWidth) <= 768;

    if (isSplitMode && isMobileViewport && idx === selectedProjectIndex) {
      setIsMobileIndexMinimized(true);
      return;
    }
    onSelectProject(idx === selectedProjectIndex ? null : idx);
  };

  return (
    <div
      className={`dossier-wrapper ${isSplitMode ? 'is-split-mode' : ''} ${
        isSplitMode
          ? isMobileIndexMinimized
            ? 'is-mobile-index-minimized'
            : 'is-mobile-index-expanded'
          : ''
      }`}
    >
      {/* Left Side Expanded Project Inspection View (Synchronized with Pod Laser & LimeInk) */}
      {isSplitMode && selectedProject && (
        <div className="dossier-detail-frame">
          <PodLaserSurface state={detailLaserState} />
          <DossierCorners />

          {/* Mobile Tactical Record Navigation Bar (Sticky top bar on <= 768px) */}
          <div className="archive-mobile-nav-bar">
            <button
              type="button"
              className="archive-mobile-back-btn"
              onClick={handleCloseInspection}
            >
              <span>← ARCHIVE LIST</span>
            </button>

            {totalProjects > 1 && (
              <div className="archive-mobile-stepper">
                <button
                  type="button"
                  className="archive-mobile-step-btn"
                  onClick={() => handleStepProject(-1)}
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
                  onClick={() => handleStepProject(1)}
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
                                block.caption || block.heading || `${selectedProject.title} figure ${bIdx + 1}`
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
                onClick={handleCloseInspection}
              >
                <span>← RETURN TO ARCHIVE</span>
              </button>
              {totalProjects > 1 && (
                <button
                  type="button"
                  className="archive-mobile-footer-btn is-primary"
                  onClick={() => handleStepProject(1)}
                >
                  <span>NEXT RECORD ►</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Dossier Frame (Centered in normal mode, narrowed & moved to furthest right in Split Mode, Collapsible Index Drawer on Mobile Split Mode) */}
      <div className="dossier-frame">
        {/* NieR: Automata Pod Optical Laser Scan & De-Cloak */}
        <PodLaserSurface state={laserState} />
        <DossierCorners />

        {/* Mobile Minimizable Archive Index Drawer Bar (Visible on <= 768px in Split Mode) */}
        {isSplitMode && (
          <button
            type="button"
            className="dossier-mobile-drawer-bar"
            onClick={handleToggleMobileIndex}
          >
            <span className="dossier-mobile-drawer-left">
              <span className="dossier-mobile-drawer-pip" />
              <span className="dossier-mobile-drawer-title">
                {`[${activeModule.code}] ARCHIVE INDEX // ${String(totalProjects).padStart(
                  2,
                  '0'
                )} RECORDS`}
              </span>
            </span>
            <span className="dossier-mobile-drawer-toggle">
              {isMobileIndexMinimized ? '▲ EXPAND LIST' : '▼ MINIMIZE'}
            </span>
          </button>
        )}

        {/* Scrollable Content Area Synchronized with Laser Sweep */}
        <div
          key={activeModule.id}
          className={`dossier-scroll-area content-decloak-container ${
            laserState === 'scanning' ? 'content-decloak-scanning' : ''
          }`}
        >
          {/* Active Section Header (Compact in Split Mode) */}
          {!isSplitMode ? (
            <div className="dossier-module-header">
              <div className="dossier-module-icon-box">
                {getModuleIcon(activeModule.id, { size: 26 })}
              </div>

              <div>
                <div className="dossier-module-meta">
                  <LimeInkText state={inkState} delayMin={100} delayMax={400}>
                    {`SYSTEM // [${activeModule.code}] // ${activeModule.subtitle}`}
                  </LimeInkText>
                </div>

                <h2 className="dossier-module-title">
                  <LimeInkText state={inkState} delayMin={200} delayMax={600}>
                    {activeModule.title}
                  </LimeInkText>
                </h2>

                <p className="dossier-module-tagline">
                  <LimeInkText state={inkState} delayMin={300} delayMax={800}>
                    {activeModule.tagline}
                  </LimeInkText>
                </p>
              </div>
            </div>
          ) : (
            <div className="dossier-split-sidebar-header">
              <span className="dossier-split-sidebar-code">
                <LimeInkText state={inkState} delayMin={120} delayMax={400}>
                  {`[${activeModule.code}] // ${activeModule.title} INDEX`}
                </LimeInkText>
              </span>
              <span className="dossier-split-sidebar-count">
                <LimeInkText state={inkState} delayMin={180} delayMax={480}>
                  {`${String(activeModule.items?.length || 0).padStart(2, '0')} RECORDS`}
                </LimeInkText>
              </span>
            </div>
          )}

          {/* Active Module View */}
          {ModuleView && (
            <ModuleView
              module={activeModule}
              inkState={inkState}
              isSplitMode={isSplitMode}
              selectedProjectIndex={selectedProjectIndex}
              onSelectProject={handleArchiveCardSelect}
            />
          )}
        </div>
      </div>

      {/* Tactical Full-Resolution Optical Lightbox Modal */}
      {activeLightboxItem && selectedProject && (
        <div
          className="archive-lightbox-backdrop"
          onClick={handleCloseLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Full-resolution image inspection"
        >
          <div
            className="archive-lightbox-frame"
            onClick={(e) => e.stopPropagation()}
          >
            <DossierCorners />

            <div className="archive-lightbox-header">
              <div className="archive-lightbox-meta">
                <span className="archive-detail-block-pip" />
                <span className="archive-lightbox-code">
                  {`OPTICAL INSPECTION // FIG [${String(
                    activeLightboxItem.blockIndex + 1
                  ).padStart(2, '0')}]`}
                </span>
                <span className="archive-lightbox-divider">//</span>
                <span className="archive-lightbox-title">
                  {activeLightboxItem.heading ||
                    activeLightboxItem.caption ||
                    selectedProject.title}
                </span>
              </div>

              <div className="archive-lightbox-controls">
                {imageBlocks.length > 1 && (
                  <div className="archive-lightbox-stepper">
                    <button
                      type="button"
                      className="archive-lightbox-step-btn"
                      onMouseEnter={() => sound.playHover()}
                      onClick={() => handleStepLightbox(-1)}
                      aria-label="Previous image"
                    >
                      ◄
                    </button>
                    <span className="archive-lightbox-step-count">
                      {`${String(activeLightboxIdxInImages + 1).padStart(2, '0')} / ${String(
                        imageBlocks.length
                      ).padStart(2, '0')}`}
                    </span>
                    <button
                      type="button"
                      className="archive-lightbox-step-btn"
                      onMouseEnter={() => sound.playHover()}
                      onClick={() => handleStepLightbox(1)}
                      aria-label="Next image"
                    >
                      ►
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="archive-lightbox-close-btn"
                  onMouseEnter={() => sound.playHover()}
                  onClick={handleCloseLightbox}
                >
                  <CloseIcon size={12} />
                  <span>CLOSE [ESC]</span>
                </button>
              </div>
            </div>

            <div className="archive-lightbox-stage">
              <img
                src={activeLightboxItem.imageUrl}
                alt={
                  activeLightboxItem.caption ||
                  activeLightboxItem.heading ||
                  selectedProject.title
                }
                className="archive-lightbox-img"
              />
            </div>

            {(activeLightboxItem.caption || activeLightboxItem.content) && (
              <div className="archive-lightbox-footer">
                {activeLightboxItem.caption && (
                  <div className="archive-lightbox-caption">
                    <span className="archive-lightbox-caption-tag">
                      {`FIG [${String(activeLightboxItem.blockIndex + 1).padStart(2, '0')}]`}
                    </span>
                    <span>{activeLightboxItem.caption}</span>
                  </div>
                )}
                {activeLightboxItem.content && (
                  <p className="archive-lightbox-desc">{activeLightboxItem.content}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
