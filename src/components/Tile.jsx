// src/components/Tile.jsx

const CELL_SIZE = 70;
const GAP = 10;

function getPosition(row, col) {
  const offset = CELL_SIZE + GAP;
  return {
    top: row * offset,
    left: col * offset,
  };
}

const TILE_COLORS = {
  2:    { bg: '#4a3626', text: '#f5e6d3' },
  4:    { bg: '#5a4230', text: '#f5e6d3' },
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
  const { top, left } = getPosition(row, col);
  const { bg, text } = getColors(tile.value);

  const classNames = ['tile'];
  if (tile.isNew) classNames.push('tile-new');
  if (tile.isMerged) classNames.push('tile-merged');

  const fontSize = tile.value >= 1000 ? '20px' : tile.value >= 100 ? '22px' : '26px';

  return (
    <div
      className={classNames.join(' ')}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        background: bg,
        color: text,
        fontSize,
        boxShadow: tile.value >= 128
          ? `0 0 14px ${bg}aa, inset 0 1px 2px rgba(255,255,255,0.2)`
          : `inset 0 1px 2px rgba(255,255,255,0.08)`,
      }}
    >
      {tile.value}
    </div>
  );
}