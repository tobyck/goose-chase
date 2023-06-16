import { Vec } from "../helpers";
import Game from "../main";

export class Particle {
    pos: Vec;
    angle: number;
    speed: number;
    friction: number;
    color: string;

    constructor(pos: Vec, angle: number, speed: number, friction: number, color: string) {
        this.pos = pos;
        this.angle = angle;
        this.speed = speed;
        this.friction = friction;
        this.color = color;
    }

    static createBurst(game: Game, count: number, delay: number, pos: Vec, speed: number, friction: number, color: string) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                game.particles.push(new Particle(
                    pos,
                    Math.random() * Math.PI * 2, // random angle
                    speed * (.75 + Math.random() * .5), // 75% to 125% of speed
                    friction,
                    color
                ));
            }, delay * i);
        }
    }
}