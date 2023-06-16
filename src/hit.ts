import * as components from "./components";
import { Entity } from "./engine/ecs";
import { Vec, cloneAudio } from "./helpers";
import Game from "./main";

export const hit = (game: Game, hitter: Entity, entityToHit: Entity) => {
    const hands = game.ecs.getComponent(hitter, components.HandsComponent);

    // try to get weapon entity from right hand, otherwise try left hand or null
    const weaponEntity = game.ecs.hasComponent(hands.rightHand, components.WeaponComponent)
        ? hands.rightHand : game.ecs.hasComponent(hands.leftHand, components.WeaponComponent)
            ? hands.leftHand : null;

    if (weaponEntity) {
        const weaponComponent = game.ecs.getComponent(weaponEntity, components.WeaponComponent);

        weaponComponent.holder = hitter; // let the weapon system know what's holding the weapon
        weaponComponent.frameCount = 0; // reset frame count
        weaponComponent.totalFrames = 15; // let the animation go for n frames

        const holderPosition = game.ecs.getComponent(hitter, components.PositionComponent);
        const toHitPosition = game.ecs.getComponent(entityToHit, components.PositionComponent);

        weaponComponent.startAngle = holderPosition.pixels.angleTo(
            toHitPosition?.pixels ||
            game.lastClickPos
        );

        // let the weapon swing 1/6th of a circle
        weaponComponent.swingRadians = Math.PI / 3;

        // move the pivot point 1/5th of a tile away from the holder's centre
        weaponComponent.pivotPointOffset = new Vec(
            Math.cos(weaponComponent.startAngle) * game.tileSize / 5,
            Math.sin(weaponComponent.startAngle) * game.tileSize / 5
        );
    }

    if (entityToHit !== null) {
        if (game.ecs.hasComponent(entityToHit, components.HoldableComponent)) {
            if (hands.hasSpace()) { // and there's a free hand
                // pick it up by storing it in the hands component and store a reference to where it was stored
                const item = hands.addItem(entityToHit, "left");

                // move the entity so that it's in of the item box

                const itemPosComponent = game.ecs.getComponent(item, components.PositionComponent);

                if (hitter === game.player) {
                    itemPosComponent.pixels = hands.leftHand === item
                        ? game.leftHandItemPos
                        : game.rightHandItemPos;
                } else {
                    // TODO: use HiddenComponent instead
                    itemPosComponent.pixels = new Vec(0, 0);
                }

                // bind the item's room pos to the position of the entity that picked it up
                itemPosComponent.room = game.ecs.getComponent(
                    hitter,
                    components.PositionComponent
                ).room;

                cloneAudio(game.getAudio("pick_up")).play();
            } else {
                cloneAudio(game.getAudio("decline")).play();
            }
            // if it's not something to pick up, check that there's a weapon and that the entity has health, then hit it
        } else if (weaponEntity && game.ecs.hasComponent(entityToHit, components.HealthComponent)) {
            const healthComponent = game.ecs.getComponent(entityToHit, components.HealthComponent);
            const damage: number = game.ecs.getComponent(weaponEntity, components.WeaponComponent).damage;
            healthComponent.damage(damage);
        }
    }
}