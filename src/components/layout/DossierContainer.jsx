import React from 'react';
import { PodLaserSurface } from '../PodLaserSurface.jsx';
import { LimeInkText } from '../LimeInkText.jsx';
import { getModuleIcon } from '../Icons.jsx';
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

export function DossierContainer({ activeModule, laserState, inkState }) {
  if (!activeModule) return null;

  const ModuleView = MODULE_VIEWS[activeModule.id];

  return (
    <div className="dossier-wrapper">
      <div className="dossier-frame">
        {/* NieR: Automata Pod Optical Laser Scan & De-Cloak */}
        <PodLaserSurface state={laserState} />

        {/* Fixed Tactical Corner Brackets */}
        <div className="dossier-corner tl">┌</div>
        <div className="dossier-corner tr">┐</div>
        <div className="dossier-corner bl">└</div>
        <div className="dossier-corner br">┘</div>

        {/* Scrollable Content Area Synchronized with Laser Sweep */}
        <div
          key={activeModule.id}
          className={`dossier-scroll-area content-decloak-container ${
            laserState === 'scanning' ? 'content-decloak-scanning' : ''
          }`}
        >
          {/* Active Section Header */}
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

          {/* Active Module View */}
          {ModuleView && <ModuleView module={activeModule} inkState={inkState} />}
        </div>
      </div>
    </div>
  );
}
