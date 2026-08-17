// src/components/Tile.jsx

const CELL_SIZE = 70; // px, includes gap
const GAP = 8;

function getPosition(row, col) {
  const offset = CELL_SIZE + GAP;
  return {
    top: row * offset,
    left: col * offset,
  };
}

// Distinct color per tile value — neon/dark-glow theme
const TILE_COLORS = {
  2: { bg: '#1e1b4b', glow: '#818cf8', text: '#e0e7ff' },
  4: { bg: '#1e293b', glow: '#38bdf8', text: '#e0f2fe' },
  8: { bg: '#164e63', glow: '#22d3ee', text: '#cffafe' },
  16: { bg: '#065f46', glow: '#34d399', text: '#d1fae5' },
  32: { bg: '#3f6212', glow: '#a3e635', text: '#ecfccb' },
  64: { bg: '#713f12', glow: '#fbbf24', text: '#fef3c7' },
  128: { bg: '#7c2d12', glow: '#fb923c', text: '#ffedd5' },
  256: { bg: '#7f1d1d', glow: '#f87171', text: '#fee2e2' },
  512: { bg: '#831843', glow: '#f472b6', text: '#fce7f3' },
  1024: { bg: '#581c87', glow: '#c084fc', text: '#f3e8ff' },
  2048: { bg: '#000000', glow: '#facc15', text: '#fef9c3' },
};

function getColors(value) {
  return TILE_COLORS[value] || TILE_COLORS[2048]; // fallback for anything beyond 2048
}

export default function Tile({ tile, row, col }) {
  const { top, left } = getPosition(row, col);
  const { bg, glow, text } = getColors(tile.value);

  const classNames = ['tile'];
  if (tile.isNew) classNames.push('tile-new');
  if (tile.isMerged) classNames.push('tile-merged');

  return (
    <div
      className={classNames.join(' ')}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        background: bg,
        color: text,
        boxShadow: `0 0 12px ${glow}, 0 0 24px ${glow}40`,
        border: `1px solid ${glow}`,
      }}
    >
      {tile.value}
    </div>
  );
}