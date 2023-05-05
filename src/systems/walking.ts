/* 
 * systems/controllable.ts
 * 
 * This is the system that animates walking characters using their spritesheet
 * (stored in the image component), and actually moving walking entities by
 * their speed, unless there's an entity with a hitbox in the way. This means
 * that this sytem is also responsible for collision checking.
 */

import * as components from "../components";
import { type Entity, System, SystemTrigger } from "../engine/ecs";
import type Game from "../main";

const checkForCollision = (game: Game, entity: Entity) => {
    // get entities that aren't the entity which is moving
    const entities = game.ecs.entitiesWithComponents(
        game.currentRoom,
        [components.HitboxComponent, components.PositionComponent]
    ).filter(otherEntity => {
        return otherEntity !== entity;
    });

    for (const otherEntity of entities) {
        // hitbox of the walking entity
        const walkingHitbox = game.ecs
            .getComponent(entity, components.HitboxComponent)
            .getActualHitbox(game.ecs.getComponent(entity, components.PositionComponent));

        // hitbox of the other one
        const otherHitbox = game.ecs
            .getComponent(otherEntity, components.HitboxComponent)
            .getActualHitbox(game.ecs.getComponent(otherEntity, components.PositionComponent));

        if ( // if the two collide
            walkingHitbox.position.x <= otherHitbox.position.x + otherHitbox.size.x &&
            walkingHitbox.position.x + walkingHitbox.size.x >= otherHitbox.position.x &&
            walkingHitbox.position.y <= otherHitbox.position.y + otherHitbox.size.y &&
            walkingHitbox.position.y + walkingHitbox.size.y >= otherHitbox.position.y
        ) return true;
    }
}

export class WalkingSystem extends System {
    constructor() {
        super(
            [
                components.WalkingComponent,
                components.SpeedComponent,
                components.ImageComponent
            ],
            SystemTrigger.Tick,
            (game, entity) => {
                const speed = game.ecs.getComponent(entity, components.SpeedComponent);
                const image = game.ecs.getComponent(entity, components.ImageComponent);
                const position = game.ecs.getComponent(entity, components.PositionComponent);

                // set the row of spritesheet for direction
                if (speed.speedX === 0 && speed.speedY === 0) { // if not moving
                    image.sy = 0; // top row of spritesheet
                } else {
                    if (speed.speedX < 0) { // if moving left
                        image.sy = 2 * 16; // third row of spritesheet
                    } else if (speed.speedX > 0) { // if moving right
                        image.sy = 3 * 16; // last row of spritesheet
                    } else if (speed.speedY < 0) { // if moving up
                        image.sy = 16; // second row of spritesheet
                    } else if (speed.speedY > 0) { // if moving down
                        image.sy = 0; // top row of spritesheet
                    }
                }

                position.pixels.x += speed.speedX; // move by x speed
                // move back if collided
                if (checkForCollision(game, entity)) {
                    position.pixels.x -= speed.speedX;
                }

                // same thing with y speed
                position.pixels.y += speed.speedY;
                if (checkForCollision(game, entity)) {
                    position.pixels.y -= speed.speedY;
                }

                // if moving
                if (speed.speedX !== 0 || speed.speedY !== 0) {
                    // change frame every 220ms
                    if (Date.now() - image.lastFrameChange > 220) {
                        image.sx += 16; // move right one frame
                        image.sx %= 64; // wrap around to the first frame if at the end
                        image.lastFrameChange = Date.now();
                    }
                } else {
                    image.sx = 0;
                }
            });
    }
}