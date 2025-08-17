/* eslint-disable  @typescript-eslint/no-unused-vars */
import "./App.css";
import { useRef } from "react";
import MapGrid from "./MapGrid";
import { useState } from "react";
import { useEffect } from "react";
// @ts-ignore
import jsCode from "./code/code.js";
import Editor from "./Editor";
import InfoArea from "./InfoArea";

let loggerSetup = false;
const isRemote = process.env.REACT_APP_REMOTE === "true";

const clearRequireCache = () => {
  Object.keys(require.cache).forEach((key) => {
    delete require.cache[key];
  });
};

function App() {
  type Entity = {
    id: number;
    type: string;
    row: number;
    col: number;
    movement: number;
    initiative: number;
    attack: number;
    props: any;
  };
  const playConsole: any = useRef(null);
  const [mapData, setMapData] = useState(require("./maps/1.json"));
  const [map, setMap] = useState(1);

  const [reload, setReload] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [statsOutput, setStatsOutput] = useState("");
  const [enemiesInRange, setEnemiesInRage] = useState<Entity[]>([]);
  const [activeTab, setActiveTab] = useState<"RULES" | "HELP">("RULES");

  const playingRef = useRef(false);

  const baseDelay = 400; //1500 too slow

  const restart = () => {
    clearRequireCache();
    // setMapData(require("./maps/1.json"));
    setMap(1);
    setPlaying(false);
    playingRef.current = false;
  };

  useEffect(() => {
    updateStatDisplay();
  }, [mapData]);

  useEffect(() => {
    turn();
  }, [playing]);

  useEffect(() => {
    Memory.length = 0;

    if (isRemote) {
      fetch(
        `https://raw.githubusercontent.com/Oxerror/loc/master/src/maps/${map}.json`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          setMapData(data);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          setMapData(require(`./maps/${map}.json`));
        });
    } else {
      setMapData(require(`./maps/${map}.json`));
    }
  }, [map]);

  useEffect(() => {
    if (reload) {
      setReload((r) => !r);
      updateStatDisplay();
      var hero = getHero();
      if (!hero || hero.props.hp < 1) {
        //gameover
        setPlaying(false);
        alert("GAME OVER.");
        window.location.reload();
      }
    }
  }, [reload]);

  const calculateLevel = (xp: number): number => {
    if (xp === 0) {
      return 0;
    }
    return Math.trunc(xp / 200);
  };

  const updateStatDisplay = () => {
    var entities = getMonsters();
    var hero = getHero();
    if (hero) entities.push(hero);
    var output = "";
    entities.reverse().forEach((x) => {
      if (x.props.hp < 1) {
        //kill
        removeFromRange(x);
        clearTile(x.col, x.row);
        return;
      }
      output +=
        x.type +
        "-" +
        x.id +
        "&emsp;&emsp;&emsp;&emsp;hp: " +
        x.props.hp +
        "&emsp;&emsp;&emsp;&emsp;ATP:" +
        x.attack +
        "<br/>";
    });
    setStatsOutput(output);
  };

  const setupLogger = () => {
    loggerSetup = true;
    var old = console.log;
    console.log = function (message) {
      if (message.startsWith("[HMR]")) {
        restart();
        return;
      }

      if (playConsole) {
        (playConsole.current as HTMLParagraphElement).scrollTop = 0;
        if (typeof message == "object") {
          (playConsole.current as HTMLParagraphElement).innerHTML =
            (JSON && JSON.stringify ? JSON.stringify(message) : message) +
            "<br />" +
            (playConsole.current as HTMLParagraphElement).innerHTML;
        } else {
          (playConsole.current as HTMLParagraphElement).innerHTML =
            message +
            "<br />" +
            (playConsole.current as HTMLParagraphElement).innerHTML;
        }
      } else {
        old(message);
      }
    };
    console.log("Events will be output here");
  };

  const getEntities = (type: string): Entity[] => {
    var entities: any[] = [];
    for (const [rowKey, rowValue] of Object.entries(mapData.tiles.rows)) {
      for (const [cellKey, cellValue] of Object.entries(
        mapData.tiles.rows[rowKey]
      )) {
        const value = cellValue as any;
        if (cellValue && (cellValue as any).type === type) {
          var entity: Entity = {
            id: value.id,
            col: +cellKey,
            row: +rowKey,
            type: value.type,
            movement: value.movement ? value.movement : 0,
            initiative: value.initiative ? value.initiative : 1,
            attack: value.attack ? value.attack : 1,
            props: cellValue,
          };
          entities.push(entity);
        }
      }
    }
    return entities;
  };

  const findEntityById = (id: number): Entity | undefined => {
    for (const [rowKey, rowValue] of Object.entries(mapData.tiles.rows)) {
      for (const [cellKey, cellValue] of Object.entries(
        mapData.tiles.rows[rowKey]
      )) {
        const value = cellValue as any;
        if (cellValue && value.id === id) {
          var entity: Entity = {
            id: value.id,
            col: +cellKey,
            row: +rowKey,
            type: value.type,
            movement: value.movement ? value.movement : 0,
            initiative: value.initiative ? value.initiative : 1,
            attack: value.attack ? value.attack : 1,
            props: cellValue,
          };
          return entity;
        }
      }
    }
  };

  const getEntityOnTile = (x: number, y: number): Entity | undefined => {
    var data = mapData.tiles.rows[y + ""]["" + x];
    if (!data) return undefined;
    var entity: Entity = {
      id: data.id,
      col: +x,
      row: +y,
      type: data.type,
      movement: data.movement ? data.movement : 0,
      initiative: data.initiative ? data.initiative : 1,
      attack: data.attack ? data.attack : 1,
      props: data,
    };
    return entity;
  };

  const nextLevel = () => {
    // setMapData(require(`./maps/${map + 1}.json`));
    setMap(map + 1);
    setPlaying(false);
    playingRef.current = false;
  };

  const getMonsters = (): Entity[] => {
    return getEntities("monster");
  };

  const getRocks = (): Entity[] => {
    return getEntities("rock");
  };

  const findQueen = (): Entity => {
    return getEntities("queen")[0];
  };

  const getHero = (): Entity => {
    return getEntities("hero")[0];
  };

  const isQueenAboveMe = () => getHero().row > findQueen().row;
  const isQueenBelowMe = () => getHero().row < findQueen().row;
  const isQueenLeftOfMe = () => getHero().col > findQueen().col;
  const isQueenRightOfMe = () => getHero().col < findQueen().col;
  const isQueenInSameRow = () => getHero().row === findQueen().row;
  const isQueenInSameColumn = () => getHero().col === findQueen().col;

  const isInbounds = (x: number, y: number): boolean => {
    return (
      mapData.defaults.xsize > x &&
      x >= 0 &&
      mapData.defaults.ysize > y &&
      y >= 0
    );
  };

  const isWon = (x: number, y: number): boolean => {
    if (["queen"].indexOf(mapData.tiles.rows[y + ""]["" + x]?.type) >= 0) {
      // setMapData(require(`./maps/${map + 1}.json`));
      setMap(map + 1);
      setPlaying(false);
      playingRef.current = false;
      return true;
    }
    return false;
  };

  const isBlocked = (x: number, y: number): boolean => {
    return (
      ["monster", "rock", "water", "hero"].indexOf(
        mapData.tiles.rows[y + ""]["" + x]?.type
      ) >= 0
    );
  };

  const validHeroSpot = (x: number, y: number) => {
    return (
      isInbounds(x, y) &&
      ["monster", "rock", "water", "hero"].indexOf(
        mapData.tiles.rows[y + ""]["" + x]?.type
      ) < 1
    );
  };

  const clearTile = (x: number, y: number) => {
    if (mapData.tiles.rows[y + ""] && mapData.tiles.rows[y + ""]["" + x]) {
      mapData.tiles.rows[y + ""]["" + x] = null;
      setMapData(mapData);
    }
  };

  const setTile = (entity: Entity) => {
    mapData.tiles.rows[entity.row + ""]["" + entity.col] = entity.props;
    setMapData(mapData);
  };

  const updateTile = (entity: Entity, oldX: number, oldY: number) => {
    clearTile(oldX, oldY);
    setTile(entity);
  };

  const moveUp = (entity: Entity): boolean => {
    var oldX = entity.col;
    var oldY = entity.row;
    entity.row = oldY - 1;

    if (isWon(entity.col, entity.row)) {
      return true;
    }

    if (
      !isInbounds(entity.col, entity.row) ||
      isBlocked(entity.col, entity.row)
    ) {
      console.log(entity.type + " can't go up");
      entity.col = oldX;
      entity.row = oldY;
      return false;
    }
    updateTile(entity, oldX, oldY);
    return true;
  };

  const moveDown = (entity: Entity): boolean => {
    var oldX = entity.col;
    var oldY = entity.row;
    entity.row = oldY + 1;

    if (isWon(entity.col, entity.row)) {
      return true;
    }

    if (
      !isInbounds(entity.col, entity.row) ||
      isBlocked(entity.col, entity.row)
    ) {
      console.log(entity.type + " can't go down");
      entity.col = oldX;
      entity.row = oldY;
      return false;
    }
    updateTile(entity, oldX, oldY);
    return true;
  };

  const moveLeft = (entity: Entity): boolean => {
    var oldX = entity.col;
    var oldY = entity.row;
    entity.col = oldX - 1;

    if (isWon(entity.col, entity.row)) {
      return true;
    }

    if (
      !isInbounds(entity.col, entity.row) ||
      isBlocked(entity.col, entity.row)
    ) {
      console.log(entity.type + " can't go left");
      entity.col = oldX;
      entity.row = oldY;
      return false;
    }
    updateTile(entity, oldX, oldY);
    return true;
  };

  const moveRight = (entity: Entity): boolean => {
    var oldX = entity.col;
    var oldY = entity.row;
    entity.col = oldX + 1;

    if (isWon(entity.col, entity.row)) {
      return true;
    }

    if (
      !isInbounds(entity.col, entity.row) ||
      isBlocked(entity.col, entity.row)
    ) {
      console.log(entity.type + " can't go right");
      entity.col = oldX;
      entity.row = oldY;
      return false;
    }
    updateTile(entity, oldX, oldY);
    return true;
  };

  const attack = (x: number, y: number, attacker: Entity) => {
    var defender = getEntityOnTile(x, y);
    if (defender && (defender.type === "monster" || defender.type === "hero")) {
      console.log(
        attacker.type +
          " is attacking " +
          defender.type +
          " for " +
          attacker.attack
      );
      defender.props.hp = defender?.props.hp - attacker?.attack;
      defender.props.dmg = true;
      if (defender.props.hp < 1) {
        clearTile(x, y);
      }
    } else {
      console.log(
        attacker.type +
          " tried to attack [col " +
          x +
          ", row" +
          y +
          "] but nothing to attack was there"
      );
    }
  };

  /*****HELPER METHODS*********/

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  /********************* */

  const play = () => {
    if (playing) {
      return;
    }
    if (!loggerSetup) {
      setupLogger();
    }
    setPlaying(true);
    playingRef.current = true;
  };

  const allTurns = async (entities: Entity[]) => {
    if (!playing) return;

    var index = 0;

    const entityTurn = async (entity: Entity) => {
      if (!playing || entity.props.hp < 1) return;
      entity.props.dmg = false;
      if (entity.type === "hero") {
        heroTurn();
      } else {
        monsterTurn(entity);
      }
      setReload(true);
      await delay(baseDelay);
      index++;
      if (index < entities.length) {
        entityTurn(entities[index]);
      }
    };
    await entityTurn(entities[index]);
  };

  const turn = async () => {
    while (playingRef.current && findQueen()) {
      var entities = getMonsters();
      entities.push(getHero());
      entities = entities.sort((x, y) => x.initiative - y.initiative);
      await allTurns(entities);
      await delay(entities.length * (baseDelay + baseDelay / 100));
    }
  };

  const removeFromRange = (monster: Entity) => {
    if (enemiesInRange.find((x) => x.id === monster.id)) {
      var index = enemiesInRange.indexOf(monster);
      setEnemiesInRage(enemiesInRange.splice(index, 1));
    }
  };

  const monsterTurn = (monster: Entity) => {
    //SAMPLE CODE / in further version logic should be interchangeable
    var hero = getHero();
    if (!hero) return;
    var colDiff = hero.col - monster.col;
    var rowDiff = hero.row - monster.row;
    var notBlocked = true;

    if (Math.abs(rowDiff) + Math.abs(colDiff) < 2) {
      if (!enemiesInRange.find((x) => x.id === monster.id)) {
        setEnemiesInRage([...enemiesInRange, monster]);
      }
      attack(hero.col, hero.row, monster);
    } else {
      removeFromRange(monster);
      if (Math.abs(rowDiff) > Math.abs(colDiff)) {
        // check which axis is further away, then reduce the one closer
        //reduce row axis
        if (rowDiff < 0) {
          notBlocked = moveUp(monster);
        } else if (rowDiff >= 1) {
          notBlocked = moveDown(monster);
        }
      } else {
        //recude col axis
        if (colDiff < 0) {
          notBlocked = moveLeft(monster);
        } else if (colDiff >= 1) {
          notBlocked = moveRight(monster);
        }
      }
      while (!notBlocked) {
        {
          var movementOptions = [
            (): boolean => {
              return moveDown(monster);
            },
            (): boolean => {
              return moveUp(monster);
            },
            (): boolean => {
              return moveLeft(monster);
            },
            (): boolean => {
              return moveRight(monster);
            },
          ];
          var pick = getRandomArbitrary(0, movementOptions.length - 1);
          notBlocked = movementOptions[Math.trunc(pick)]();
          console.log("Monster is confused, looking for alternative path");
        }
      }
    }
  };

  var hasDoneMovement = false;
  var hasDoneAction = false;

  /*exposed specific hero actions*/

  const moveHeroUp = () => {
    if (!hasDoneMovement) {
      const moved = moveUp(getHero());
      hasDoneMovement = moved;
      return moved;
    } else {
      console.log("Hero already moved, cant move again");
    }
  };

  const moveHeroDown = () => {
    if (!hasDoneMovement) {
      const moved = moveDown(getHero());
      hasDoneMovement = moved;
      return moved;
    } else {
      console.log("Hero already moved, cant move again");
    }
  };
  const moveHeroLeft = () => {
    if (!hasDoneMovement) {
      const moved = moveLeft(getHero());
      hasDoneMovement = moved;
      return moved;
    } else {
      console.log("Hero already moved, cant move again");
    }
  };
  const moveHeroRight = () => {
    if (!hasDoneMovement) {
      const moved = moveRight(getHero());
      hasDoneMovement = moved;
      return moved;
    } else {
      console.log("Hero already moved, cant move again");
    }
  };

  const attackUp = () => {
    if (hasDoneAction) {
      console.log("Hero can't attack, hes out of actions");
      return;
    }
    var hero = getHero();
    attack(hero.col, hero.row - 1, hero);
    hasDoneAction = true;
  };
  const attackDown = () => {
    if (hasDoneAction) {
      console.log("Hero can't attack, hes out of actions");
      return;
    }
    var hero = getHero();
    attack(hero.col, hero.row + 1, hero);
    hasDoneAction = true;
  };
  const attackLeft = () => {
    if (hasDoneAction) {
      console.log("Hero can't attack, hes out of actions");
      return;
    }
    var hero = getHero();
    attack(hero.col - 1, hero.row, hero);
    hasDoneAction = true;
  };
  const attackRight = () => {
    if (hasDoneAction) {
      console.log("Hero can't attack, hes out of actions");
      return;
    }
    var hero = getHero();
    attack(hero.col + 1, hero.row, hero);
    hasDoneAction = true;
  };

  const spinAttack = () => {
    if (hasDoneAction) {
      console.log("Hero can't spin attack, hes out of actions");
      return;
    }
    attackUp();
    hasDoneAction = false;
    attackDown();
    hasDoneAction = false;
    attackLeft();
    hasDoneAction = false;
    attackRight();
    console.log("The hero spin attacked");
  };

  const selfHeal = () => {
    if (hasDoneAction) {
      console.log("Hero can't heal, hes out of actions");
      return;
    }
    getHero().props.hp += 1;
    console.log("The hero healed for 1");
    hasDoneAction = true;
  };

  const Memory: any[] = [];

  const heroTurn = () => {
    hasDoneMovement = false;
    hasDoneAction = false;

    eval(jsCode);
  };

  // return <Editor />

  return (
    <div className="Container">
      <div className="title">
        <h1>Legend of the Coder</h1>
        <h5 className="subtitle">{mapData.name}</h5>
      </div>
      <div className="App">
        <div className="Play-grid">
          {mapData && !reload ? (
            <MapGrid mapData={mapData} editorClick={() => {}}></MapGrid>
          ) : (
            <MapGrid mapData={mapData} editorClick={() => {}}></MapGrid>
          )}
        </div>
        <div className="rulesBar">
          <div className="devHeader">
            <h3
              onClick={() => setActiveTab("RULES")}
              style={{
                textDecoration: activeTab === "RULES" ? "underLine" : undefined,
              }}
            >
              RULES
            </h3>
            <h3
              onClick={() => setActiveTab("HELP")}
              style={{
                textDecoration: activeTab === "HELP" ? "underLine" : undefined,
              }}
            >
              HELP
            </h3>
          </div>
          <div>
            {activeTab === "RULES" ? (
              <>
                <ul>
                  <li>
                    <strong>Victory:</strong> Reach the queen (move into her).
                  </li>
                  <li>
                    <strong>Lose:</strong> Hero has 0 HP.
                  </li>
                </ul>
                <p>
                  Your code will execute once per turn. The turn order is
                  determined by an entity's speed.
                </p>
                <p>In most cases, your hero will have the first turn.</p>
                <p>In your turn, you can only perform:</p>
                <ul>
                  <li>1 movement action</li>
                  <li>1 attack/interact action</li>
                </ul>
                <p>
                  To remember things longer than 1 turn, you should use the{" "}
                  <strong>Memory</strong> array.
                </p>
              </>
            ) : (
              <InfoArea />
            )}
          </div>
        </div>
        <div className="outputs">
          <p className="console" ref={playConsole}></p>
          <p
            className="stats"
            dangerouslySetInnerHTML={{ __html: statsOutput }}
          ></p>
        </div>
        <div className="buttonBar" onClick={play}>
          <p
            unselectable="on"
            className={"playText " + (playing ? "running" : "")}
          >
            PLAY
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
