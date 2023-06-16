import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";

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

            // how close (in pixels) the needs to be foll
            let maxDistance = followComponent.maxTiles * game.tileSize;

            // if following the player
            if (followComponent.target === game.player) {
                const sneaking = game.ecs.getComponent(
                    game.player,
                    components.ControllableComponent
                ).sneaking;

                // half the max distance if the player is sneaking
                if (sneaking) maxDistance /= 2;
            }

            const speed = game.ecs.getComponent(entity, components.SpeedComponent);

            if (dist < maxDistance) { // if the target is close enough, move towards it
                const dx = targetPosition.pixels.x - position.pixels.x;
                const dy = targetPosition.pixels.y - position.pixels.y;

                [speed.speedX, speed.speedY] = speed.speedsTo(dx, dy);
            } else { // otherwise, walk around randomly
                speed.speedX = Math.cos(followComponent.randomWalkAngle) * speed.velocity;
                speed.speedY = Math.sin(followComponent.randomWalkAngle) * speed.velocity;

                if (
                    performance.now() - followComponent.timeOflastAngleChange > 3000 &&
                    Math.random() < .1
                ) {
                    // rotate by 0-x degrees
                    followComponent.randomWalkAngle += Math.PI / 4 + Math.random() * Math.PI / 4 * (Math.random() < .5 ? 1 : -1);
                    // make sure it's between -pi and pi
                    followComponent.randomWalkAngle %= Math.PI * 2;
                    followComponent.timeOflastAngleChange = performance.now();
                }
            }

            // draw a line to target or if walking randomly, off into the distance

            if (game.keys["h"]) {
                game.ctx.beginPath();

                game.ctx.moveTo(
                    position.pixels.x + game.tileSize / 2,
                    position.pixels.y + game.tileSize / 2
                );

                if (dist < maxDistance) { // if following the target
                    game.ctx.lineTo(
                        targetPosition.pixels.x + game.tileSize / 2,
                        targetPosition.pixels.y + game.tileSize / 2
                    );
                } else {
                    game.ctx.lineTo(
                        position.pixels.x + Math.cos(followComponent.randomWalkAngle) * game.canvas.width,
                        position.pixels.y + Math.sin(followComponent.randomWalkAngle) * game.canvas.width
                    );
                }

                game.ctx.fillStyle = "red";
                game.ctx.stroke();
            }
        });
    }
}