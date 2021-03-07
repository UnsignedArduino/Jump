// Auto-generated code. Do not edit.
namespace myImages {

    helpers._registerFactory("image", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "image1":
            case "moving_platform_head":return img`
7 7 7 7 
7 7 7 7 
7 7 7 7 
7 7 7 7 
`;
            case "image2":
            case "front_facing":return img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. 6 f 6 f 6 . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 . . . 6 . . 
. 6 . . . 6 . . 
`;
            case "image3":
            case "coin":return img`
. . b b b b . . 
. b 5 5 5 5 b . 
b 5 d 3 3 d 5 b 
b 5 3 5 5 1 5 b 
c 5 3 5 5 1 d c 
c d d 1 1 d d c 
. f d d d d f . 
. . f f f f . . 
`;
            case "image4":
            case "sign":return img`
. . . . . . . . 
. e e e e e e e 
. e f e f f f e 
. e e e e e e e 
. e f f f e f e 
. e e e e e e e 
. . . . e . . . 
. . . . e . . . 
`;
            case "image5":
            case "customization_icon":return img`
. . . . . . f . 
. . . . . f f . 
. . . . f f . . 
. . . f f . . . 
. . f f . . . . 
. d d . . . . . 
2 2 d . . . . . 
2 . . . . . . . 
`;
            case "image6":
            case "night_time_icon":return img`
. . 1 1 1 1 . . 
. . . 1 1 1 1 . 
. . . . . 1 1 . 
1 . . . . 1 1 . 
1 1 . . 1 1 1 . 
1 1 1 1 1 1 . . 
. 1 1 1 1 . . . 
. . . . . . . . 
`;
            case "image7":
            case "day_time_icon":return img`
. . . . . . . . 
. . 5 . 5 . . . 
. . . . . . 5 . 
. 5 . 5 5 . . . 
. . . 5 5 . 5 . 
. 5 . . . . . . 
. . . 5 . 5 . . 
. . . . . . . . 
`;
        }
        return null;
    })

    helpers._registerFactory("animation", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "walk_left":
            case "anim1":return [img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. f 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. . . . . 6 . . 
. . . . . 6 . . 
`, img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. f 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 . . . . . . 
. 6 . . . . . . 
`];
            case "look_left":
            case "anim2":return [img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. f 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 . . . 6 . . 
. 6 . . . 6 . . 
`];
            case "walk_right":
            case "anim3":return [img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. 6 6 f 6 f . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 . . . . . . 
. 6 . . . . . . 
`, img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. 6 6 f 6 f . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. . . . . 6 . . 
. . . . . 6 . . 
`];
            case "look_straight":
            case "anim5":return [img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. 6 f 6 f 6 . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 . . . 6 . . 
. 6 . . . 6 . . 
`];
            case "look_left0":
            case "anim4":return [img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. 6 6 f 6 f . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 6 6 6 6 . . 
. 6 . . . 6 . . 
. 6 . . . 6 . . 
`];
            case "look_down":
            case "anim6":return [img`
. 8 8 8 8 8 . . 
8 8 8 8 8 8 8 . 
. 6 6 6 6 6 . . 
. 6 f 6 f 6 . . 
. 6 6 6 6 6 . . 
. 6 6 f 6 6 . . 
. 6 . . . 6 . . 
. 6 . . . 6 . . 
`];
            case "coin_bobbing":
            case "anim7":return [img`
. . . . . . . . 
. . . . . . . . 
. . b b b b . . 
. b 5 5 5 5 b . 
b 5 d 3 3 d 5 b 
b 5 3 5 5 1 5 b 
c 5 3 5 5 1 d c 
c d d 1 1 d d c 
. f d d d d f . 
. . f f f f . . 
`, img`
. . . . . . . . 
. . b b b b . . 
. b 5 5 5 5 b . 
b 5 d 3 3 d 5 b 
b 5 3 5 5 1 5 b 
c 5 3 5 5 1 d c 
c d d 1 1 d d c 
. f d d d d f . 
. . f f f f . . 
. . . . . . . . 
`];
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
