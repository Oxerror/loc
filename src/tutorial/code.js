var hero = getHero();
var queen = findQueen();
var colDiff = hero.col - queen.col;
var rowDiff = hero.row - queen.row;

if (Math.abs(rowDiff) > Math.abs(colDiff)) { // check which axis is further away, then reduce the one closer
        //reduce row axis
        if (rowDiff < 0) {
          var isBlocked = moveHeroDown();
        } else if (rowDiff >= 1) {
           var isBlocked = moveHeroUp();
        }
      } else {
        //recude col axis
        if (colDiff < 0) {
           var isBlocked = moveHeroRight();
        } else if (colDiff >= 1) {
           //missing......
        }
      }

      