layers(
    [
        "bg",
        "game",
        "ui"
    ]
)

//settings

let bulletspeed = 300; //bullet shooting speed

let movementspeed = 300; //player movement
let jumppower = 300; //player jump speed

let spawnrate = 2; //bubble spawn rate
let maxhits = 2; //maximum bubble wall bounces

let graceperiod = 3; //starting grace period

//score
let score = 0;

let maze = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [2,2,2,2,2,2,2,2,2,2],
    [1,1,1,1,1,1,1,1,1,1],
];

add([
    sprite("bg"),
    origin("topleft"),
    layer("bg")
])

function drawMap(maze) {
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
            if (maze[y][x] === 2) {
                add([
                    sprite("grass"),
                    pos(x*32+16, y*32+16),
                    layer("game"),
                    solid(),
                ]);
            }
            if (maze[y][x] === 1) {
                add([
                    rect(32, 32),
                    color(0.47, 0.25, 0),
                    pos(x*32+16, y*32+16),
                    layer("game")
                ]);
            }
        };
    };
};

drawMap(maze);

// bullet

action("bullet", (b) => {
    b.move(0, -bulletspeed);
    if (b.pos.y < 0) {
        destroy(b);
    };
});

//bubble

action("bubble", (b) => {
    if (b.is("movingleft")) {
        b.move(-70, 0);
    } else if (b.is("movingright")) {
        b.move(70, 0);
    };

    if (b.grounded()) {
        b.jump(rand(400,500));
    };

    if (b.pos.x > width() + 5) {
        b.removeTag("movingright");
        b.addTag("movingleft");
    } else if (b.pos.x < -5) {
        b.removeTag("movingleft");
        b.addTag("movingright");
    };
});

//bubble collision

collides("bullet", "bubble", (b, e) => {
    score += 1;
    e.score -= 1;
    e.text = e.score
    if (e.score == 0) {
        destroy(e);
    }

    destroy(b);
});

collides("player", "bubble", (p, e) => {
    add([
        rect(p.width, 4),
        pos(p.pos.x, p.pos.y+8),
        layer("game"),
        color(rgb(252,228,4)),
        body({
            maxVel: 6000
        }),
    ]);
    destroy(p);
    wait(2, () => {
        go("gameover", args={score: score, gamemode: "multihit"});
    });
});

//score ui
var scoretext = add([
    text("0"),
    scale(1.4),
    color(0, 0, 0),
    pos(12, 15),
    origin("left"),
    layer("ui")
]);

//player

var player = add([
    sprite("multihit"),
    layer("game"),
    pos(width()/2, height()-60),
    body(),
    "player"
]);

//controls


keyDown("left", () => {
    player.move(-movementspeed, 0);
});

keyDown("right", () => {
    player.move(movementspeed, 0);
});

keyPress("up", () => {
    if (player.grounded() && player.exists()) {
        player.jump(jumppower)
    };
});

var bulletactive = false;

keyPress("space", () => {
    bulletactive = !bulletactive;
});

loop(0.1, () => {
    if (bulletactive && player.exists()) {
        add([
            sprite("bullet"),
            pos(player.pos),
            layer("game"),
            "bullet"
        ]);
    };
});

player.action(() => {
    if (player.pos.x < 0) {
        player.move(400, 0)
    } else if (player.pos.x > width()) {
        player.move(-400, 0)
    };
});

scoretext.action(() => {
    scoretext.text = score.toString();
});

//campos(vec2(width()/2, height()/2));

wait(graceperiod, () => {
    loop(spawnrate, () => {
            var bubblescore = Math.ceil(rand(1, 5));

            bubble = add([
                sprite("bubble"),
                text(bubblescore),
                pos(rand(1, width()), 0),
                scale(rand(1, 1.5)),
                layer("game"),
                body(),
                "bubble",
                choose(["movingleft", "movingright"]),
            ]);
            
            bubble.hits = Math.ceil(rand(0, maxhits));
            bubble.score = bubblescore;
    });
});
