/**
 * @typedef {Object} Entity
 * @property {number} id - The unique identifier of the entity.
 * @property {string} type - The type of the entity.
 * @property {number} row - The row position of the entity.
 * @property {number} col - The column position of the entity.
 * @property {number} movement - The movement capability of the entity.
 * @property {number} initiative - The initiative value of the entity.
 * @property {number} attack - The attack power of the entity.
 * @property {any} props - Additional properties of the entity.
 */

/**
 * Get all entities of a specific type.
 * @param {string} type - The type of entities to retrieve.
 * @returns {Entity[]} An array of entities of the specified type.
 */
const getEntities = (type) => { /* Get all entities of type */ return []; };

/**
 * Find a specific entity by its ID.
 * @param {number} id - The ID of the entity to find.
 * @returns {Entity | undefined} The entity if found, otherwise undefined.
 */
const findEntityById = (id) => { /* Get specific entity by id */ return; };

/**
 * Get the entity located on a specific tile.
 * @param {number} col - The column of the tile.
 * @param {number} row - The row of the tile.
 * @returns {Entity | undefined} The entity on the tile, or undefined if none exists.
 */
const getEntityOnTile = (col, row) => { /* Get Entity on specific tile */ return; };

/**
 * @returns {Entity[]} An array of monster entities.
 */
const getMonsters = () => { /* gets entity */ return []; };

/**
 * @returns {Entity[]} An array of rock entities.
 */
const getRocks = () => { /* gets entity */ return []; };

/**
 * @returns {Entity} The queen entity.
 */
const findQueen = () => { /* gets entity */ return; };

/**
 * @returns {Entity} The hero entity.
 */
const getHero = () => { /* gets entity */ return; };

/**
 * Move the hero up.
 * @returns {Boolean} If the hero moved.
 */
const moveHeroUp = () => { /* hero moves */ };

/**
 * Move the hero down.
 * @returns {Boolean} If the hero moved.
 */
const moveHeroDown = () => { /* hero moves */ };

/**
 * Move the hero left.
 * @returns {Boolean} If the hero moved.
 */
const moveHeroLeft = () => { /* hero moves */ };

/**
 * Move the hero right.
 * @returns {Boolean} If the hero moved.
 */
const moveHeroRight = () => { /* hero moves */ };

/**
 * Attack upwards.
 */
const attackUp = () => { /* hero attacks */ };

/**
 * Attack downwards.
 */
const attackDown = () => { /* hero attacks */ };

/**
 * Attack to the left.
 */
const attackLeft = () => { /* hero attacks */ };

/**
 * Attack to the right.
 */
const attackRight = () => { /* hero attacks */ };

/**
 * Check if the queen is above the hero.
 * @returns {boolean} True if the queen is above the hero.
 */
const isQueenAboveMe = () => { /* queen position is above me */ };

/**
 * Check if the queen is below the hero.
 * @returns {boolean} True if the queen is below the hero.
 */
const isQueenBelowMe = () => { /* queen position is below me */ };

/**
 * Check if the queen is to the left of the hero.
 * @returns {boolean} True if the queen is to the left of the hero.
 */
const isQueenLeftOfMe = () => { /* queen position is left of me */ };

/**
 * Check if the queen is to the right of the hero.
 * @returns {boolean} True if the queen is to the right of the hero.
 */
const isQueenRightOfMe = () => { /* queen position is right of me */ };

/**
 * Check if the queen is in the same row as the hero.
 * @returns {boolean} True if the queen is in the same row as the hero.
 */
const isQueenInSameRow = () => { /* queen position is in the same row as me */ };

/**
 * Check if the queen is in the same column as the hero.
 * @returns {boolean} True if the queen is in the same column as the hero.
 */
const isQueenInSameColumn = () => { /* queen position is in the same column as me */ };

/**
 * Memory array to save information across multiple turns.
 * @type {any[]}
 */
const Memory = [];

/**
 * Perform a spin attack
 */
const spinAttack = () => { };

/**
 * Perform self-healing
 */
const selfHeal = () => { };