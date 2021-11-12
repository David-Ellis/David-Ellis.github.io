kaboom({
    global: true,
    fullscreen: true,
    scale: 0.6,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

MOVE_SPEED = 300
ENEMY_SPEED = 200
JUMP_FORCE = 850
FALL_DEATH = 1400

loadSprite("brick", "https://i.imgur.com/HvcsL2g.png")
loadSprite("player", "https://i.imgur.com/WkGDSd6.png")
loadSprite("zombie", "https://i.imgur.com/DmA2S0c.png")
loadSprite("wood", "https://i.imgur.com/LnGTA6a.png")

scene("game", ( {score} ) => {
    layers(["bg", "obj"], "obj")

    const map = [
        "|                                   |",
        "|                                   |",
        "|===============     ===============|",
        "|                                   |",
        "|                                   |",
        "|                                   |",
        "|                                   |",
        "|         =================         |",
        "|                                   |",
        "|                                   |",
        "|                                   |",
        "|                                   |",
        "|===============     ===============|",
        "|                                   |",
        "|                                   |",
        "|                                   |",
        "|                                   |",
        "|         =================         |",
        "|                                   |",
        "|                                   |",
    ]


    const levelCfg = {
        width: 64,
        height: 64,
        "=": [sprite("brick"), solid()],     
        "|": [sprite("brick"), solid(), "wall"], 
    }

    const gameLevel = addLevel(map, levelCfg)

    // const zombie = add([
    //     sprite("zombie"),
    //     pos(500, 0),
    //     body(),
    //     {dir: 1},
    //     "dangerous"
    // ])

    //let score = 0

    let scoreLabel = add([text(score, 40),
        pos(100, 20),
        layer("bg"),
        {
            value: score
        }
    ])





    loop(5, () => {
        add([
            sprite("wood"),
            pos(0, 0),
            layer("bg")
        ]) 
        
        score += 1
        add([text(score, 40),
            pos(100, 20),
            layer("bg"),
        ])

        const initPos = Math.floor(Math.random() * 2400)
        let dir = 0
        if (initPos > 1200) {
            dir = -1
        } else {
            dir = 1
        }
        if (20 + (60 -Math.floor(Math.random()*60)) > 40){
            add([
                sprite("zombie"),
                pos(initPos, 0),
                body(),

                {dir: dir},
                "dangerous"
            ])
        }
    })

    const player = add([
        sprite("player"), solid(),
        pos(60, 300),
        body(),
        origin("bot"),
    ])

    player.collides("dangerous", (d) => {
        go("lose", { score })
    })

    player.action(()=> {
        if (player.pos.y >= FALL_DEATH) {
            go("lose", { score })
        }
    })

    collides("dangerous", "wall", (d) => {
        d.dir = -d.dir
    })

    action("dangerous", (d) => {
        d.move(d.dir * ENEMY_SPEED, 0)

        if (d.pos.y >= FALL_DEATH) {
            destroy(d)
        }
    })


    // Controls

    keyDown("left", () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown("right", () => {
        player.move(MOVE_SPEED, 0)
    })

    keyDown("space", () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE)
        }
    })


})

scene("lose", ({ score }) => {
    add([text("You died!", 100), origin("center"), pos(width()/2, height()/2)])
    add([text("score : " + String(score), 60), origin("center"), pos(width()/2, height()*0.6)])
})




start("game", {score:0})