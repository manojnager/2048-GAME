// src/utils/gameLogic.js

export const GRID_SIZE = 5;
export const WIN_VALUE = 2048;
export const OBSTACLE_COUNT = 3; // number of blocked cells per game

export const BLOCKED = { blocked: true }; // sentinel value for obstacle cells

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

/**
 * Places OBSTACLE_COUNT blocked cells at random empty positions.
 * Call this once at game init, before spawning the starting number tiles.
 */
export function placeObstacles(grid, count = OBSTACLE_COUNT) {
  let newGrid = grid.map((row) => [...row]);
  const empty = getEmptyCells(newGrid);

  // Shuffle and take the first `count` positions
  const shuffled = [...empty].sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, Math.min(count, empty.length));

  chosen.forEach(([r, c]) => {
    newGrid[r][c] = { ...BLOCKED };
  });

  return newGrid;
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

/**
 * Initializes a fresh game: empty grid + obstacles + 2 starting tiles.
 */
export function initGame() {
  let grid = createEmptyGrid();
  grid = placeObstacles(grid);
  ({ grid } = spawnRandomTile(grid));
  ({ grid } = spawnRandomTile(grid));
  return grid;
}

/**
 * Slides and merges a single row/segment to the LEFT, treating obstacles
 * as immovable walls. A row may contain multiple "segments" split by
 * obstacles — each segment slides independently within its bounds.
 */
function slideAndMergeRow(row) {
  const original = row.map((cell) => (cell?.blocked ? 'BLOCKED' : cell ? cell.value : null));

  const result = new Array(row.length).fill(null);
  let gained = 0;
  const mergedValues = [];

  // Split the row into segments separated by obstacles
  let segmentStart = 0;

  const processSegment = (start, end) => {
    // Collect non-null tiles in this segment [start, end)
    const tiles = [];
    for (let i = start; i < end; i++) {
      if (row[i] !== null) tiles.push(row[i]);
    }

    const merged = [];
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
        merged.push({ value: mergedValue, id: crypto.randomUUID(), isMerged: true });
        gained += mergedValue;
        mergedValues.push(mergedValue);
        skip = true;
      } else {
        merged.push({ ...current, isNew: false, isMerged: false });
      }
    }

    // Place the merged tiles at the start of the segment, rest stays empty
    for (let i = 0; i < merged.length; i++) {
      result[start + i] = merged[i];
    }
  };

  for (let i = 0; i < row.length; i++) {
    if (row[i]?.blocked) {
      processSegment(segmentStart, i);
      result[i] = row[i]; // obstacle stays in place, untouched
      segmentStart = i + 1;
    }
  }
  processSegment(segmentStart, row.length); // process final segment after last obstacle

  const newValues = result.map((cell) => (cell?.blocked ? 'BLOCKED' : cell ? cell.value : null));
  const moved = JSON.stringify(original) !== JSON.stringify(newValues);

  return { row: result, gained, moved, mergedValues };
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
  return grid.some((row) => row.some((cell) => cell && !cell.blocked && cell.value === WIN_VALUE));
}

export function isGameOver(grid) {
  if (getEmptyCells(grid).length > 0) return false;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = grid[r][c];
      if (!current || current.blocked) continue;

      const right = c + 1 < GRID_SIZE ? grid[r][c + 1] : null;
      const down = r + 1 < GRID_SIZE ? grid[r + 1][c] : null;

      if (right && !right.blocked && right.value === current.value) return false;
      if (down && !down.blocked && down.value === current.value) return false;
    }
  }

  return true;
}