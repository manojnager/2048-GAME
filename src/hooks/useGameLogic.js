// src/hooks/useGameLogic.js
import { useState, useCallback, useEffect } from 'react';
import { initGame, move, spawnRandomTile, hasWon, isGameOver } from '../utils/gameLogic';

const HIGH_SCORE_KEY = '2048_high_score';

export function useGameLogic() {
  const [grid, setGrid] = useState(() => initGame());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [history, setHistory] = useState([]); // for future undo feature

  // Persist high score whenever score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, String(score));
    }
  }, [score, highScore]);

  const moveGrid = useCallback(
    (direction) => {
      if (status !== 'playing') return; // no moves after game ends

      setGrid((currentGrid) => {
        const { grid: movedGrid, scoreGained, moved } = move(currentGrid, direction);

        if (!moved) return currentGrid; // invalid move, nothing changes

        // Save previous state to history (for future undo)
        setHistory((h) => [...h, { grid: currentGrid, score }]);

        // Spawn a new tile after a successful move
        const { grid: newGrid } = spawnRandomTile(movedGrid);

        // Update score
        setScore((s) => s + scoreGained);

        // Check win/loss conditions
        if (hasWon(newGrid)) {
          setStatus('won');
        } else if (isGameOver(newGrid)) {
          setStatus('lost');
        }

        return newGrid;
      });
    },
    [status, score]
  );

  const restart = useCallback(() => {
    setGrid(initGame());
    setScore(0);
    setStatus('playing');
    setHistory([]);
  }, []);

  return { grid, score, highScore, status, moveGrid, restart };
}