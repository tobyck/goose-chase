/* 
 * systems/keyup.ts
 *
 * This file contains the system that handles all keybinds that 
 * should only be triggered when a key is released.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";
import { Vec, attemptPlace } from "../helpers";

export class KeyUpSystem extends System {
    constructor() {
        super([
            components.ControllableComponent,
            components.HandsComponent
        ], SystemTrigger.KeyUp, (game, entity) => {
            // use f key to swap items in hands
            if (game.keys["f"]) {
                const hands = game.ecs.getComponent(entity, components.HandsComponent);

                if (hands.leftHand && !hands.rightHand) { // if only one item and it's in left hand
                    // move item inside the hands component (but this won't alter postion)
                    hands.rightHand = hands.leftHand;
                    hands.leftHand = null;

                    // get position component
                    const rightHandPos = game.ecs.getComponent(hands.rightHand, components.PositionComponent);

                    // move the entity to the position for the right hand item
                    rightHandPos.pixels = game.rightHandItemPos;
                } else if (!hands.leftHand && hands.rightHand) { // if only one item and it's in right hand
                    hands.leftHand = hands.rightHand;
                    hands.rightHand = null;

                    const leftHandPos = game.ecs.getComponent(hands.leftHand, components.PositionComponent);

                    leftHandPos.pixels = game.leftHandItemPos;
                } else if (hands.leftHand && hands.rightHand) { // if holding two items
                    const leftHand = hands.leftHand;
                    hands.leftHand = hands.rightHand;
                    hands.rightHand = leftHand;

                    const leftHandPos = game.ecs.getComponent(hands.leftHand, components.PositionComponent);
                    const rightHandPos = game.ecs.getComponent(hands.rightHand, components.PositionComponent);

                    leftHandPos.pixels = game.leftHandItemPos;
                    rightHandPos.pixels = game.rightHandItemPos;
                }
            }

            // use the q key to drop the item in the left hand
            if (game.keys["q"]) {
                const hands = game.ecs.getComponent(entity, components.HandsComponent);

                if (!hands.allEmpty()) {
                    // position of the entity being controlled (the player)
                    const thisPos = game.ecs.getComponent(entity, components.PositionComponent);

                    /* 
                     * The 0, 1, and -1 values represent how many tiles from the
                     * player the item's new position should be. In the the
                     * order they're in, it will prioritise dropping on the left
                     * side (it will try directly left, then up and left, then
                     * down and left), then the same thing on the right side, 
                     * and if neither of those work, it will try directly above
                     * and below the player.
                     */
                    for (const y of [0, 1, -1]) {
                        for (const x of [-1, 1, 0]) {
                            const dropped: boolean = attemptPlace(
                                game, hands, new Vec(
                                    thisPos.pixels.x + game.tileSize * x,
                                    thisPos.pixels.y + game.tileSize * y
                                )
                            );

                            // if the item was dropped, stop trying to drop it elsewhere
                            if (dropped) return;
                        }
                    }
                }
            }
        });
    }
}