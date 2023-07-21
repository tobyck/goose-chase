# Goose Chase

Goose Chase is a 2D, top-down, single-player game. You’re in an arrangement of equally sized rooms and running around somewhere is a goose, and it’s your job to find it without dying. Throughout the map, there are zombies (which can attack you, and be attacked by you); logs, which can be picked up and placed down to create walls, block entrances or provide shelter; food, which can be used to heal damage done by zombies; and other items to assist you in the game. With each level, the zombies get faster and better at finding you, and the goose gets faster and better at avoiding you. Eventually the game becomes so difficult that it’s “a wild goose chase”.

Have a look at the Controls section below, then try it out on [tobyck.github.io/goose-chase](https://tobyck.github.io/goose-chase).

## Controls

| Input           | Action              |
| --------------- | ------------------- |
| WASD/Arrow keys | Move                |
| Click           | Attack/pick up item |
| Right click     | Place item          |
| Shift           | Sneak               |
| Q               | Drop item           |
| F               | Switch hands        |
| H (hold down)   | Show hitboxes       |
| Esc/P           | Pause               |

## Credits

- [Skanne](https://www.youtube.com/@skannemusic) for the background music (licensed under [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/))
- [OpenGameArt](https://opengameart.org) for the sound effects, specifically:
  - [lamoot](https://opengameart.org/users/lamoot) for the footstep sounds (licensed under [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/))
  - [qubodup](https://opengameart.org/users/qubodup) for the item handling sounds (licensed under [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/))
  - [lokif](https://opengameart.org/users/lokif) for the 'action not allowed' sound (licensed under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/))
- [BexcellentGames](https://www.gamedevmarket.net/member/BexcellentGames) for the inpiration for the character sprites
- [The Slynyrd Blog](https://www.slynyrd.com/blog/2019/8/27/pixelblog-20-top-down-tiles) for floor tile inspiration

## Running Locally

To run this locally you can simply open `index.html`, but if you want to make changes to the code, follow the instructions below:

1. If you don't already have the code, clone the repository: `git clone https://github.com/tobyck/goose-chase.git`
2. Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) if not already installed (this will require [Node.js](https://nodejs.org) too)
3. Run `yarn install` to install dependencies
4. Use `yarn build` to make a minified bundle or `yarn watch` for live compilation.