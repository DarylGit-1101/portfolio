import React, { useState, useEffect } from 'react';
import { PodLaserSurface } from '../PodLaserSurface.jsx';
import { LimeInkText } from '../LimeInkText.jsx';
import { getModuleIcon } from '../Icons.jsx';
import { sound } from '../../utils/audio.js';
import { ArchiveModule } from '../modules/ArchiveModule.jsx';
import { ArchiveDetailPanel } from '../modules/ArchiveDetailPanel.jsx';
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
        <ArchiveDetailPanel
          selectedProject={selectedProject}
          selectedProjectIndex={selectedProjectIndex}
          totalProjects={totalProjects}
          detailLaserState={detailLaserState}
          detailInkState={detailInkState}
          onCloseInspection={handleCloseInspection}
          onStepProject={handleStepProject}
        />
      )}

      {/* Main Dossier Frame (Centered in normal mode, narrowed & moved to furthest right in Split Mode) */}
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
