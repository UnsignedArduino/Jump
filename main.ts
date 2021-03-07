namespace SpriteKind {
    export const MovingPlatform = SpriteKind.create()
    export const Sign = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (jumps_made < constants_jumps_max && can_jump) {
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
                    local_col = make_map(19, Math.floor(width), 3, 3)
                    tiles.placeOnTile(sprite_player, tiles.getTileLocation(local_col, tiles.tilemapRows() - 4))
                    traveled_height = sprite_player.y
                    if (levels_passed == 0) {
                        make_sign(local_col, tiles.tilemapRows() - 4, "Be careful!\\n" + "If you fall below this platform, you will die!" + "" + "" + "")
                    }
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
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (sprite_player.overlapsWith(sprite_customization_icon)) {
        timer.throttle("activate_customizer", 100, function () {
            enable_controls(false)
            blockMenu.showMenu(["Cancel", "Change hat color", "Change skin color", "Reset look"], MenuStyle.List, MenuLocation.FullScreen)
            wait_for_menu_select()
            if (blockMenu.selectedMenuOption().includes("Cancel")) {
            	
            } else if (blockMenu.selectedMenuIndex() == 1) {
                local_color = ask_for_color()
                if (local_color != -1) {
                    hat_color = local_color
                    blockSettings.writeNumber("hat_color", hat_color)
                    fade_in(2000, true)
                    game.reset()
                }
            } else if (blockMenu.selectedMenuIndex() == 2) {
                local_color = ask_for_color()
                if (local_color != -1) {
                    body_color = local_color
                    blockSettings.writeNumber("body_color", body_color)
                    fade_in(2000, true)
                    game.reset()
                }
            } else if (blockMenu.selectedMenuIndex() == 3) {
                hat_color = 8
                body_color = 6
                blockSettings.writeNumber("hat_color", hat_color)
                blockSettings.writeNumber("body_color", body_color)
                fade_in(2000, true)
                game.reset()
            }
            timer.after(100, function () {
                enable_controls(true)
            })
        })
    } else if (sprite_player.overlapsWith(sprite_nighttime_mode)) {
        timer.throttle("switch_nighttime", 100, function () {
            night_time = !(night_time)
            write_bool("night_time", night_time)
            enable_controls(false)
            fade_in(2000, true)
            game.reset()
        })
    } else if (overlaping_of_kind(sprite_player, SpriteKind.Sign).length > 0) {
        for (let location of tiles.getTilesByType(assets.tile`moving_platform`)) {
            tiles.setTileAt(location, assets.tile`transparency8`)
            tiles.setWallAt(location, false)
        }
        game.showLongText(sprites.readDataString(overlaping_of_kind(sprite_player, SpriteKind.Sign)[0], "text"), DialogLayout.Full)
        for (let location of tiles.getTilesByType(assets.tile`moving_platform`)) {
            tiles.setTileAt(location, assets.tile`transparency8`)
            tiles.setWallAt(location, false)
        }
    }
})
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
function write_bool (name: string, value: boolean) {
    if (value) {
        blockSettings.writeNumber(name, 1)
    } else {
        blockSettings.writeNumber(name, 0)
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (jumps_made < constants_jumps_max && can_jump) {
        jump(sprite_player, constants_gravity, 32)
        jumps_made += 1
    }
})
function clear_map () {
    if (night_time) {
        tiles.setSmallTilemap(tilemap`next_levels_night`)
    } else {
        tiles.setSmallTilemap(tilemap`next_levels`)
    }
    for (let sprite of sprites.allOfKind(SpriteKind.MovingPlatform)) {
        sprite.destroy()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Food)) {
        sprite.destroy()
    }
    for (let sprite of sprites.allOfKind(SpriteKind.Sign)) {
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
function make_sign (col: number, row: number, text: string) {
    sprite_sign = sprites.create(assets.image`sign`, SpriteKind.Sign)
    tiles.placeOnTile(sprite_sign, tiles.getTileLocation(col, row))
    sprites.setDataString(sprite_sign, "text", text)
}
function fade_out (time: number, block: boolean) {
    color.startFade(color.Black, color.originalPalette, time)
    if (block) {
        color.pauseUntilFadeDone()
    }
}
function read_bool (name: string) {
    return blockSettings.readNumber(name) == 1
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
function wait_for_menu_select () {
    selected_menu = false
    while (!(selected_menu)) {
        pause(100)
    }
    blockMenu.closeMenu()
}
function ask_for_color () {
    blockMenu.showMenu([
    "Cancel",
    "White",
    "Red",
    "Pink",
    "Orange",
    "Yellow",
    "Cyan",
    "Green",
    "Dark blue",
    "Light blue",
    "Purple",
    "Light purple",
    "Dark purple",
    "Tan",
    "Brown",
    "Black"
    ], MenuStyle.Grid, MenuLocation.FullScreen)
    wait_for_menu_select()
    if (blockMenu.selectedMenuOption().includes("Cancel")) {
        return -1
    } else {
        return blockMenu.selectedMenuIndex()
    }
}
function make_transition (left: number, width: number, height: number) {
    for (let index = 0; index <= width - 1; index++) {
        tiles.setTileAt(tiles.getTileLocation(left + index, height), assets.tile`transition_block`)
        tiles.setWallAt(tiles.getTileLocation(left + index, height), true)
    }
}
function overlaping_of_kind (sprite_overlap: Sprite, kind: number) {
    local_sprites_overlapped = []
    for (let sprite of sprites.allOfKind(kind)) {
        if (sprite_overlap.overlapsWith(sprite)) {
            local_sprites_overlapped.push(sprite)
        }
    }
    return local_sprites_overlapped
}
function enable_controls (enable: boolean) {
    if (enable) {
        controller.moveSprite(sprite_player, 100, 0)
    } else {
        controller.moveSprite(sprite_player, 0, 0)
    }
    can_jump = enable
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
blockMenu.onMenuOptionSelected(function (option, index) {
    selected_menu = true
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`bottom_of_sky_night`, function (sprite, location) {
    sprite.setFlag(SpriteFlag.Ghost, true)
    enable_controls(false)
    timer.after(500, function () {
        sprite.destroy()
    })
    timer.after(2000, function () {
        game.over(false)
    })
})
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
let local_sprites_overlapped: Sprite[] = []
let selected_menu = false
let sprite_coin: Sprite = null
let sprite_sign: Sprite = null
let local_color = 0
let local_col = 0
let sprite_nighttime_mode: Sprite = null
let sprite_customization_icon: Sprite = null
let sprite_player: Sprite = null
let levels_passed = 0
let double_platform_chance = 0
let moving_platform_speed = 0
let width = 0
let traveled_height = 0
let can_jump = false
let jumps_made = 0
let night_time = false
let body_color = 0
let hat_color = 0
let constants_jumps_max = 0
let constants_gravity = 0
constants_gravity = 400
constants_jumps_max = 2
if (blockSettings.exists("hat_color")) {
    hat_color = blockSettings.readNumber("hat_color")
} else {
    hat_color = 8
}
if (blockSettings.exists("body_color")) {
    body_color = blockSettings.readNumber("body_color")
} else {
    body_color = 6
}
if (blockSettings.exists("night_time")) {
    night_time = read_bool("night_time")
} else {
    night_time = false
}
jumps_made = 0
can_jump = true
traveled_height = 0
width = 5
moving_platform_speed = 10000
double_platform_chance = 50
levels_passed = 0
color.setPalette(
color.Black
)
sprite_player = sprites.create(assets.image`front_facing`, SpriteKind.Player)
animate_player(sprite_player)
enable_controls(true)
sprite_player.ay = constants_gravity
sprite_player.z = 10
info.setScore(0)
tiles.setSmallTilemap(tilemap`starting_level`)
if (night_time) {
    scene.setBackgroundColor(15)
} else {
    scene.setBackgroundColor(9)
}
scene.cameraFollowSprite(sprite_player)
tiles.placeOnTile(sprite_player, tiles.getTileLocation(1, 58))
traveled_height = sprite_player.y
make_map(18, width, 5, 3)
make_sign(2, 58, "Welcome to Jump!\\n \\n" + "Press the left/right keys to move.\\n" + "Press A/up key to jump.\\n" + "Press B to read signs." + "")
make_sign(4, 58, "Your high score is: " + info.highScore())
sprite_customization_icon = sprites.create(assets.image`customization_icon`, SpriteKind.Sign)
tiles.placeOnTile(sprite_customization_icon, tiles.getTileLocation(17, 58))
if (night_time) {
    sprite_nighttime_mode = sprites.create(assets.image`day_time_icon`, SpriteKind.Sign)
} else {
    sprite_nighttime_mode = sprites.create(assets.image`night_time_icon`, SpriteKind.Sign)
}
tiles.placeOnTile(sprite_nighttime_mode, tiles.getTileLocation(15, 58))
blockMenu.setColors(1, 15)
fade_out(2000, false)
game.onUpdate(function () {
    sprite_player.image.replace(6, body_color)
    sprite_player.image.replace(8, hat_color)
})
forever(function () {
    if (levels_passed < 5 && !(night_time)) {
        effects.clouds.startScreenEffect(100)
    }
    pause(1000 + levels_passed * 500)
})
