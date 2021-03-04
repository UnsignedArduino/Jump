namespace SpriteKind {
    export const MovingPlatform = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (jumps_made < constants_jumps_max) {
        jump(sprite_player, constants_gravity, 32)
        jumps_made += 1
    }
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Bottom)) {
        jumps_made = 0
        if (sprite_player.y < traveled_height) {
            traveled_height = sprite_player.y
            info.changeScoreBy(1)
        }
        if (sprite.tileKindAt(TileDirection.Bottom, assets.tile`trampoline`)) {
            jump(sprite_player, constants_gravity, 64)
            tiles.setTileAt(location, assets.tile`activated_trampoline`)
            timer.after(100, function () {
                tiles.setTileAt(location, assets.tile`trampoline`)
            })
        } else if (sprite.tileKindAt(TileDirection.Bottom, assets.tile`transition_block`)) {
            timer.throttle("switch_boards", 5000, function () {
                timer.background(function () {
                    enable_controls(false)
                    fade_in(2000, true)
                    clear_map()
                    tiles.placeOnTile(sprite_player, tiles.getTileLocation(make_map(19, Math.floor(width), 3, 3), tiles.tilemapRows() - 4))
                    traveled_height = sprite_player.y
                    fade_out(2000, false)
                    enable_controls(true)
                    width = Math.max(width - 0.25, 3)
                    moving_platform_speed = Math.max(moving_platform_speed - 1000, 3000)
                    levels_passed += 1
                })
            })
        }
    }
})
function make_platform (left: number, width: number, height: number) {
    for (let index = 0; index <= width - 1; index++) {
        tiles.setTileAt(tiles.getTileLocation(left + index, height), assets.tile`block`)
        tiles.setWallAt(tiles.getTileLocation(left + index, height), true)
    }
}
function make_trampoline (left: number, width: number, height: number) {
    for (let index = 0; index <= width - 1; index++) {
        tiles.setTileAt(tiles.getTileLocation(left + index, height), assets.tile`trampoline`)
        tiles.setWallAt(tiles.getTileLocation(left + index, height), true)
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`bottom_of_sky`, function (sprite, location) {
    sprite.setFlag(SpriteFlag.Ghost, true)
    enable_controls(false)
    timer.after(500, function () {
        sprite.destroy()
    })
    timer.after(2000, function () {
        game.over(false)
    })
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (jumps_made < constants_jumps_max) {
        jump(sprite_player, constants_gravity, 32)
        jumps_made += 1
    }
})
function clear_map () {
    tiles.setSmallTilemap(tilemap`next_levels`)
    for (let sprite of sprites.allOfKind(SpriteKind.MovingPlatform)) {
        sprite.destroy()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Food)) {
        sprite.destroy()
    }
}
scene.onOverlapTile(SpriteKind.MovingPlatform, assets.tile`transparency8`, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`moving_platform`)
    tiles.setWallAt(location, true)
    timer.after(sprites.readDataNumber(sprite, "block_delay"), function () {
        tiles.setTileAt(location, assets.tile`transparency8`)
        tiles.setWallAt(location, false)
    })
})
function fade_out (time: number, block: boolean) {
    color.startFade(color.Black, color.originalPalette, time)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function make_coin (col: number, row: number) {
    sprite_coin = sprites.create(assets.image`coin`, SpriteKind.Food)
    animation.runImageAnimation(
    sprite_coin,
    assets.animation`coin_bobbing`,
    500,
    true
    )
    tiles.placeOnTile(sprite_coin, tiles.getTileLocation(col, row))
    sprite_coin.y += -3
}
function fade_in (time: number, block: boolean) {
    color.startFade(color.originalPalette, color.Black, time)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function make_transition (left: number, width: number, height: number) {
    for (let index = 0; index <= width - 1; index++) {
        tiles.setTileAt(tiles.getTileLocation(left + index, height), assets.tile`transition_block`)
        tiles.setWallAt(tiles.getTileLocation(left + index, height), true)
    }
}
function enable_controls (enable: boolean) {
    if (enable) {
        controller.moveSprite(sprite_player, 100, 0)
    } else {
        controller.moveSprite(sprite_player, 0, 0)
    }
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    for (let location of tiles.getTilesByType(assets.tile`moving_platform`)) {
        tiles.setTileAt(location, assets.tile`transparency8`)
        tiles.setWallAt(location, false)
    }
    scene.systemMenu.showSystemMenu()
for (let location of tiles.getTilesByType(assets.tile`moving_platform`)) {
        tiles.setTileAt(location, assets.tile`transparency8`)
        tiles.setWallAt(location, false)
    }
})
function jump (sprite: Sprite, gravity: number, pixels: number) {
    sprite.vy = Math.sqrt(2 * (gravity * pixels)) * -1
}
function make_map (num_platforms: number, width: number, start_y: number, space: number) {
    let index = 0
    local_start = randint(0, 20 - width)
    make_platform(local_start, width, 60 - (index * space + start_y))
    for (let index = 0; index <= num_platforms - 3; index++) {
        make_random(randint(0, 20 - width), width, 60 - ((index + 1) * space + start_y))
    }
    make_transition(randint(0, 20 - width), width, 60 - ((num_platforms - 1) * space + start_y))
    return local_start + Math.round(width / 2)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy(effects.trail, 100)
    info.changeScoreBy(1)
})
function make_random (left: number, width: number, height: number) {
    local_random = randint(0, 100)
    if (local_random < 50) {
        make_platform(left, width, height)
        if (Math.percentChance(3)) {
            make_coin(randint(left + 1, left + width - 1), height - 1)
        }
        if (Math.percentChance(double_platform_chance)) {
            make_platform(left + randint(width, 20), width, height)
        }
    } else if (local_random < 75) {
        make_trampoline(left, width, height)
        if (Math.percentChance(3)) {
            make_coin(randint(left + 1, left + width - 1), height - 1)
        }
    } else {
        make_moving_platform(left, width, height, moving_platform_speed)
    }
}
function animate_player (sprite: Sprite) {
    character.loopFrames(
    sprite,
    assets.animation`walk_left`,
    200,
    character.rule(Predicate.MovingLeft)
    )
    character.loopFrames(
    sprite,
    assets.animation`look_left`,
    200,
    character.rule(Predicate.NotMoving, Predicate.FacingLeft)
    )
    character.loopFrames(
    sprite,
    assets.animation`walk_right`,
    200,
    character.rule(Predicate.MovingRight)
    )
    character.loopFrames(
    sprite,
    assets.animation`look_left0`,
    200,
    character.rule(Predicate.NotMoving, Predicate.FacingRight)
    )
    character.loopFrames(
    sprite,
    assets.animation`look_straight`,
    200,
    character.rule(Predicate.MovingUp)
    )
    character.loopFrames(
    sprite,
    assets.animation`look_down`,
    200,
    character.rule(Predicate.MovingDown)
    )
}
function make_moving_platform (left: number, width: number, height: number, time: number) {
    sprite_moving_platform = sprites.create(assets.image`moving_platform_head`, SpriteKind.MovingPlatform)
    tiles.placeOnTile(sprite_moving_platform, tiles.getTileLocation(0, height))
    sprite_moving_platform.left = left * 8
    sprite_moving_platform.setFlag(SpriteFlag.Invisible, true)
    sprites.setDataNumber(sprite_moving_platform, "block_delay", time / 10)
    local_path = ""
    for (let index = 0; index < (156 - sprite_moving_platform.left) / 8; index++) {
        local_path = "" + local_path + " h " + "8"
    }
    for (let index = 0; index < 20; index++) {
        local_path = "" + local_path + " h " + "-8"
    }
    for (let index = 0; index < Math.abs(sprite_moving_platform.left - 4) / 8; index++) {
        local_path = "" + local_path + " h " + "8"
    }
    animation.runMovementAnimation(
    sprite_moving_platform,
    local_path,
    time,
    true
    )
}
let local_path = ""
let sprite_moving_platform: Sprite = null
let local_random = 0
let local_start = 0
let sprite_coin: Sprite = null
let sprite_player: Sprite = null
let double_platform_chance = 0
let moving_platform_speed = 0
let width = 0
let traveled_height = 0
let jumps_made = 0
let constants_jumps_max = 0
let constants_gravity = 0
constants_gravity = 400
constants_jumps_max = 2
jumps_made = 0
traveled_height = 0
width = 5
moving_platform_speed = 10000
double_platform_chance = 50
let levels_passed = 0
color.setPalette(
color.Black
)
sprite_player = sprites.create(assets.image`front_facing`, SpriteKind.Player)
animate_player(sprite_player)
enable_controls(true)
sprite_player.ay = constants_gravity
info.setScore(0)
tiles.setSmallTilemap(tilemap`starting_level`)
scene.setBackgroundColor(9)
scene.cameraFollowSprite(sprite_player)
tiles.placeOnTile(sprite_player, tiles.getTileLocation(1, 58))
traveled_height = sprite_player.y
make_map(18, width, 5, 3)
fade_out(2000, false)
forever(function () {
    if (levels_passed < 5) {
        effects.clouds.startScreenEffect(100)
    }
    pause(1000 + levels_passed * 500)
})
