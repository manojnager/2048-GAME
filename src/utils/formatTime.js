// src/utils/formatTime.js

/**
 * Formats seconds as M:SS (e.g. 125 -> "2:05")
 */
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}