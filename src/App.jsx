import React, { useState, useEffect } from 'react';
import { getPortfolioData, subscribeToPortfolioData } from './data/portfolioStorage.js';
import { sound } from './utils/audio.js';
import { useSecretAccess } from './hooks/useSecretAccess.js';
import { useLaserTransition } from './hooks/useLaserTransition.js';
import { PortfolioEditor } from './components/PortfolioEditor.jsx';
import { DiceuCompanion } from './components/DiceuCompanion.jsx';
import { TelemetryHeader } from './components/layout/TelemetryHeader.jsx';
import { ConstellationNav } from './components/layout/ConstellationNav.jsx';
import { DossierContainer } from './components/layout/DossierContainer.jsx';
import { TelemetryFooter } from './components/layout/TelemetryFooter.jsx';

export function App() {
  const [portfolioData, setPortfolioData] = useState(() => getPortfolioData());
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { isEditorOpen, pipClicks, handlePipClick, closeEditor } = useSecretAccess();
  const {
    mode,
    navMode,
    activeModuleId,
    laserState,
    inkState,
    selectedProjectIndex,
    detailLaserState,
    detailInkState,
    selectModule,
    selectProject,
    closeProject,
    resetToCore
  } = useLaserTransition();

  useEffect(() => {
    return subscribeToPortfolioData((updated) => {
      setPortfolioData(updated);
    });
  }, []);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setSoundEnabled(!isMuted);
  };

  if (isEditorOpen) {
    return <PortfolioEditor onExit={closeEditor} />;
  }

  const activeModule = portfolioData.modules.find((m) => m.id === activeModuleId);
  const isArchiveSplit =
    mode === 'top' &&
    activeModuleId === 'archive' &&
    selectedProjectIndex !== null &&
    Boolean(activeModule?.items?.[selectedProjectIndex]);

  // ConstellationNav exits split mode immediately if returning to core ('circle')
  const isNavSplit = isArchiveSplit && navMode === 'top';

  return (
    <div className="portfolio-shell">
      <TelemetryHeader
        profile={portfolioData.profile}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        pipClicks={pipClicks}
        onPipClick={handlePipClick}
      />

      <ConstellationNav
        modules={portfolioData.modules}
        mode={navMode}
        isSplitMode={isNavSplit}
        activeModuleId={activeModuleId}
        onSelectModule={selectModule}
        onResetToCore={resetToCore}
        onCloseSplit={closeProject}
      />

      {mode === 'top' && activeModule && (
        <DossierContainer
          activeModule={activeModule}
          laserState={laserState}
          inkState={inkState}
          isSplitMode={isArchiveSplit}
          selectedProjectIndex={selectedProjectIndex}
          detailLaserState={detailLaserState}
          detailInkState={detailInkState}
          onSelectProject={selectProject}
        />
      )}

      <DiceuCompanion
        mode={navMode}
        activeModule={activeModule}
        laserState={laserState}
      />

      <TelemetryFooter mode={navMode} profile={portfolioData.profile} />
    </div>
  );
}
