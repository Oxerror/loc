// Example Solution
// --- BFS pathfinding to reach the queen ---
// Get hero and queen entities
var hero = getHero();
var queen = findQueen();

// Directions array: [rowOffset, colOffset, moveFunction]
// Used for moving up, down, left, right
const directions = [
    [-1, 0, moveHeroUp],   // up
    [1, 0, moveHeroDown],  // down
    [0, -1, moveHeroLeft], // left
    [0, 1, moveHeroRight]  // right
];

// Checks if a tile is within the map bounds
function isInbounds(row, col) {
    // Map bounds: 10 Rows and 12 columns which start with index 0 for first row / column
    const minRow = 0, minCol = 0, maxRow = 9, maxCol = 11;
    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
}

// Checks if a tile is blocked by a rock, monster, or water
function isBlocked(row, col) {
    if (!isInbounds(row, col)) return true;
    const entity = getEntityOnTile(col, row);
    if (!entity) return false;
    return entity.type === 'rock' || entity.type === 'monster' || entity.type === 'water';
}

// BFS queue: each item is {row, col, path}
// path is an array of direction indices to reach the queen
let queue = [{ row: hero.row, col: hero.col, path: [] }];
let visited = new Set();
visited.add(hero.row + ',' + hero.col);

let foundPath = null;
// BFS loop: explores all possible paths to the queen
while (queue.length > 0) {
    const current = queue.shift();
    // If reached the queen, store the path
    if (current.row === queen.row && current.col === queen.col) {
        foundPath = current.path;
        break;
    }
    // Try all directions from the current position
    for (let i = 0; i < directions.length; i++) {
        const [dRow, dCol, moveFn] = directions[i];
        const newRow = current.row + dRow;
        const newCol = current.col + dCol;
        const key = newRow + ',' + newCol;
        // Skip visited or blocked tiles
        if (visited.has(key)) continue;
        if (isBlocked(newRow, newCol)) continue;
        visited.add(key);
        // Add new position to the queue with updated path
        queue.push({
            row: newRow,
            col: newCol,
            path: current.path.concat([i]) // store direction index
        });
    }
}

// --- Attack logic: attack an adjacent monster before moving ---
// Attack functions for each direction
const attackFunctions = [attackUp, attackDown, attackLeft, attackRight];
// Offsets for adjacent tiles: up, down, left, right
const adjacentOffsets = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1]   // right
];

let attacked = false;
// Check each adjacent tile for a monster
for (let i = 0; i < adjacentOffsets.length; i++) {
    const [dRow, dCol] = adjacentOffsets[i];
    const checkRow = hero.row + dRow;
    const checkCol = hero.col + dCol;
    if (isInbounds(checkRow, checkCol)) {
        const entity = getEntityOnTile(checkCol, checkRow);
        // If a monster is found, attack and skip movement
        if (entity && entity.type === 'monster') {
            attackFunctions[i]();
            attacked = true;
            break;
        }
    }
}

// --- Move towards the queen if no attack was performed ---
if (!attacked && foundPath) {
    // Move one step along the found path
    const nextMove = foundPath[0];
    const moved = directions[nextMove][2]();
    // If move is blocked, clear visited and try again next turn
    if (!moved) {
        visited.clear();
    }
}