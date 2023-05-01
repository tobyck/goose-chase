/* 
 * engine/mapgen.ts
 *
 * This file is responsible for generating the map. The Room object comes with
 * the floor tiles, but the generateMap adds walls and other entities like food.
 */

import * as components from "../components/components";
import Game from "../main";
import { RenderSystem } from "../systems/render";
import { Vec } from "../util";
import { Room } from "./room";

export const generateMap = (game: Game): Room[] => {
    const rooms: Room[] = [];

    for (let y = 0; y < game.roomCount.y; y++) {
        for (let x = 0; x < game.roomCount.x; x++) {
            rooms.push(new Room(game, new Vec(x, y)));
        }
    }

    /* TEST */

    const wallEntity = game.ecs.createEntity();

    game.ecs.addComponent(
        wallEntity,
        components.PositionComponent,
        [new Vec(0, 0), new Vec(0, 0)]
    )

    game.ecs.addComponent(
        wallEntity,
        components.ImageComponent,
        [
            game.images["tiles"],
            0, 3 * 16,
            16, 16
        ]
    );

    game.ecs.systemManager.addSystem(new RenderSystem());

    /* END TEST */

    return rooms;
}