// src/hooks/useKeyboardControls.js
import { useEffect } from 'react';

const KEY_TO_DIRECTION = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

export function useKeyboardControls(onMove) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const direction = KEY_TO_DIRECTION[e.key];
      if (direction) {
        e.preventDefault(); // stop page scrolling on arrow keys
        onMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove]);
}