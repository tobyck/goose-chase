/* 
 * engine/particle.ts
 *
 * Contains the class which represents a single particle.
 */

import { Vec } from "../helpers";
import Game from "../game";

export class Particle {
    pos: Vec;
    angle: number;
    speed: number;
    friction: number;
    colour: string;

    constructor(pos: Vec, angle: number, speed: number, friction: number, colour: string) {
        this.pos = pos;
        this.angle = angle;
        this.speed = speed;
        this.friction = friction;
        this.colour = colour;
    }

    static createBurst(game: Game, count: number, delay: number, pos: Vec, speed: number, friction: number, colour: string) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                game.particles.push(new Particle(
                    pos,
                    Math.random() * Math.PI * 2, // random angle
                    speed * (.75 + Math.random() * .5), // 75% to 125% of speed
                    friction,
                    colour
                ));
            }, delay * i);
        }
    }
}