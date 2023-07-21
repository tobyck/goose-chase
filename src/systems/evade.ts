/* 
 * systems/evade.ts
 *
 * This system sets the speeds for entities which evade other entities.
 * Like ControllableSystem this does NOT move the entity, it only sets its
 * x and y speeds.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";
import { Vec } from "../helpers";

export default class EvadeSystem extends System {
    constructor() {
        super([
            components.EvaderComponent
        ], SystemTrigger.Tick, (game, entity) => {
            const evader = game.ecs.getComponent(entity, components.EvaderComponent);

            const evaderPosition = game.ecs.getComponent(entity, components.PositionComponent);
            const toEvadePosition = game.ecs.getComponent(evader.entityToEvade, components.PositionComponent);

            const evaderSpeed = game.ecs.getComponent(entity, components.SpeedComponent);

            for (const [door, doorCoords] of Object.entries(game.roomAt(evaderPosition.room).doors)) {
                // ignore doors that don't exist
                if (doorCoords.length === 0) continue;

                // position of the room to go to
                const newRoomVec = evaderPosition.room.shifted({
                    "top": new Vec(0, -1),
                    "bottom": new Vec(0, 1),
                    "left": new Vec(-1, 0),
                    "right": new Vec(1, 0)
                }[door]);

                // if going to the new room would get the evader closer to the entity to evade, ignore it
                if (newRoomVec.distTo(toEvadePosition.room) < evaderPosition.room.distTo(toEvadePosition.room)) {
                    continue;
                }

                // get the centre of the door
                const doorCentre = doorCoords[Math.floor(doorCoords.length / 2)];

                // get the *vector* to the centre of the door
                const targetVec = {
                    "top": new Vec(doorCentre, -1),
                    "bottom": new Vec(doorCentre, game.roomSize.y),
                    "left": new Vec(-1, doorCentre),
                    "right": new Vec(game.roomSize.x, doorCentre)
                }[door].multiplied(game.tileSize);

                // angle in radians to targetVec
                const angleToTarget = evaderPosition.pixels.angleTo(targetVec);

                // how much the evade would move if it went towards the door
                const shift: [number, number] = [
                    Math.cos(angleToTarget) * evaderSpeed.velocity,
                    Math.sin(angleToTarget) * evaderSpeed.velocity
                ];

                // vector containing the new pos after the shift
                // (this doesn't actually move the evader though)
                const newPos = evaderPosition.pixels.shifted(new Vec(...shift));

                // if the evader isn't in the same room as the player or
                // if the evader would get closer to the entity to evade,
                // set the speed to go towards the door
                if (
                    !Vec.equal(evaderPosition.room, game.playerRoomPos) ||
                    newPos.distTo(toEvadePosition.pixels) >= evaderPosition.pixels.distTo(toEvadePosition.pixels)
                ) {
                    [evaderSpeed.speedX, evaderSpeed.speedY] = evaderSpeed.speedsTo(...shift);

                    // we can exit the system now because we've found a door to go to
                    return;
                }
            }

            /* 
             * If the evader was unable to find a door to go to without
             * getting closer to the player, just go directly away from
             * the entity to evade (only if in the same room)
             */

            if (Vec.equal(evaderPosition.room, toEvadePosition.room)) {
                const dx = toEvadePosition.pixels.x - evaderPosition.pixels.x;
                const dy = toEvadePosition.pixels.y - evaderPosition.pixels.y;

                [evaderSpeed.speedX, evaderSpeed.speedY] = evaderSpeed.speedsTo(-dx, -dy);
            }
        });
    }
}