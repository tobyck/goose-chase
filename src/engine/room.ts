/*
 * engine/room.ts
 *
 * This file contains the Room class which represents a single room in the game.
 * The class has a reference to the game object that it belongs to, its
 * position in the game, and a 2D array of tiles. Although every room also
 * has walls, they can be collided so they're implemented as entities.
 */

import * as components from "../components/components";
import Game from "../main";
import { Vec } from "../util";

// an enum to represent the possible floor tiles

enum Tile {
    ShortGrass,
    TallGrass,
    Flowers1,
    Flowers2
}

export class Room {
    game: Game; // reference to the game object that this room is a part of
    pos: Vec;
    tiles: Tile[][] = [];

    constructor(game: Game, pos: Vec) {
        this.game = game;
        this.pos = pos;

        for (let y = 0; y < this.game.roomSize.y; y++) { // for each row
            this.tiles.push([]); // push an empty tile array
            for (let x = 0; x < this.game.roomSize.x; x++) { // for each column
                if (
                    x === 0 ||
                    y === 0 ||
                    x === this.game.roomSize.x - 1 ||
                    y === this.game.roomSize.y - 1
                ) { // if the tile is on the edge make it short grass (plain green)
                    this.tiles[y].push(Tile.ShortGrass);
                } else {
                    const tile = Math.random() < .8 // 80% chance of short grass
                        ? Tile.ShortGrass
                        : Math.random() < .7
                            ? Tile.TallGrass
                            : Math.random() < .5
                                ? Tile.Flowers1
                                : Tile.Flowers2;

                    this.tiles[y].push(tile);
                }
            }
        }
    }

    // renders the room and its entities

    render() {
        for (let y = 0; y < this.game.roomSize.y; y++) { // for each row
            for (let x = 0; x < this.game.roomSize.x; x++) { // for each column
                const tile: Tile = this.tiles[y][x]; // get the tile at the current position
                const tw = this.game.tileWidth; // shorthand for tile width

                this.game.ctx.drawImage(
                    this.game.images["tiles"], // image

                    // source x, y, width, and height

                    tile * 16, // the enum values are [0-3] so we can use them as indices in the spritesheet
                    0, // the grass tiles are all on the first row of the spritesheet
                    16, 16, // the tiles are 16x16 pixels on the spritesheet

                    // destination x, y, width, and height
                    x * tw,
                    y * tw,
                    tw,
                    tw
                )
            }
        }
    }

    // getter function to get the entities which are in this room
    // (exists only to get around a circular dependency)

    get entities() {
        return this.game.ecs.entities.filter(entity => Vec.equal(
            this.game.ecs.getComponent(entity, components.PositionComponent).room,
            this.pos
        ));
    }
}