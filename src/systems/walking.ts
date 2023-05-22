/* 
 * systems/controllable.ts
 * 
 * This is the system that animates walking characters using their spritesheet
 * (stored in the image component), and actually moving walking entities by
 * their speed, unless there's an entity with a hitbox in the way. This means
 * that this sytem is also responsible for collision checking.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";
import { anyHitboxesCollide, cloneAudio } from "../helpers";

export class WalkingSystem extends System {
    constructor() {
        super([
            components.WalkingComponent,
            components.SpeedComponent,
            components.ImageComponent
        ], SystemTrigger.Tick, (game, entity) => {
            const speed = game.ecs.getComponent(entity, components.SpeedComponent);
            const image = game.ecs.getComponent(entity, components.ImageComponent);
            const position = game.ecs.getComponent(entity, components.PositionComponent);

            // set the row of spritesheet for direction
            if (speed.speedX === 0 && speed.speedY === 0) { // if not moving
                image.frame.y = 0; // top row of spritesheet
            } else {
                if (speed.speedX < 0) { // if moving left
                    image.frame.y = 2 * 16; // third row of spritesheet
                } else if (speed.speedX > 0) { // if moving right
                    image.frame.y = 3 * 16; // last row of spritesheet
                } else if (speed.speedY < 0) { // if moving up
                    image.frame.y = 16; // second row of spritesheet
                } else if (speed.speedY > 0) { // if moving down
                    image.frame.y = 0; // top row of spritesheet
                }
            }

            position.pixels.x += speed.speedX; // move by x speed
            // if there's a collision, move back
            if (anyHitboxesCollide(game, entity)) {
                position.pixels.x -= speed.speedX;
            }

            // same thing with y speed
            position.pixels.y += speed.speedY;
            if (anyHitboxesCollide(game, entity)) {
                position.pixels.y -= speed.speedY;
            }

            // if moving
            if (speed.speedX !== 0 || speed.speedY !== 0) {
                // change frame every x milliseconds depending on speed (350 is arbitrary)
                const timeBetweenFrames = 1 / speed.currentVelocity * 400;
                if (Date.now() - image.lastFrameChange >= timeBetweenFrames) {
                    image.frame.x += 16; // move right one frame
                    image.frame.x %= 64; // wrap around to the first frame if at the end
                    image.lastFrameChange = Date.now();

                    if (image.frame.x === 16 || image.frame.x === 48) {
                        const clone = cloneAudio(game.getAudio("footstep"));
                        clone.volume *= speed.currentVelocity / speed.velocity;
                        clone.play();
                    }
                }
            } else {
                image.frame.x = 0;
            }

            // if the entity has health
            if (game.ecs.hasComponent(entity, components.HealthComponent)) {
                const health = game.ecs.getComponent(entity, components.HealthComponent);

                // remove health based on speed (1/150th of the velocity per tick)
                health.damage(speed.currentVelocity / 150);

                // heal if resting (1/2000th of the max health per tick)
                if (speed.currentVelocity === 0) {
                    health.heal(health.maxHealth / 2000);
                }
            }

            // move to neighboring room if walking through door
            if (position.pixels.x < -(game.tileSize / 2) && position.room.x > 0) {
                position.room.x--;
                position.pixels.x = game.tileSize * game.roomSize.x - (game.tileSize / 2);
            } else if (position.pixels.x > game.tileSize * game.roomSize.x - (game.tileSize / 2) && position.room.x < game.roomSize.x - 1) {
                position.room.x++;
                position.pixels.x = -(game.tileSize / 2);
            } else if (position.pixels.y < -(game.tileSize / 2) && position.room.y > 0) {
                position.room.y--;
                position.pixels.y = game.tileSize * game.roomSize.y - (game.tileSize / 2);
            } else if (position.pixels.y > game.tileSize * game.roomSize.y - (game.tileSize / 2) && position.room.y < game.roomSize.y - 1) {
                position.room.y++;
                position.pixels.y = -(game.tileSize / 2);
            }
        });
    }
}