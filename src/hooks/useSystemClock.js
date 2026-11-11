import { useRef, useEffect } from 'react';

/**
 * Updates a DOM element's textContent directly with the NieR HUD clock string (HH:MM:SS.ms)
 * without triggering React component re-renders.
 */
export function useSystemClock() {
  const clockRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      if (!clockRef.current) return;
      const now = new Date();
      const timePart = now.toTimeString().split(' ')[0];
      const msPart = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
      clockRef.current.textContent = `CLOCK: ${timePart}.${msPart}`;
    };

    updateTime();
    const intervalId = setInterval(updateTime, 200);
    return () => clearInterval(intervalId);
  }, []);

  return clockRef;
}
