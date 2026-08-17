// src/App.jsx
import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import Board from './components/Board';
import './App.css';

function App() {
  const { grid, score, highScore, status, moveGrid, restart } = useGameLogic();

  useKeyboardControls(moveGrid);

  return (
    <div className="app">
      <div className="top-bar">
        <h1>2048</h1>
        <div className="scoreboard">
          <div>
            <span className="label">Score</span>
            <span className="value">{score}</span>
          </div>
          <div>
            <span className="label">Best</span>
            <span className="value">{highScore}</span>
          </div>
        </div>
        <button className="new-game-btn" onClick={restart}>New Game</button>
      </div>

      <p className="tagline">Join the numbers and get to the 2048 tile!</p>

      {status !== 'playing' && (
        <div className="status-banner">
          {status === 'won' ? '🎉 You Won!' : '💀 Game Over'}
          <div>
            <button onClick={restart}>Play Again</button>
          </div>
        </div>
      )}

      <Board grid={grid} />
    </div>
  );
}

export default App;