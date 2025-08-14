var hero = getHero();
var queen = findQueen();
var colDiff = hero.col - queen.col;
var rowDiff = hero.row - queen.row;

if (Math.abs(rowDiff) > Math.abs(colDiff)) {
  // check which axis is further away, then reduce the one closer
  if (rowDiff < 0) {
    var isBlocked = moveHeroDown();

    if (isBlocked) {
      moveHeroRight();
    }
  } else if (rowDiff >= 1) {
    var isBlocked = moveHeroUp();


    
    if (isBlocked) {
      moveHeroRight();
    }
  }
} else {
  if (colDiff < 0) {
    var isBlocked = moveHeroRight();

    if (isBlocked) {
      moveHeroUp();
    }
  } else if (colDiff >= 1) {
    var isBlocked = moveHeroLeft();

    if (isBlocked) {
      moveHeroUp();
    }
  }
}
