// src/components/Board.jsx
import Tile from './Tile';
import './Board.css';

const GRID_SIZE = 5;

export default function Board({ grid }) {
  const tiles = [];

  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) {
        tiles.push(
          <Tile key={cell.id} tile={cell} row={r} col={c} />
        );
      }
    });
  });

  return (
    <div className="board">
      {/* Background empty cells grid */}
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
        <div key={`bg-${i}`} className="board-cell" />
      ))}

      {/* Foreground: absolutely positioned animated tiles */}
      <div className="tile-layer">{tiles}</div>
    </div>
  );
}