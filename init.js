var player = add([
        sprite("main"),
        pos(width()/2, height()/2),
        scale(4),
        rotate(0),
]);

var inittext = add([
    text("click smiley to begin"),
    pos(width()/2, height()-60),    
]);

player.action(() => {
    player.angle += dt();
    player.pos = vec2(-mousePos().x+width(), -mousePos().y+height());
});

player.clicks(() => {
    destroy(player);
    var deadplayer = add([
        sprite("main"),
        pos(player.pos),
        scale(4),
        rotate(player.angle),
        body()
    ]);
    
    deadplayer.action(() => {
        if (deadplayer.pos.y > height()+100) {
            destroy(deadplayer);
        }
    });

    wait(0.8, () => {
        play("bgaudio", {
            loop: true,
        })
        go("main");
    });
});
