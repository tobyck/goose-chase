import { System, SystemTrigger } from "../engine/ecs";
import { Vec } from "../helpers";

export default class ParticleSystem extends System {
    constructor() {
        super([], SystemTrigger.Tick, game => {
            for (const [index, particle] of game.particles.entries()) {
                // move particle

                particle.pos = particle.pos.shifted(new Vec(
                    particle.speed * Math.cos(particle.angle),
                    particle.speed * Math.sin(particle.angle)
                ));

                particle.speed *= particle.friction;

                // if the particle has effectively stopped, remove it
                if (particle.speed < 0.004) {
                    game.particles.splice(index, 1);
                }

                // render particle

                game.ctx.fillStyle = particle.colour;

                game.ctx.fillRect(
                    particle.pos.x,
                    particle.pos.y,
                    5, 5 // 5x5 pixels
                );
            }
        });
    }
}