/* 
 * systems/particles.ts
 *
 * Renders and moves particles each tick.
 */

import { System, SystemTrigger } from "../engine/ecs";
import { Vec } from "../helpers";

export default class ParticleSystem extends System {
    constructor() {
        super([], SystemTrigger.Tick, game => {
            for (const [index, particle] of game.particles.entries()) {
                // move particle
                particle.pos = particle.pos.shifted(new Vec(
                    particle.speed * Math.cos(particle.angle) * game.tileSize / game.currentFrameRate,
                    particle.speed * Math.sin(particle.angle) * game.tileSize / game.currentFrameRate
                ));

                // apply friction
                particle.speed *= particle.friction;

                /* 
                 * If the particle has effectively stopped, remove it. 0.005 is 
                 * an arbitrary value for when a particle is considered to have 
                 * stopped. If we used 0 instead, the particles would never be 
                 * removed from the game because their speeds will get very
                 * close to 0 but never actually reach it.
                 */

                if (particle.speed < 0.005) {
                    game.particles.splice(index, 1);
                }

                // render particle

                game.ctx.fillStyle = particle.colour;

                game.ctx.fillRect(
                    particle.pos.x,
                    particle.pos.y,
                    game.tileSize / 10, // a tenth of the tile size wide and high
                    game.tileSize / 10
                );
            }
        });
    }
}