import React, { useState, useEffect } from 'react';
import { PodLaserSurface } from '../PodLaserSurface.jsx';
import { LimeInkText, LimeInkBlock } from '../LimeInkText.jsx';
import { getModuleIcon, ExternalLinkIcon } from '../Icons.jsx';
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

  useEffect(() => {
    if (selectedProjectIndex !== null) {
      setIsMobileIndexMinimized(true);
    }
  }, [selectedProjectIndex]);

  if (!activeModule) return null;

  const ModuleView = MODULE_VIEWS[activeModule.id];
  const totalProjects = activeModule.items?.length || 0;
  const selectedProject =
    isSplitMode && activeModule.items ? activeModule.items[selectedProjectIndex] : null;
  const projectBlocks = selectedProject ? getNormalizedProjectBlocks(selectedProject) : [];

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
                              className="archive-detail-figure"
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
                              </div>
                              {block.caption && (
                                <div className="archive-detail-caption">
                                  <span>FIG [{String(bIdx + 1).padStart(2, '0')}]</span>
                                  <span>{block.caption}</span>
                                </div>
                              )}
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
    </div>
  );
}
