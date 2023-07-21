/* 
 * systems/hunt.ts
 *
 * This system handles entities which hunt other entities, and hits their 
 * targets when they are close enough.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";
import { randInt } from "../helpers";
import { hit } from "../hit";

export default class HuntSystem extends System {
    constructor() {
        super([
            components.HunterComponent,
            components.PositionComponent
        ], SystemTrigger.Tick, (game, entity) => {
            const hunterComponent = game.ecs.getComponent(entity, components.HunterComponent);

            // make sure the entity has a target
            if (hunterComponent.target === null) return;

            const hunterPos = game.ecs.getComponent(entity, components.PositionComponent);
            const targetPos = game.ecs.getComponent(hunterComponent.target, components.PositionComponent);

            // distance to target
            const distToTarget = hunterPos.pixels.distTo(targetPos.pixels);

            if ( // if the target is close enough and enough time has passed since the last hit
                distToTarget < game.tileSize * hunterComponent.maxHitDist &&
                performance.now() - hunterComponent.timeOfLastHit > hunterComponent.timeUntilNextHit
            ) {
                // set the time of the last hit to now
                hunterComponent.timeOfLastHit = performance.now();

                // set a new random time until the next hit
                hunterComponent.timeUntilNextHit = randInt(...hunterComponent.timeBetweenHitsRange);

                // hit the target
                hit(game, entity, hunterComponent.target);
            }
        });
    }
}