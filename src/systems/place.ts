/* 
 * systems/place.ts
 *
 * This system is responsible for placing items from the player's hands.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";
import { attemptPlace, Vec } from "../helpers";

export default class PlaceSystem extends System {
    constructor() {
        super([
            components.HandsComponent,
            components.PositionComponent,
            components.ControllableComponent
        ], SystemTrigger.RightClick, (game, entity) => {
            const position = game.ecs.getComponent(entity, components.PositionComponent);

            // get the distance between the entity and the mouse
            const dx = game.lastClickPos.x - position.pixels.x;
            const dy = game.lastClickPos.y - position.pixels.y;
            const dist = Math.hypot(dx, dy);

            // if the mouse is more than 5 tiles away, don't do anything
            if (dist > game.tileSize * 5) return;

            const hands = game.ecs.getComponent(entity, components.HandsComponent);

            attemptPlace(game, hands, game.lastClickPos.shifted(new Vec(
                -game.tileSize / 2,
                -game.tileSize / 2
            )));
        });
    }
}