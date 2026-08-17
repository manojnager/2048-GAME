// src/App.jsx
import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useSwipeControls } from './hooks/useSwipeControls';
import Board from './components/Board';
import SoundControls from './components/SoundControls';
import GameOverlay from './components/GameOverlay';
import SetupScreen from './components/SetupScreen';
import './App.css';

function App() {
  const {
    grid,
    score,
    highScore,
    status,
    moveGrid,
    restart,
    startGame,
    moveCount,
    highestTile,
    undo,
    canUndo,
  } = useGameLogic();

  useKeyboardControls(moveGrid);
  useSwipeControls(moveGrid);

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
        {status !== 'setup' && (
          <>
            <button className="new-game-btn" onClick={restart}>New Game</button>
            <button className="undo-btn" onClick={undo} disabled={!canUndo}>↩ Undo</button>
          </>
        )}
        <SoundControls />
      </div>

      <p className="tagline">Join the numbers and get to the 2048 tile!</p>

      {status === 'setup' && <SetupScreen onStart={startGame} />}

      {status !== 'setup' && <Board grid={grid} />}

      <GameOverlay
        status={status}
        score={score}
        highScore={highScore}
        highestTile={highestTile}
        moveCount={moveCount}
        onRestart={restart}
      />
    </div>
  );
}

export default App;