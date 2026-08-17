// src/utils/gameLogic.js

export const GRID_SIZE = 5; // 5x5 grid (unique twist vs classic 4x4)
export const WIN_VALUE = 2048;

/**
 * Creates an empty grid of GRID_SIZE x GRID_SIZE, filled with null.
 * null = empty cell. In future, we can use a special value like "BLOCKED"
 * for obstacle cells without changing this structure.
 */
export function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
}

/**
 * Returns a list of [row, col] positions that are currently empty.
 */
function getEmptyCells(grid) {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === null) empty.push([r, c]);
    }
  }
  return empty;
}

/**
 * Places a new tile (value 2 or 4, 90%/10% chance) in a random empty cell.
 * Returns a NEW grid (does not mutate the original).
 * Also returns the position of the new tile, useful for spawn animation.
 */
export function spawnRandomTile(grid) {
  const empty = getEmptyCells(grid);
  if (empty.length === 0) return { grid, spawned: null };

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newGrid = grid.map((row) => [...row]);
  newGrid[r][c] = { value, id: crypto.randomUUID(), isNew: true };

  return { grid: newGrid, spawned: [r, c] };
}

/**
 * Initializes a fresh game: empty grid + 2 starting tiles.
 */
export function initGame() {
  let grid = createEmptyGrid();
  ({ grid } = spawnRandomTile(grid));
  ({ grid } = spawnRandomTile(grid));
  return grid;
}

/**
 * Slides and merges a single row (array of cells) to the LEFT.
 * Returns { row: newRow, gained: scoreGainedFromMerges, moved: boolean }
 * This is the core primitive — up/down/right are implemented by
 * transposing/reversing the grid and reusing this function.
 */
function slideAndMergeRow(row) {
  const original = row.map((cell) => (cell ? cell.value : null));

  // Step 1: remove nulls (compact the tiles to the left)
  const tiles = row.filter((cell) => cell !== null);

  const merged = [];
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
      // Merge current + next into one tile
      const mergedValue = current.value * 2;
      merged.push({
        value: mergedValue,
        id: crypto.randomUUID(),
        isMerged: true,
      });
      gained += mergedValue;
      skip = true; // skip the next tile, it was consumed
    } else {
      merged.push({ ...current, isNew: false, isMerged: false });
    }
  }

  // Step 2: pad the rest of the row with nulls
  while (merged.length < GRID_SIZE) {
    merged.push(null);
  }

  const newValues = merged.map((cell) => (cell ? cell.value : null));
  const moved = JSON.stringify(original) !== JSON.stringify(newValues);

  return { row: merged, gained, moved };
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
 * direction: 'left' | 'right' | 'up' | 'down'
 * Returns { grid, scoreGained, moved }
 *   - grid: the new grid after the move (tiles NOT yet spawned)
 *   - scoreGained: points earned from merges this move
 *   - moved: whether anything actually changed (used to decide if we should spawn a new tile)
 */
export function move(grid, direction) {
  let working = cloneGrid(grid);
  let totalGained = 0;
  let anyMoved = false;

  if (direction === 'up') working = transposeGrid(working);
  if (direction === 'down') working = transposeGrid(working).map((row) => row); // will reverse below
  if (direction === 'right') working = working; // handled via reverse below
  if (direction === 'down') working = reverseGrid(working);
  if (direction === 'right') working = reverseGrid(working);

  const resultRows = working.map((row) => {
    const { row: newRow, gained, moved } = slideAndMergeRow(row);
    totalGained += gained;
    if (moved) anyMoved = true;
    return newRow;
  });

  let finalGrid = resultRows;
  if (direction === 'down') finalGrid = reverseGrid(finalGrid);
  if (direction === 'right') finalGrid = reverseGrid(finalGrid);
  if (direction === 'up' || direction === 'down') finalGrid = transposeGrid(finalGrid);

  return { grid: finalGrid, scoreGained: totalGained, moved: anyMoved };
}

/**
 * Checks if the player has reached the win tile (2048).
 */
export function hasWon(grid) {
  return grid.some((row) => row.some((cell) => cell && cell.value === WIN_VALUE));
}

/**
 * Checks if there are no more valid moves left (game over condition).
 * True if grid is full AND no adjacent cells can merge.
 */
export function isGameOver(grid) {
  // If there's any empty cell, game is not over
  if (getEmptyCells(grid).length > 0) return false;

  // Check horizontal and vertical merge possibilities
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