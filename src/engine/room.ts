/*
 * engine/room.ts
 *
 * This file contains the Room class which represents a single room in the game.
 * The class has a reference to the game object that it belongs to, its
 * position in the game, and a 2D array of tiles. Although every room also
 * has walls, they can be collided with so they're implemented as entities
 * unlike the floor tiles.
 */

import * as components from "../components";
import type Game from "../main";
import { Vec } from "../helpers";

// an enum to represent the possible floor tiles

enum Tile {
    ShortGrass,
    TallGrass,
    Flowers1,
    Flowers2
}

export class Room {
    game: Game; // reference to the game object that this room is a part of
    pos: Vec; // position of the room in the game
    tiles: Tile[][] = []; // 2D array of tiles

    // see map_gen.ts for more what this is for
    doors: {
        top: number[],
        bottom: number[],
        left: number[],
        right: number[]
    };

    constructor(game: Game, pos: Vec) {
        this.game = game;
        this.pos = pos;

        for (let y = 0; y < this.game.roomSize.y; y++) { // for each row
            this.tiles.push([]); // push an empty tile array
            for (let x = 0; x < this.game.roomSize.x; x++) { // for each column
                if ( // if on the edge
                    x == 0 ||
                    y == 0 ||
                    x == this.game.roomSize.x - 1 ||
                    y == this.game.roomSize.y - 1
                ) this.tiles[y].push(Tile.ShortGrass); // make it short grass

                else {
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
        // clear the whole canvas
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);

        for (let y = 0; y < this.game.roomSize.y; y++) { // for each row
            for (let x = 0; x < this.game.roomSize.x; x++) { // for each column
                const tile: Tile = this.tiles[y][x]; // get the tile at the current position
                const tw = this.game.tileSize; // shorthand for tile width

                this.game.ctx.drawImage(
                    this.game.getImage("tiles"),

                    // source x, y, width, and height

                    tile * 16, // the enum values are [0-3] so we can use them as indices in the spritesheet
                    0, // the grass tiles are all on the first row of the spritesheet
                    16, 16, // the tiles are 16x16 pixels on the spritesheet

                    // destination x, y, width, and height
                    x * tw,
                    y * tw,
                    tw,
                    tw
                );
            }
        }
    }

    // getter function to get the entities which are in this room

    get entities() {
        // return room's entities with item boxes prepended (so that collisions 
        // work for them even in other rooms and they're rendered on top)
        return [this.game.leftHandItemBox, this.game.rightHandItemBox].concat(
            this.game.ecs.entities.filter(entity => {
                if (!this.game.ecs.hasComponent(entity, components.PositionComponent)) {
                    return false;
                }

                return Vec.equal(
                    this.game.ecs.getComponent(entity, components.PositionComponent).room,
                    this.pos
                );
            })
        );
    }
}