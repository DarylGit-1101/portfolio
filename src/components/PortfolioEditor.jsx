import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData,
  exportPortfolioJson
} from '../data/portfolioStorage.js';
import { sound } from '../utils/audio.js';
import { ClearanceGate } from './editor/ClearanceGate.jsx';
import { EditorHeader } from './editor/EditorHeader.jsx';
import { EditorSidebar } from './editor/EditorSidebar.jsx';
import { ProfileForm } from './editor/forms/ProfileForm.jsx';
import { ArchiveForm } from './editor/forms/ArchiveForm.jsx';
import { UnitDataForm } from './editor/forms/UnitDataForm.jsx';
import { ChipConfigForm } from './editor/forms/ChipConfigForm.jsx';
import { ChroniclesForm } from './editor/forms/ChroniclesForm.jsx';
import { ArsenalForm } from './editor/forms/ArsenalForm.jsx';
import { TransmissionsForm } from './editor/forms/TransmissionsForm.jsx';

const MODULE_FORMS = {
  archive: ArchiveForm,
  unit_data: UnitDataForm,
  chip_config: ChipConfigForm,
  chronicles: ChroniclesForm,
  arsenal: ArsenalForm,
  transmissions: TransmissionsForm
};

export function PortfolioEditor({ onExit }) {
  const [data, setData] = useState(() => getPortfolioData());
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(getPortfolioData()));
  const [activeTab, setActiveTab] = useState('archive');
  const [saveStatus, setSaveStatus] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('diceu_admin_auth') === 'true';
    }
    return false;
  });

  const isDirty = useMemo(
    () => JSON.stringify(data) !== savedSnapshot,
    [data, savedSnapshot]
  );

  useEffect(() => {
    if (!saveStatus) return;
    const timer = setTimeout(() => setSaveStatus(null), 3500);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  const handleSave = useCallback(async () => {
    sound.playSelect();
    const res = await savePortfolioData(data);
    setSavedSnapshot(JSON.stringify(data));
    setSaveStatus({
      message: res.diskSaved
        ? 'DATA SYNCHRONIZED // DISK & LOCALSTORAGE UPDATED'
        : 'DATA PERSISTED // LOCALSTORAGE CACHE UPDATED',
      type: 'success'
    });
  }, [data]);

  // Global Ctrl+S / Cmd+S shortcut inside authenticated editor
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, handleSave]);

  const handleDiscard = () => {
    sound.playHover();
    try {
      setData(JSON.parse(savedSnapshot));
      setSaveStatus({
        message: 'UNSAVED MODIFICATIONS DISCARDED',
        type: 'info'
      });
    } catch {
      // Ignore parse error
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all portfolio data back to default factory settings?')) {
      sound.playLaserCollapse();
      const reset = await resetPortfolioData();
      setData(reset);
      setSavedSnapshot(JSON.stringify(reset));
      setSaveStatus({
        message: 'SYSTEM RESTORED // FACTORY DEFAULTS LOADED',
        type: 'info'
      });
    }
  };

  const handleExport = () => {
    sound.playSelect();
    exportPortfolioJson(data);
    setSaveStatus({
      message: 'ARCHIVE EXPORTED // portfolioData.json DOWNLOADED',
      type: 'info'
    });
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!imported.profile || !imported.modules) {
          throw new Error('Missing profile or modules fields in JSON');
        }
        setData(imported);
        await savePortfolioData(imported);
        setSavedSnapshot(JSON.stringify(imported));
        sound.playSelect();
        setSaveStatus({
          message: 'ARCHIVE RESTORED // IMPORTED SUCCESSFULLY',
          type: 'success'
        });
      } catch (err) {
        sound.playLaserCollapse();
        setSaveStatus({
          message: `IMPORT FAILED // ${err.message}`,
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUpdateProfile = (updatedProfile) => {
    setData((prev) => ({ ...prev, profile: updatedProfile }));
  };

  const handleUpdateModule = (updatedModule) => {
    setData((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === updatedModule.id ? updatedModule : m))
    }));
  };

  if (!isAuthenticated) {
    return (
      <ClearanceGate
        expectedKey={data.profile.accessKey || 'diceu'}
        onUnlock={() => {
          sessionStorage.setItem('diceu_admin_auth', 'true');
          setIsAuthenticated(true);
        }}
        onAbort={onExit}
      />
    );
  }

  const activeModule = data.modules.find((m) => m.id === activeTab);
  const ActiveModuleForm = MODULE_FORMS[activeTab];

  return (
    <div className="editor-shell">
      <EditorHeader
        codename={data.profile.codename}
        isDirty={isDirty}
        onExit={onExit}
        onLock={() => {
          sound.playHover();
          sessionStorage.removeItem('diceu_admin_auth');
          setIsAuthenticated(false);
        }}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onExport={handleExport}
        onImportFile={handleImportFile}
        onReset={handleReset}
      />

      {saveStatus && (
        <div className={`editor-toast toast-${saveStatus.type || 'info'}`}>
          {saveStatus.message}
        </div>
      )}

      <div className="editor-body">
        <EditorSidebar
          modules={data.modules}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <main className="editor-workspace">
          {activeTab === 'profile' && (
            <ProfileForm
              profile={data.profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab !== 'profile' && activeModule && ActiveModuleForm && (
            <ActiveModuleForm
              module={activeModule}
              onUpdateModule={handleUpdateModule}
            />
          )}
        </main>
      </div>
    </div>
  );
}
