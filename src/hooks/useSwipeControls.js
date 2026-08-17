// src/hooks/useSwipeControls.js
import { useEffect, useRef } from 'react';

const SWIPE_THRESHOLD = 30; // minimum px distance to count as a swipe (avoids accidental taps triggering moves)

export function useSwipeControls(onMove) {
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Ignore small movements (taps, jitter)
      if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return;

      // Determine dominant direction
      if (absDx > absDy) {
        onMove(dx > 0 ? 'right' : 'left');
      } else {
        onMove(dy > 0 ? 'down' : 'up');
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onMove]);
}