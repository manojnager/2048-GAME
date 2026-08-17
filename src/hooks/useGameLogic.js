// src/hooks/useGameLogic.js
import { useState, useCallback, useEffect } from 'react';
import { initGame, move, spawnRandomTile, hasWon, isGameOver } from '../utils/gameLogic';
import {
  playMoveSound,
  playMergeSound,
  playNewGameSound,
  playWinSound,
  playGameOverSound,
  maybePlayPraise,
  playWinVoice,
  playGameOverVoice,
} from '../utils/sound';

const HIGH_SCORE_KEY = '2048_high_score';

function getHighestTile(grid) {
  let max = 0;
  grid.forEach((row) =>
    row.forEach((cell) => {
      if (cell && cell.value > max) max = cell.value;
    })
  );
  return max;
}

export function useGameLogic() {
  const [grid, setGrid] = useState(() => initGame());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [status, setStatus] = useState('playing');
  const [history, setHistory] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [highestTile, setHighestTile] = useState(2);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, String(score));
    }
  }, [score, highScore]);

  const moveGrid = useCallback(
    (direction) => {
      if (status !== 'playing') return;

      setGrid((currentGrid) => {
        const { grid: movedGrid, scoreGained, moved } = move(currentGrid, direction);

        if (!moved) return currentGrid;

        setHistory((h) => [...h, { grid: currentGrid, score }]);

        const { grid: newGrid } = spawnRandomTile(movedGrid);

        setScore((s) => s + scoreGained);
        setMoveCount((m) => m + 1);
        setHighestTile((prev) => Math.max(prev, getHighestTile(newGrid)));

        if (scoreGained > 0) {
          playMergeSound(scoreGained);
          maybePlayPraise(scoreGained);
        } else {
          playMoveSound();
        }

        if (hasWon(newGrid)) {
          setStatus('won');
          setTimeout(() => {
            playWinSound();
            playWinVoice();
          }, 200);
        } else if (isGameOver(newGrid)) {
          setStatus('lost');
          setTimeout(() => {
            playGameOverSound();
            playGameOverVoice();
          }, 200);
        }

        return newGrid;
      });
    },
    [status, score]
  );

  const restart = useCallback(() => {
    playNewGameSound();
    setGrid(initGame());
    setScore(0);
    setStatus('playing');
    setHistory([]);
    setMoveCount(0);
    setHighestTile(2);
  }, []);

  return { grid, score, highScore, status, moveGrid, restart, moveCount, highestTile };
}