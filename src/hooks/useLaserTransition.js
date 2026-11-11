import { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '../utils/audio.js';

/**
 * Manages the state machine for the Shuriken/Dice constellation and Pod optical laser transitions.
 * Safely clears active timers to prevent race conditions during rapid clicks.
 */
export function useLaserTransition() {
  const [mode, setMode] = useState('circle'); // 'circle' | 'top'
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [laserState, setLaserState] = useState('idle'); // 'idle' | 'scanning' | 'settled' | 'collapsing'
  const timersRef = useRef([]);

  const clearPendingTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => clearPendingTimers();
  }, [clearPendingTimers]);

  const selectModule = useCallback(
    (moduleId) => {
      sound.playSelect();

      if (mode === 'circle') {
        clearPendingTimers();
        sound.playLaserScan();
        setMode('top');
        setActiveModuleId(moduleId);
        setLaserState('scanning');

        scheduleTimer(() => {
          setLaserState('settled');
        }, 1400);
      } else {
        if (moduleId === activeModuleId) return;

        clearPendingTimers();
        sound.playLaserCollapse();
        setLaserState('collapsing');

        scheduleTimer(() => {
          sound.playLaserScan();
          setActiveModuleId(moduleId);
          setLaserState('scanning');

          scheduleTimer(() => {
            setLaserState('settled');
          }, 1400);
        }, 450);
      }
    },
    [mode, activeModuleId, clearPendingTimers, scheduleTimer]
  );

  const resetToCore = useCallback(() => {
    sound.playSelect();

    if (mode === 'top') {
      clearPendingTimers();
      sound.playLaserCollapse();
      setLaserState('collapsing');

      scheduleTimer(() => {
        setMode('circle');
        setActiveModuleId(null);
        setLaserState('idle');
      }, 450);
    } else {
      sound.playHover();
    }
  }, [mode, clearPendingTimers, scheduleTimer]);

  const inkState = laserState === 'collapsing' ? 'drying' : 'revealing';

  return {
    mode,
    activeModuleId,
    laserState,
    inkState,
    selectModule,
    resetToCore
  };
}
