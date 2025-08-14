var hero = getHero();
var queen = findQueen();
var colDiff = hero.col - queen.col;
var rowDiff = hero.row - queen.row;

// nextLevel();

if (isQueenAboveMe()) {
  moveHeroUp();
}

if (isQueenBelowMe()) {
  moveHeroDown();
}

if (isQueenLeftOfMe()) {
  moveHeroLeft();
}

if (isQueenRightOfMe()) {
  moveHeroRight();
}
