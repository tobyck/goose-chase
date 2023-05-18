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
        ], SystemTrigger.Keyboard, (game, entity) => {
            // get components
            const speed = game.ecs.getComponent(entity, components.SpeedComponent);

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

            // use shift key to sneak

            // at the moment this does nothing, but once enemies are 
            // added it will make it harder for them to find you

            if (game.keys["shift"]) {
                // halve the speed
                speed.speedX /= 2;
                speed.speedY /= 2;

                // let the ControllableComponent know that the entity is sneaking
                const ControllableComponent = game.ecs.getComponent(entity, components.ControllableComponent);
                ControllableComponent.sneaking = true;
            }
        });
    }
}