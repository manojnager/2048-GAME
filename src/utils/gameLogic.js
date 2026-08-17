// src/utils/gameLogic.js

export const GRID_SIZE = 5;
export const WIN_VALUE = 2048;

export function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
}

function getEmptyCells(grid) {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) empty.push([r, c]);
    }
  }
  return empty;
}

export function spawnRandomTile(grid) {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return { grid, spawned: null };

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newGrid = grid.map((row) => [...row]);
  newGrid[r][c] = { value, id: crypto.randomUUID(), isNew: true };

  return { grid: newGrid, spawned: [r, c] };
}

export function initGame() {
  let grid = createEmptyGrid();
  ({ grid } = spawnRandomTile(grid));
  ({ grid } = spawnRandomTile(grid));
  return grid;
}

/**
 * Slides and merges a single row to the LEFT.
 * Returns { row, gained, moved, mergedValues }
 * mergedValues: array of each individual merged tile's resulting value,
 * e.g. if two merges happened (one making 8, one making 32) -> [8, 32]
 */
function slideAndMergeRow(row) {
  const original = row.map((cell) => (cell ? cell.value : null));

  const tiles = row.filter((cell) => cell !== null);

  const merged = [];
  const mergedValues = [];
  let gained = 0;
  let skip = false;

  for (let i = 0; i < tiles.length; i++) {
    if (skip) {
      skip = false;
      continue;
    }
    const current = tiles[i];
    const next = tiles[i + 1];

    if (next && current.value === next.value) {
      const mergedValue = current.value * 2;
      merged.push({
        value: mergedValue,
        id: crypto.randomUUID(),
        isMerged: true,
      });
      gained += mergedValue;
      mergedValues.push(mergedValue); // track this individual merge
      skip = true;
    } else {
      merged.push({ ...current, isNew: false, isMerged: false });
    }
  }

  while (merged.length < GRID_SIZE) {
    merged.push(null);
  }

  const newValues = merged.map((cell) => (cell ? cell.value : null));
  const moved = JSON.stringify(original) !== JSON.stringify(newValues);

  return { row: merged, gained, moved, mergedValues };
}

function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function reverseGrid(grid) {
  return grid.map((row) => [...row].reverse());
}

function transposeGrid(grid) {
  const size = grid.length;
  const result = createEmptyGrid();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      result[c][r] = grid[r][c];
    }
  }
  return result;
}

/**
 * Applies a move in the given direction.
 * Returns { grid, scoreGained, moved, mergedValues }
 * mergedValues: flat array of EVERY individual merge's resulting value
 * that happened this move (could be empty, one, or many).
 */
export function move(grid, direction) {
  let working = cloneGrid(grid);
  let totalGained = 0;
  let anyMoved = false;
  let allMergedValues = [];

  if (direction === 'up' || direction === 'down') working = transposeGrid(working);
  if (direction === 'down' || direction === 'right') working = reverseGrid(working);

  const resultRows = working.map((row) => {
    const { row: newRow, gained, moved, mergedValues } = slideAndMergeRow(row);
    totalGained += gained;
    if (moved) anyMoved = true;
    allMergedValues = allMergedValues.concat(mergedValues);
    return newRow;
  });

  let finalGrid = resultRows;
  if (direction === 'down' || direction === 'right') finalGrid = reverseGrid(finalGrid);
  if (direction === 'up' || direction === 'down') finalGrid = transposeGrid(finalGrid);

  return { grid: finalGrid, scoreGained: totalGained, moved: anyMoved, mergedValues: allMergedValues };
}

export function hasWon(grid) {
  return grid.some((row) => row.some((cell) => cell && cell.value === WIN_VALUE));
}

export function isGameOver(grid) {
  if (getEmptyCells(grid).length > 0) return false;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = grid[r][c];
      if (!current) continue;

      const right = c + 1 < GRID_SIZE ? grid[r][c + 1] : null;
      const down = r + 1 < GRID_SIZE ? grid[r + 1][c] : null;

      if (right && right.value === current.value) return false;
      if (down && down.value === current.value) return false;
    }
  }

  return true;
}