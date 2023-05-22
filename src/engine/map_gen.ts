/* 
 * engine/mapgen.ts
 *
 * This file is responsible for generating the map (a flat array of rooms),
 * adding wall entities, and leaving gaps for doors into adjacent rooms
 * which also line up with the doors in the adjacent rooms.
 */

import * as components from "../components";
import type Game from "../main";
import { randInt, Rect, Vec } from "../helpers";
import { Room } from "./room";

/* 
 * Given the minimum distance from the side of the room, and the width of the door
 * return an array of numbers representing where the door is. For #####...## 
 * (where # is a wall and . is a floor tile i.e. the door leading into another room)
 * the array would be [5, 6, 7], sideWidth would be 10, and doorWidth would be 3.
 */

const generateDoor = (minDistFromSide: number, sideWidth: number, doorWidth: number): number[] => {
    // first tile of the door
    const start = randInt(minDistFromSide, sideWidth - minDistFromSide - doorWidth);

    // return the range [start, start + doorWidth]
    return Array(doorWidth).fill(null).map((_, i) => start + i);
};

/* 
 * The constructor of the Room class is responsible for generating the floor tiles
 * but the generateMap function is adds in entities like walls, food, and enemies.
 */

export const generateMap = (game: Game): Room[] => {
    const rooms: Room[] = [];

    for (let roomY = 0; roomY < game.roomCount.y; roomY++) {
        for (let roomX = 0; roomX < game.roomCount.x; roomX++) {
            const roomPos = new Vec(roomX, roomY);
            const room = new Room(game, roomPos);

            // generate doors for each side of the room
            room.doors = {
                top: generateDoor(5, game.roomSize.x, 4),
                bottom: generateDoor(5, game.roomSize.x, 4),
                left: generateDoor(3, game.roomSize.y, 3),
                right: generateDoor(3, game.roomSize.y, 3)
            };

            // remove doors that would lead outside the map
            if (roomX === 0) room.doors.left = []; // if the room is on the left edge of the map, remove the left door
            if (roomY === 0) room.doors.top = []; // if the room is on the top edge, remove the top door
            if (roomX === game.roomCount.x - 1) room.doors.right = []; // and so on...
            if (roomY === game.roomCount.y - 1) room.doors.bottom = [];

            // function to get the room at a given vector from the local rooms array
            const roomAtVec = (vec: Vec) => rooms.find(room => Vec.equal(room.pos, vec));

            // takes a door from another room if there it's there
            const takeDoorFrom = (
                from: Vec, // vector of the room to take a door from
                to: Room,
                door: "top" | "bottom" | "left" | "right" // which door to take
            ): void => {
                if (!roomAtVec(from)) return; // if there's no room there, return

                to.doors[door] = roomAtVec(from).doors[
                    // get the opposite door
                    {
                        top: "bottom",
                        bottom: "top",
                        left: "right",
                        right: "left"
                    }[door]
                ];
            };

            // remove doors if there's a room on the other side
            takeDoorFrom(roomPos.shifted(new Vec(0, -1)), room, "top");
            takeDoorFrom(roomPos.shifted(new Vec(0, 1)), room, "bottom");
            takeDoorFrom(roomPos.shifted(new Vec(-1, 0)), room, "left");
            takeDoorFrom(roomPos.shifted(new Vec(1, 0)), room, "right");

            rooms.push(room);

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
                            [new Vec(x * game.tileSize, y * game.tileSize), roomPos]
                        );

                        // 2nd and third args for ImageComponent (see componentns/image.ts)
                        let frame: [number, number];

                        // args for HitboxComponent (x, y, width, height)
                        let hitbox: [Vec, Vec] = [new Vec(0, 0), new Vec(16, 16)]; // pixels on the spritesheet

                        /*
                         * The following if/else statements select the correct frame 
                         * in the spritesheet for the wall based on it's position.
                         * Unfortunately it's not very readable because it's hardcoded
                         * and there isn't really a better way to do it :(
                         */

                        if (x === 0) {
                            if (y === 0) { // top left corner
                                frame = [0, 3 * 16];
                            } else if (y === game.roomSize.y - 1) { // bottom left corner
                                frame = [2 * 16, 3 * 16];
                            } else if (y === room.doors.left[0] - 1) { // top of the left door
                                frame = [3 * 16, 2 * 16];
                                hitbox = [new Vec(0, 0), new Vec(14, 14)];
                            } else if (y === room.doors.left[room.doors.left.length - 1] + 1) { // bottom of the left door
                                frame = [16, 2 * 16];
                                hitbox = [new Vec(0, 2), new Vec(14, 14)];
                            } else if (!room.doors.left.includes(y)) { // straight part left wall
                                frame = [3 * 16, 16];
                                hitbox = [new Vec(0, 0), new Vec(14, 16)];
                            } else {
                                // don't add a wall if there's a door
                                game.ecs.removeEntity(wallEntity);
                            }
                        } else if (x === game.roomSize.x - 1) {
                            if (y === 0) { // top right corner
                                frame = [16, 3 * 16];
                            } else if (y === game.roomSize.y - 1) { // bottom right corner
                                frame = [3 * 16, 3 * 16];
                            } else if (y === room.doors.right[0] - 1) { // top of the right door
                                frame = [2 * 16, 2 * 16];
                                hitbox = [new Vec(2, 0), new Vec(14, 14)];
                            } else if (y === room.doors.right[room.doors.right.length - 1] + 1) { // bottom of the right door
                                frame = [0, 2 * 16];
                                hitbox = [new Vec(2, 2), new Vec(14, 14)];
                            } else if (!room.doors.right.includes(y)) { // straight part right wall
                                frame = [16, 16];
                                hitbox = [new Vec(2, 0), new Vec(14, 16)];
                            } else {
                                game.ecs.removeEntity(wallEntity);
                            }
                        } else if (y === 0) {
                            if (x === room.doors.top[0] - 1) { // left side of the top door
                                frame = [3 * 16, 2 * 16];
                                hitbox = [new Vec(0, 0), new Vec(14, 14)];
                            } else if (x === room.doors.top[room.doors.top.length - 1] + 1) { // right side of the top door
                                frame = [2 * 16, 2 * 16];
                                hitbox = [new Vec(2, 0), new Vec(14, 14)];
                            } else if (!room.doors.top.includes(x)) { // straight part top wall
                                frame = [0, 16];
                                hitbox = [new Vec(0, 0), new Vec(16, 14)];
                            } else {
                                game.ecs.removeEntity(wallEntity);
                            }
                        } else if (y === game.roomSize.y - 1) {
                            if (x === room.doors.bottom[0] - 1) { // left side of the bottom door
                                frame = [16, 2 * 16];
                                hitbox = [new Vec(0, 2), new Vec(14, 14)];
                            } else if (x === room.doors.bottom[room.doors.bottom.length - 1] + 1) { // right side of the bottom door
                                frame = [0, 2 * 16];
                                hitbox = [new Vec(2, 2), new Vec(14, 14)];
                            } else if (!room.doors.bottom.includes(x)) { // straight part bottom wall
                                frame = [2 * 16, 16];
                                hitbox = [new Vec(0, 2), new Vec(16, 14)];
                            } else {
                                game.ecs.removeEntity(wallEntity);
                            }
                        }

                        game.ecs.addComponent(
                            wallEntity,
                            components.ImageComponent,
                            [
                                game.getImage("tiles"),
                                new Rect(...(frame ?? [0, 0]), 16, 16)
                            ]
                        );

                        game.ecs.addComponent(
                            wallEntity,
                            components.HitboxComponent,
                            [Rect.fromVecs(...hitbox.map(
                                vec => vec.scaled(16, game.tileSize)
                            ) as [Vec, Vec])]
                        );
                    }
                }
            }
        }
    }

    return rooms;
};