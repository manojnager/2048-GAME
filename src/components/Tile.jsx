// src/components/Tile.jsx

const TILE_COLORS = {
  2:    { bg: '#5c4630', text: '#fff8ec' },
  4:    { bg: '#6b4f34', text: '#fff8ec' },
  8:    { bg: '#8a5a2c', text: '#fff3e0' },
  16:   { bg: '#b8672a', text: '#fff3e0' },
  32:   { bg: '#c9481f', text: '#fff3e0' },
  64:   { bg: '#d6301f', text: '#fff3e0' },
  128:  { bg: '#e0a52e', text: '#2a1a0a' },
  256:  { bg: '#eec13a', text: '#2a1a0a' },
  512:  { bg: '#f3d24c', text: '#2a1a0a' },
  1024: { bg: '#ffdc73', text: '#2a1a0a' },
  2048: { bg: '#ffe9a3', text: '#2a1a0a' },
};

function getColors(value) {
  return TILE_COLORS[value] || { bg: '#000000', text: '#ffffff' };
}

export default function Tile({ tile, row, col }) {
  if (tile.blocked) {
    return (
      <div
        className="tile tile-obstacle"
        style={{ gridRow: row + 1, gridColumn: col + 1 }}
      >
        🪨
      </div>
    );
  }

  const { bg, text } = getColors(tile.value);
  const classNames = ['tile'];
  if (tile.isNew) classNames.push('tile-new');
  if (tile.isMerged) classNames.push('tile-merged');

  const digitClass = tile.value >= 1000 ? 'digits-4' : tile.value >= 100 ? 'digits-3' : 'digits-1-2';

  return (
    <div
      className={classNames.join(' ')}
      style={{
        // CSS Grid placement — row/col are 0-indexed, grid lines are 1-indexed
        gridRow: row + 1,
        gridColumn: col + 1,
        background: bg,
        color: text,
      }}
    >
      <span className={digitClass}>{tile.value}</span>
    </div>
  );
}