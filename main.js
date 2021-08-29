kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

const MOVE_SPEED = 120;
const JUMP_FORCE = 360;
const BIG_JUMP_FORCE = 550;
let CURRENT_JUMP_FORCE = JUMP_FORCE;

loadRoot("./pics/");
loadSprite("coin", "coin.png");
loadSprite("evil-shroom", "evilshroom.png");
loadSprite("brick", "brick.png");
loadSprite("block", "stone.png");
loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("surprise", "surprisebox.png");
loadSprite("unboxed", "openedbox.png");
loadSprite("pipe-top-left", "topleft.png");
loadSprite("pipe-top-right", "topright.png");
loadSprite("pipe-bottom-left", "bottomleft.png");
loadSprite("pipe-bottom-right", "bottomright.png");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                            ",
    "                            ",
    "                            ",
    "                            ",
    "                            ",
    "                            ",
    "                            ",
    "                            ",
    "                            ",
    "                            ",
    "                            ",
    "     %  =*=%=               ",
    "                            ",
    "                      -+    ",
    "                ^  ^  ()    ",
    "======================== ===",
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    "@": [sprite("coin"), "coin"],
    "%": [sprite("surprise"), solid(), "coin-surprise"],
    "*": [sprite("surprise"), solid(), "mushroom-surprise"],
    "}": [sprite("unboxed"), solid()],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
    "-": [sprite("pipe-top-left"), solid(), scale(0.5)],
    "+": [sprite("pipe-top-right"), solid(), scale(0.5)],
    "^": [sprite("evil-shroom"), solid()],
    "#": [sprite("mushroom"), "mushroom", body()],
  };

  // game level instantiation
  const gameLevel = addLevel(map, levelCfg);

  // score
  const scoreLabel = add([
    text("score"),
    pos(30, 6),
    layer("ui"),
    {
      value: "score",
    },
  ]);

  add([text("level" + "test", pos(4, 6))]);

  // Function big
  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);
        CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
        timer = time;
        isBig = true;
      },
    };
  }

  // player instantiation
  const player = add([
    sprite("mario"),
    pos(30, 0),
    origin("bot"),
    body(),
    big(),
  ]);

  // Mushroom motion
  action("mushroom", (m) => {
    m.move(10, 0);
  });

  // On unsprised box headbump
  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("@", obj.gridPos.sub(0, 1));
      destroy(obj);
      // Render opened box
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroom-surprise")) {
      // Render opened box
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
    }
  });

  // If the player collides with a mushroom
  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify(6);
  });

  // If player collides with a coin
  player.collides("coin", (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  });

  // Player movement

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });
  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });
  keyPress("space", () => {
    if (player.grounded()) {
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
});

start("game");
