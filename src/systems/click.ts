/*
 * systems/click.ts
 *
 * This file contains the system which handles the click input, uses
 * game.lastClickPos to get the entity to hit, then uses the hit function
 * from hit.ts to hit the entity.
 */

import * as components from "../components";
import { Entity, System, SystemTrigger } from "../engine/ecs";
import { Rect } from "../helpers";
import { hit } from "../hit";

export default class ClickSystem extends System {
    constructor() {
        super([
            components.ControllableComponent,
            components.PositionComponent,
            components.HandsComponent
        ], SystemTrigger.Click, (game, entity) => {
            const entityPosition = game.ecs.getComponent(entity, components.PositionComponent);

            /* 
             * The array of entities stored in the ECS object has them in an
             * order which means that the entities drawn last (or, the ones
             * that are on top) are at the end of the array, so we reverse it
             * to prioritise hitting/picking up entities that on top of others.
             * We also have to call Array.slice() with no arguments to make a
             * copy of the array because Array.reverse() operates in place.
             */
            const entityToHit: Entity = game.roomAt(game.playerRoomPos).entities.slice().reverse().find(otherEntity => {
                if ( // if the other entity is not holdable or doesn't have health, ignore it
                    !game.ecs.hasComponent(otherEntity, components.HoldableComponent) &&
                    !game.ecs.hasComponent(otherEntity, components.HealthComponent)
                ) return false;

                // ignore the entity hitting so that it doesn't hit itself
                if (otherEntity === entity) return false;

                const otherEntityPosition = game.ecs.getComponent(otherEntity, components.PositionComponent);

                // the distance to the other entity
                const dist = entityPosition.pixels.distTo(otherEntityPosition.pixels);

                // ignore entities that are too far away for the player to reach
                if (dist > game.tileSize * game.minHitDist) return false;

                // variable to remember if the entity's hitbox is temporary
                let hasTempHitbox = false;

                // if the entity doesn't have a hitbox, give it a temporary one
                if (!game.ecs.hasComponent(otherEntity, components.HitboxComponent)) {
                    game.ecs.addComponent(otherEntity, components.HitboxComponent, [
                        new Rect(0, 0, game.tileSize, game.tileSize)
                    ]);

                    hasTempHitbox = true;
                }

                // get the other entity's hitbox which is now guaranteed to exist
                const otherEntityHitbox = game.ecs.getComponent(otherEntity, components.HitboxComponent);

                // temporary store the return value of this function so that a temporary hitbox can be removed
                const ret = game.lastClickPos.isInside(otherEntityHitbox.getActualHitbox(otherEntityPosition));

                // if the entity has a temporary hitbox, remove it
                if (hasTempHitbox) {
                    game.ecs.removeComponent(otherEntity, components.HitboxComponent);
                }

                return ret;
            });

            // use hit function
            hit(game, entity, entityToHit ?? null);
        });
    }
}