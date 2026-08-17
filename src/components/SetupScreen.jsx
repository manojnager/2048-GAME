// src/components/SetupScreen.jsx
import { useState } from 'react';
import { MAX_OBSTACLES } from '../utils/gameLogic';
import './SetupScreen.css';

export default function SetupScreen({ onStart }) {
  const [obstacles, setObstacles] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  const options = Array.from({ length: MAX_OBSTACLES + 1 }, (_, i) => i); // 0,1,2,3,4,5

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <h2>Ready to Play?</h2>
        <p className="setup-subtitle">Choose how many obstacle tiles to add for extra difficulty.</p>

        <div className="obstacle-options">
          {options.map((n) => (
            <button
              key={n}
              className={`obstacle-option ${obstacles === n ? 'selected' : ''}`}
              onClick={() => setObstacles(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <p className="obstacle-hint">
          {obstacles === 0
            ? 'No obstacles — classic experience'
            : `${obstacles} obstacle${obstacles > 1 ? 's' : ''} will block tiles on the board`}
        </p>

        <label className="timer-toggle">
          <input
            type="checkbox"
            checked={timerOn}
            onChange={(e) => setTimerOn(e.target.checked)}
          />
          Enable stopwatch (track your solve time)
        </label>

        <button className="start-btn" onClick={() => onStart(obstacles, timerOn)}>
          Start Game
        </button>
      </div>
    </div>
  );
}