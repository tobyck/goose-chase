/* 
 * systems/controllable.ts
 *
 * This system is responsible for adjusting the horizontal and vertical speed
 * (stored in the speed component) of controllable entities based on keynoard
 * input, and moving the entity between rooms when it goes through a door. 
 * The system doesn't actually move the entity - that's done by the walking 
 * system in walking.ts.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";

export class ControllableSystem extends System {
    constructor() {
        super([
            components.ControllableComponent,
            components.SpeedComponent,
            components.PositionComponent
        ], SystemTrigger.Tick, (game, entity) => {
            // get components
            const speed = game.ecs.getComponent(entity, components.SpeedComponent);
            const position = game.ecs.getComponent(entity, components.PositionComponent);

            if (game.keys["a"] || game.keys["arrowleft"]) {
                if (game.keys["w"] || game.keys["arrowup"]) {
                    [speed.speedX, speed.speedY] = speed.speedsTo(-1, -1);
                } else if (game.keys["s"] || game.keys["arrowdown"]) {
                    [speed.speedX, speed.speedY] = speed.speedsTo(-1, 1);
                } else {
                    [speed.speedX, speed.speedY] = speed.speedsTo(-1, 0);
                }
            } else if (game.keys["d"] || game.keys["arrowright"]) {
                if (game.keys["w"] || game.keys["arrowup"]) {
                    [speed.speedX, speed.speedY] = speed.speedsTo(1, -1);
                } else if (game.keys["s"] || game.keys["arrowdown"]) {
                    [speed.speedX, speed.speedY] = speed.speedsTo(1, 1);
                } else {
                    [speed.speedX, speed.speedY] = speed.speedsTo(1, 0);
                }
            } else if (game.keys["w"] || game.keys["arrowup"]) {
                [speed.speedX, speed.speedY] = speed.speedsTo(0, -1);
            } else if (game.keys["s"] || game.keys["arrowdown"]) {
                [speed.speedX, speed.speedY] = speed.speedsTo(0, 1);
            } else {
                speed.speedX = 0;
                speed.speedY = 0;
            }

            // make the controllable entities go to the other side of the next room when they go through a door
            if (position.pixels.x < -(game.tileWidth / 2) && position.room.x > 0) {
                position.room.x--;
                position.pixels.x = game.tileWidth * game.roomSize.x - (game.tileWidth / 2);
            } else if (position.pixels.x > game.tileWidth * game.roomSize.x - (game.tileWidth / 2) && position.room.x < game.roomSize.x - 1) {
                position.room.x++;
                position.pixels.x = -(game.tileWidth / 2);
            } else if (position.pixels.y < -(game.tileWidth / 2) && position.room.y > 0) {
                position.room.y--;
                position.pixels.y = game.tileWidth * game.roomSize.y - (game.tileWidth / 2);
            } else if (position.pixels.y > game.tileWidth * game.roomSize.y - (game.tileWidth / 2) && position.room.y < game.roomSize.y - 1) {
                position.room.y++;
                position.pixels.y = -(game.tileWidth / 2);
            }
        });
    }
}