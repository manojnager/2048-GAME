// src/App.jsx
import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import './App.css';

function App() {
  const { grid, score, highScore, status, moveGrid, restart } = useGameLogic();

  useKeyboardControls(moveGrid);

  return (
    <div className="app">
      <h1>2048</h1>

      <div className="scoreboard">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
      </div>

      {status !== 'playing' && (
        <div className="status-banner">
          {status === 'won' ? '🎉 You Won!' : '💀 Game Over'}
          <button onClick={restart}>Play Again</button>
        </div>
      )}

      <div className="grid">
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="cell">
              {cell ? cell.value : ''}
            </div>
          ))
        )}
      </div>

      <button onClick={restart}>Restart</button>
    </div>
  );
}

export default App;