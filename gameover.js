 var gamemode = args.gamemode;

add([
    rect(width(), 80),
    color(0.1, 0.1, 0.1),
    solid(),
    pos(0, height()-20),
    origin("left"),
]);

var player = add([
        sprite(gamemode),
        pos(width()/2, 60),
        body(),
        "player"
]);

var jumppower = 200;

var gmscoretext = add([
    text("Game Over"),
    pos(width()/2, height()/2-60),
    scale(4)
]);

add([
    text("Score: " + args.score),
    pos(width()/2, height()/2-20),
    scale(2)
]);

add([
    text("press space to continue"),
    pos(width()/2, height()/2),
    scale(1)
]);

mouseClick(() => {
    destroy(player);
    if (gamemode == "main") {
        gamemode = "multihit";
    } else if (gamemode == "multihit") {
        gamemode = "crazycookie";
    } else if (gamemode == "crazycookie") {
        gamemode = "main";
    };
    player = add([
        sprite(gamemode),
        pos(width()/2, height()-30),
        body(),
        "player"
    ]);
});

loop(0, () => {
   if (player.grounded() && jumppower > 1) {
       player.jump(jumppower);
       jumppower = jumppower / 2;
   };
});

loop(0.1, () => {
    gmscoretext.color = rgb(rand(), rand(), rand());
});

keyPress("space", () => {
    go(gamemode);
});
