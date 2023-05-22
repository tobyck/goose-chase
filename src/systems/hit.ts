/* 
 * systems/hit.ts
 *
 * Contains HitSystem which handles the hitting of entities with the weapon in
 * the player's right hand. If no weapon is present, items can be picked up,
 * but entities with health will not be damaged.
 */

import * as components from "../components";
import { type Entity, System, SystemTrigger } from "../engine/ecs";
import { cloneAudio, Rect, Vec } from "../helpers";

export class HitSystem extends System {
    constructor() {
        super([
            components.HandsComponent
        ], SystemTrigger.Click, (game, entity) => {
            const handsComponent = game.ecs.getComponent(entity, components.HandsComponent);

            // try to get weapon entity from right hand, otherwise try left hand or null
            const weaponEntity = game.ecs.hasComponent(handsComponent.rightHand, components.WeaponComponent)
                ? handsComponent.rightHand : game.ecs.hasComponent(handsComponent.leftHand, components.WeaponComponent)
                    ? handsComponent.leftHand : null;

            if (weaponEntity) {
                const weaponComponent = game.ecs.getComponent(weaponEntity, components.WeaponComponent);

                weaponComponent.holder = entity; // let the weapon system know what's holding the weapon
                weaponComponent.frameCount = 0; // reset frame count
                weaponComponent.totalFrames = 15; // let the animation go for n frames

                // position component of the entity holding the weapon
                const holderPosition = game.ecs.getComponent(entity, components.PositionComponent);

                const holderCentre = holderPosition.pixels.centred(game.tileSize);

                // 45 degrees above the angle of the mouse
                weaponComponent.startAngle = Math.atan2(
                    game.lastClickPos.y - holderCentre.y,
                    game.lastClickPos.x - holderCentre.x
                );

                // let the weapon swing 1/6th of a circle
                weaponComponent.swingRadians = Math.PI / 3;

                // move the pivot point 1/5th of a tile away from the holder's centre
                weaponComponent.pivotPointOffset = new Vec(
                    Math.cos(weaponComponent.startAngle) * game.tileSize / 5,
                    Math.sin(weaponComponent.startAngle) * game.tileSize / 5
                );
            }

            const entityPosition = game.ecs.getComponent(entity, components.PositionComponent);

            /* 
             * The array of entities stored in the ECS object has them in an
             * order which means that the entities drawn last (or, the ones
             * that are on top) are at the end of the array, so we reverse it
             * to prioritise hitting/picking up entities that on top of others.
             * We also have to call Array.slice() with no arguments to make a
             * copy of the array because Array.reverse() operates in place.
             */
            const entityToHit: Entity = game.currentRoom.entities.slice().reverse().find(otherEntity => {
                if ( // if the other entity is not holdable or doesn't have health, ignore it
                    !game.ecs.hasComponent(otherEntity, components.HoldableComponent) &&
                    !game.ecs.hasComponent(otherEntity, components.HealthComponent)
                ) return false;

                // ignore the entity hitting so that it doesn't hit itself
                if (otherEntity === entity) return false;

                const otherEntityPosition = game.ecs.getComponent(otherEntity, components.PositionComponent);

                // get the distances to the other entity
                const dx = Math.abs(entityPosition.pixels.x - otherEntityPosition.pixels.x);
                const dy = Math.abs(entityPosition.pixels.y - otherEntityPosition.pixels.y);
                const dist = Math.hypot(dx, dy);

                // ignore entities that are too far away for the player to reach (more than 1.5 tiles away)
                if (dist > game.tileSize * 1.8) return false;

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
                    game.ecs.componentManagers.get(components.HitboxComponent)
                        .removeComponent(otherEntity);
                }

                return ret;
            });

            if (entityToHit) { // if there is an entity to hit
                if (game.ecs.hasComponent(entityToHit, components.HoldableComponent)) {
                    if (handsComponent.hasSpace()) { // and there's a free hand
                        // pick it up by storing it in the hands component and store a reference to where it was stored
                        const item = handsComponent.addItem(entityToHit, "left");

                        // move the entity so that it's in of the item box

                        const itemPosComponent = game.ecs.getComponent(item, components.PositionComponent);

                        itemPosComponent.pixels = handsComponent.leftHand === item
                            ? game.leftHandItemPos
                            : game.rightHandItemPos;

                        itemPosComponent.room = game.room;

                        cloneAudio(game.getAudio("pick_up")).play();
                    } else {
                        cloneAudio(game.getAudio("decline")).play();
                    }
                } else { // otherwise it's an entity with health. implement damage here

                }
            }
        });
    }
}