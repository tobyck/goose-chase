/* 
 * systems/hit.ts
 *
 * Contains HitSystem which handles the hitting of entities with the weapon in
 * the player's right hand. If no weapon is present, items can be picked up,
 * but entities with health will not be damaged.
 */

import * as components from "../components";
import { type Entity, System, SystemTrigger } from "../engine/ecs";
import { Rect, Vec } from "../helpers";

export class HitSystem extends System {
    constructor() {
        super([
            components.HandsComponent
        ], SystemTrigger.Click, (game, entity) => {
            const handsComponent = game.ecs.getComponent(entity, components.HandsComponent);

            // vector of the tile that was clicked (out of # of tiles, not in pixels)
            const hitTileVec = new Vec(
                Math.floor(game.lastClickPos.x / game.tileSize),
                Math.floor(game.lastClickPos.y / game.tileSize)
            );

            const entityPosition = game.ecs.getComponent(entity, components.PositionComponent);

            // make a temporary hitbox the the size of a tile at the position of the clicked tile
            const tileHitbox = new components.HitboxComponent(Rect.fromVecs(
                new Vec(hitTileVec.x * game.tileSize, hitTileVec.y * game.tileSize),
                new Vec(game.tileSize, game.tileSize)
            )).getActualHitbox(new components.PositionComponent(hitTileVec, game.room));

            // get a list of entities whose hitboxes are touching the clicked tile
            const entitiesToHit: Entity[] = game.currentRoom.entities.filter(otherEntity => {
                if ( // if the other entity is not holdable or doesn't have health, ignore it
                    !game.ecs.hasComponent(otherEntity, components.HoldableComponent) &&
                    !game.ecs.hasComponent(otherEntity, components.HealthComponent)
                ) return false;

                const otherEntityPosition = game.ecs.getComponent(otherEntity, components.PositionComponent);

                // get the distances to the other entity
                const dx = Math.abs(entityPosition.pixels.x - otherEntityPosition.pixels.x);
                const dy = Math.abs(entityPosition.pixels.y - otherEntityPosition.pixels.y);

                // ignore entities that are too far away for the player to reach
                if (dx > game.tileSize * 1.4 || dy > game.tileSize * 1.4) return false;

                let hasTempHitbox = false;

                if (!game.ecs.hasComponent(otherEntity, components.HitboxComponent)) {
                    // if the entity doesn't have a hitbox, give it a temporary one
                    game.ecs.addComponent(otherEntity, components.HitboxComponent, [
                        new Rect(0, 0, game.tileSize, game.tileSize)
                    ]);

                    hasTempHitbox = true;
                }

                // get the hitbox of the entity we're checking
                const entityHitbox = game.ecs.getComponent(entity, components.HitboxComponent)
                    .getActualHitbox(otherEntityPosition);

                // if the entity has a temporary hitbox, remove it
                if (hasTempHitbox) {
                    game.ecs.componentManagers.get(components.HitboxComponent)
                        .removeComponent(otherEntity);
                }

                return entityHitbox.overlaps(tileHitbox);
            });

            for (const entityToHit of entitiesToHit) {
                if ( // if the entity to hit can be picked up
                    game.ecs.hasComponent(entityToHit, components.HoldableComponent) &&
                    handsComponent.hasSpace()
                ) {
                    // pick it up by storing it in the hands component and store a reference to where it was stored
                    const item = handsComponent.addItem(entityToHit, "left");

                    // move the entity so that it's in of the item box

                    const itemPosComponent = game.ecs.getComponent(item, components.PositionComponent);

                    itemPosComponent.pixels = handsComponent.leftHand === item
                        ? game.leftHandItemPos
                        : game.rightHandItemPos;

                    itemPosComponent.room = game.room;

                } else { // otherwise, it has health. will implement when there are things with the helath copmonent

                }
            }
        });
    }
}