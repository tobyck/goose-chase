/* 
 * engine/mapgen.ts
 *
 * This file is responsible for generating the map.
 */

import * as components from "../components/components";
import Game from "../main";
import { Vec } from "../util";
import { Room } from "./room";

/* 
 * Given the minimum distance from the side of the room, and the width of the door
 * return an array of numbers representing where the door is. For #####...## 
 * (where # is a wall and . is a floor tile i.e. the door leading into another room)
 * the array would be [5, 6, 7], sideWidth would be 10, and doorWidth would be 3.
 */

const generateDoor = (minDistFromSide: number, sideWidth: number, doorWidth: number): number[] => {
    // first tile of the door
    const start = Math.floor(Math.random() * (sideWidth - (minDistFromSide * 2) - (doorWidth - 1))) + minDistFromSide;

    // return the range [start, start + doorWidth]
    return Array.from({ length: doorWidth }, (_, i) => start + i);
}

/* 
 * The constructor of the Room class is responsible for generating the floor tiles
 * but the generateMap function is adds in entities like walls, food, and enemies.
 */

export const generateMap = (game: Game): Room[] => {
    const rooms: Room[] = [];

    for (let roomY = 0; roomY < game.roomCount.y; roomY++) {
        for (let roomX = 0; roomX < game.roomCount.x; roomX++) {
            const roomPos = new Vec(roomX, roomY);

            // add the room with only the floor tiles
            rooms.push(new Room(game, roomPos));

            // generate doors for each side of the room
            const doors = {
                top: generateDoor(5, game.roomSize.x, 4),
                bottom: generateDoor(5, game.roomSize.x, 4),
                left: generateDoor(3, game.roomSize.y, 3),
                right: generateDoor(3, game.roomSize.y, 3)
            }

            // remove the door that would lead outside the map
            if (roomX === 0) doors.left = [];
            if (roomY === 0) doors.top = [];
            if (roomX === game.roomCount.x - 1) doors.right = [];
            if (roomY === game.roomCount.y - 1) doors.bottom = [];

            // for each tile position in the room
            for (let y = 0; y < game.roomSize.y; y++) {
                for (let x = 0; x < game.roomSize.x; x++) {
                    if ( // if the tile is on the edge
                        x === 0 ||
                        y === 0 ||
                        x === game.roomSize.x - 1 ||
                        y === game.roomSize.y - 1
                    ) {
                        // create an entity with no components
                        const wallEntity = game.ecs.createEntity();

                        // add a position component with the pixel position and room position
                        game.ecs.addComponent(
                            wallEntity,
                            components.PositionComponent,
                            [new Vec(x * game.tileWidth, y * game.tileWidth), roomPos]
                        );

                        // 2nd and third args for ImageComponent (see componentns/image.ts)
                        let frame: [number, number];

                        /*
                         * The following if/else statements select the correct frame 
                         * in the spritesheet for the wall based on it's position.
                         * Unfortunately it's not very readable because it's hardcoded
                         * and there isn't really a better way to do it :(
                         */

                        if (x === 0) {
                            if (y === 0) {
                                frame = [0, 3 * 16];
                            } else if (y === game.roomSize.y - 1) {
                                frame = [2 * 16, 3 * 16];
                            } else if (y === doors.left[0] - 1) {
                                frame = [3 * 16, 2 * 16];
                            } else if (y === doors.left[doors.left.length - 1] + 1) {
                                frame = [16, 2 * 16];
                            } else if (!doors.left.includes(y)) {
                                frame = [3 * 16, 16];
                            }
                        } else if (x === game.roomSize.x - 1) {
                            if (y === 0) {
                                frame = [16, 3 * 16];
                            } else if (y === game.roomSize.y - 1) {
                                frame = [3 * 16, 3 * 16];
                            } else if (y === doors.right[0] - 1) {
                                frame = [2 * 16, 2 * 16];
                            } else if (y === doors.right[doors.right.length - 1] + 1) {
                                frame = [0, 2 * 16];
                            } else if (!doors.right.includes(y)) {
                                frame = [16, 16];
                            }
                        } else if (y === 0) {
                            if (x === doors.top[0] - 1) {
                                frame = [3 * 16, 2 * 16];
                            } else if (x === doors.top[doors.top.length - 1] + 1) {
                                frame = [2 * 16, 2 * 16];
                            } else if (!doors.top.includes(x)) {
                                frame = [0, 16];
                            }
                        } else if (y === game.roomSize.y - 1) {
                            if (x === doors.bottom[0] - 1) {
                                frame = [16, 2 * 16];
                            } else if (x === doors.bottom[doors.bottom.length - 1] + 1) {
                                frame = [0, 2 * 16];
                            } else if (!doors.bottom.includes(x)) {
                                frame = [2 * 16, 16];
                            }
                        }

                        game.ecs.addComponent(
                            wallEntity,
                            components.ImageComponent,
                            [game.images["tiles"], ...(frame ?? [0, 0]), 16, 16]
                        );
                    }
                }
            }
        }
    }

    return rooms;
}