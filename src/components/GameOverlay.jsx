// src/components/GameOverlay.jsx
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './GameOverlay.css';

export default function GameOverlay({ status, score, highScore, highestTile, moveCount, onRestart }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (status === 'playing') {
      firedRef.current = false;
      return;
    }
    if (firedRef.current) return; // only fire once per game-end
    firedRef.current = true;

    if (status === 'won') {
      // Big celebratory confetti burst from both sides
      const duration = 2000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffd98a', '#f0a84b', '#c9761f', '#eec13a'],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffd98a', '#f0a84b', '#c9761f', '#eec13a'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    } else if (status === 'lost') {
      // Small, subtle burst — a gentle acknowledgment, not a celebration
      confetti({
        particleCount: 40,
        spread: 60,
        startVelocity: 25,
        origin: { y: 0.6 },
        colors: ['#8a5a2c', '#b8672a', '#c9481f'],
        gravity: 1.2,
        scalar: 0.7,
      });
    }
  }, [status]);

  if (status === 'playing') return null;

  const isWin = status === 'won';

  return (
    <div className="overlay-backdrop">
      <div className={`overlay-card ${isWin ? 'win' : 'lost'}`}>
        <div className="overlay-icon">{isWin ? '🏆' : '🎮'}</div>
        <h2>{isWin ? 'You Win!' : 'Game Over'}</h2>
        <p className="overlay-subtitle">
          {isWin ? 'You reached the 2048 tile!' : 'No more moves left — nice try!'}
        </p>

        <div className="overlay-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Best</span>
            <span className="stat-value">{highScore}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Highest Tile</span>
            <span className="stat-value">{highestTile}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moveCount}</span>
          </div>
        </div>

        <button className="overlay-btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}