import { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio.js';

const checkIsEditorHash = () =>
  typeof window !== 'undefined' &&
  (window.location.hash === '#/editor' || window.location.hash === '#/admin');

/**
 * Manages secret access to the portfolio configuration editor:
 * 1. Hash routing (#/editor or #/admin)
 * 2. Global hotkey (Ctrl + Shift + E / Cmd + Shift + E)
 * 3. 5-click easter egg on the top-left diamond status pip
 */
export function useSecretAccess() {
  const [isEditorOpen, setIsEditorOpen] = useState(checkIsEditorHash);
  const [pipClicks, setPipClicks] = useState(0);
  const pipTimerRef = useRef(null);

  const openEditor = useCallback(() => {
    sound.playSelect();
    window.location.hash = '#/editor';
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    window.location.hash = '#/';
    setIsEditorOpen(false);
  }, []);

  // Synchronize with URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setIsEditorOpen(checkIsEditorHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Hotkey: Ctrl+Shift+E or Cmd+Shift+E
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        openEditor();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openEditor]);

  // Cleanup easter egg timer on unmount
  useEffect(() => {
    return () => {
      if (pipTimerRef.current) clearTimeout(pipTimerRef.current);
    };
  }, []);

  // 5-click easter egg handler on the diamond pip
  const handlePipClick = useCallback(() => {
    sound.playHover();
    setPipClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        openEditor();
        return 0;
      }
      return next;
    });

    if (pipTimerRef.current) clearTimeout(pipTimerRef.current);
    pipTimerRef.current = setTimeout(() => {
      setPipClicks(0);
    }, 2500);
  }, [openEditor]);

  return {
    isEditorOpen,
    pipClicks,
    handlePipClick,
    closeEditor
  };
}
