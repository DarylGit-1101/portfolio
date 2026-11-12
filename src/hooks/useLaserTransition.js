import { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio.js';

/**
 * Manages the state machine for the Shuriken/Dice constellation, Pod optical laser transitions,
 * and Archive split-view project inspection transitions.
 * Safely clears active timers to prevent race conditions during rapid clicks.
 */
export function useLaserTransition() {
  const [mode, setMode] = useState('circle'); // 'circle' | 'top'
  const [isReturningToCore, setIsReturningToCore] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [laserState, setLaserState] = useState('idle'); // 'idle' | 'scanning' | 'settled' | 'collapsing'

  // Archive Split-Inspection State
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [detailLaserState, setDetailLaserState] = useState('idle'); // 'idle' | 'scanning' | 'settled' | 'collapsing'

  const timersRef = useRef([]);
  const detailTimersRef = useRef([]);

  const clearPendingTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  const clearDetailTimers = useCallback(() => {
    detailTimersRef.current.forEach((id) => clearTimeout(id));
    detailTimersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const scheduleDetailTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    detailTimersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      clearPendingTimers();
      clearDetailTimers();
    };
  }, [clearPendingTimers, clearDetailTimers]);

  const closeProject = useCallback(() => {
    if (selectedProjectIndex === null) return;
    clearDetailTimers();
    sound.playLaserCollapse();
    setDetailLaserState('collapsing');

    scheduleDetailTimer(() => {
      setSelectedProjectIndex(null);
      setDetailLaserState('idle');
    }, 420);
  }, [selectedProjectIndex, clearDetailTimers, scheduleDetailTimer]);

  const selectProject = useCallback(
    (projIdx) => {
      if (projIdx === null || projIdx === selectedProjectIndex) {
        closeProject();
        return;
      }

      clearDetailTimers();

      if (selectedProjectIndex === null) {
        sound.playLaserScan();
        setSelectedProjectIndex(projIdx);
        setDetailLaserState('scanning');

        scheduleDetailTimer(() => {
          setDetailLaserState('settled');
        }, 1400);
      } else {
        // Switching from one open project directly to another:
        // Collapse/dry current project first, then laser-scan the new project
        sound.playLaserCollapse();
        setDetailLaserState('collapsing');

        scheduleDetailTimer(() => {
          sound.playLaserScan();
          setSelectedProjectIndex(projIdx);
          setDetailLaserState('scanning');

          scheduleDetailTimer(() => {
            setDetailLaserState('settled');
          }, 1400);
        }, 380);
      }
    },
    [selectedProjectIndex, closeProject, clearDetailTimers, scheduleDetailTimer]
  );

  const selectModule = useCallback(
    (moduleId) => {
      sound.playSelect();

      if (mode === 'circle') {
        clearPendingTimers();
        clearDetailTimers();
        sound.playLaserScan();
        setIsReturningToCore(false);
        setSelectedProjectIndex(null);
        setDetailLaserState('idle');
        setMode('top');
        setActiveModuleId(moduleId);
        setLaserState('scanning');

        scheduleTimer(() => {
          setLaserState('settled');
        }, 1400);
      } else {
        if (moduleId === activeModuleId) {
          // If already in Archive and inspecting a project, clicking the Archive star closes inspection
          if (selectedProjectIndex !== null) {
            closeProject();
          }
          return;
        }

        clearPendingTimers();
        clearDetailTimers();
        sound.playLaserCollapse();
        setIsReturningToCore(false);
        setLaserState('collapsing');
        if (selectedProjectIndex !== null) {
          setDetailLaserState('collapsing');
        }

        scheduleTimer(() => {
          sound.playLaserScan();
          setSelectedProjectIndex(null);
          setDetailLaserState('idle');
          setActiveModuleId(moduleId);
          setLaserState('scanning');

          scheduleTimer(() => {
            setLaserState('settled');
          }, 1400);
        }, 450);
      }
    },
    [
      mode,
      activeModuleId,
      selectedProjectIndex,
      closeProject,
      clearPendingTimers,
      clearDetailTimers,
      scheduleTimer
    ]
  );

  const resetToCore = useCallback(() => {
    sound.playSelect();

    if (mode === 'top') {
      clearPendingTimers();
      clearDetailTimers();
      sound.playLaserCollapse();

      // Immediately transition ConstellationNav stars & Dice straight back to 'circle' orbit
      // while the open panel(s) collapse in place without snapping to 'top' mode in-between!
      setIsReturningToCore(true);
      setLaserState('collapsing');
      if (selectedProjectIndex !== null) {
        setDetailLaserState('collapsing');
      }

      scheduleTimer(() => {
        setMode('circle');
        setIsReturningToCore(false);
        setActiveModuleId(null);
        setSelectedProjectIndex(null);
        setLaserState('idle');
        setDetailLaserState('idle');
      }, 450);
    } else {
      sound.playHover();
    }
  }, [mode, selectedProjectIndex, clearPendingTimers, clearDetailTimers, scheduleTimer]);

  const inkState = laserState === 'collapsing' ? 'drying' : 'revealing';
  const detailInkState = detailLaserState === 'collapsing' ? 'drying' : 'revealing';

  // Effective constellation navigation mode:
  // When returning to core, stars & Dice glide straight to 'circle' immediately at t=0ms
  const navMode = isReturningToCore ? 'circle' : mode;

  return {
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
  };
}
