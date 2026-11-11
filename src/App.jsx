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
    activeModuleId,
    laserState,
    inkState,
    selectModule,
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
        mode={mode}
        activeModuleId={activeModuleId}
        onSelectModule={selectModule}
        onResetToCore={resetToCore}
      />

      {mode === 'top' && activeModule && (
        <DossierContainer
          activeModule={activeModule}
          laserState={laserState}
          inkState={inkState}
        />
      )}

      <DiceuCompanion
        mode={mode}
        activeModule={activeModule}
        laserState={laserState}
      />

      <TelemetryFooter mode={mode} profile={portfolioData.profile} />
    </div>
  );
}
