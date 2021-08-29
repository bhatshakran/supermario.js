kaboom({
  global: true,
  // fullscreen: true,
  scale: 1,
  width: 1000,
  height: 500,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

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
    "=": [sprite("block", solid())],
    "@": [sprite("coin")],
    "%": [sprite("block", solid(), "coin-surprise")],
    "*": [sprite("surprise", solid(), "mushroom-surprise")],
    "}": [sprite("unboxed", solid())],
    "(": [sprite("pipe-bottom-left", solid()), scale(0.5)],
    ")": [sprite("pipe-bottom-right", solid()), scale(0.5)],
    "-": [sprite("pipe-top-left", solid()), scale(0.5)],
    "+": [sprite("pipe-top-right", solid()), scale(0.5)],
  };

  const gameLevel = addLevel(map, levelCfg);
});

go("game");
