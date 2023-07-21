/* 
 * follow.ts
 * 
 * This system sets speeds for entities which follow other entities.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";
import { drawLine, Vec } from "../helpers";

export default class Followsystem extends System {
    constructor() {
        super([
            components.FollowComponent,
            components.PositionComponent
        ], SystemTrigger.Tick, (game, entity) => {
            const followComponent = game.ecs.getComponent(entity, components.FollowComponent);

            // position of the entity with the follow component
            const position = game.ecs.getComponent(entity, components.PositionComponent);

            // position of the entity being followed
            const targetPosition = game.ecs.getComponent(followComponent.target, components.PositionComponent);

            // distance in pixels to the target
            const dist = targetPosition.pixels.distTo(position.pixels);

            // how close (in pixels) the entity needs to start following the target
            let maxDistance = followComponent.maxTiles * game.tileSize;

            // if following the player
            if (followComponent.target === game.player) {
                const sneaking = game.ecs.getComponent(
                    game.player,
                    components.ControllableComponent
                ).sneaking;

                // halve the max distance if the player is sneaking
                if (sneaking) maxDistance /= 2;
            }

            // speed component of the entity with the follow component
            const speed = game.ecs.getComponent(entity, components.SpeedComponent);

            if (dist < maxDistance) { // if the target is close enough, move towards it
                // distances to the target
                const dx = targetPosition.pixels.x - position.pixels.x;
                const dy = targetPosition.pixels.y - position.pixels.y;

                // set speeds based on those distances
                [speed.speedX, speed.speedY] = speed.speedsTo(dx, dy);
            } else { // otherwise, walk around randomly
                // set speeds based on the random walk angle and velocity
                speed.speedX = Math.cos(followComponent.randomWalkAngle) * speed.velocity;
                speed.speedY = Math.sin(followComponent.randomWalkAngle) * speed.velocity;

                // if enough time has passed since last change of direction, change direction again
                if (
                    performance.now() - followComponent.timeOfLastAngleChange > components.FollowComponent.angleChangeInterval &&
                    Math.random() < .1 // adds a bit of randomness to the timing
                ) {
                    // rotate by 0-x degrees
                    followComponent.randomWalkAngle += Math.PI / 4 + Math.random() * Math.PI / 4 * (Math.random() < .5 ? 1 : -1);
                    // make sure it's between -pi and pi
                    followComponent.randomWalkAngle %= Math.PI * 2;
                    followComponent.timeOfLastAngleChange = performance.now();
                }
            }

            // when holding H draw a line to target or if walking randomly, off into the distance

            if (game.keys["h"]) {
                if (dist < maxDistance) { // if following the target
                    drawLine(
                        game.ctx,
                        "red",
                        position.pixels,
                        targetPosition.pixels,
                        game.tileSize / 2
                    );
                } else {
                    drawLine(
                        game.ctx,
                        "red",
                        position.pixels,
                        position.pixels.shifted(new Vec(
                            Math.cos(followComponent.randomWalkAngle) * game.canvas.width * 2,
                            Math.sin(followComponent.randomWalkAngle) * game.canvas.width * 2
                        )),
                        game.tileSize / 2
                    );
                }
            }
        });
    }
}