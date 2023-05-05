/* 
 * components.ts
 *
 * Stores all components in the game.
 */

import { Component } from "./engine/ecs";
import { Vec } from "./util";

export class PositionComponent extends Component {
    pixels: Vec;
    room: Vec;

    constructor(pixels: Vec, room: Vec) {
        super();
        this.pixels = pixels;
        this.room = room;
    }
}

export class ImageComponent extends Component {
    image: CanvasImageSource;
    sx: number; // source x
    sy: number; // source y
    sw: number; // source width
    sh: number; // source height
    lastFrameChange = Date.now();

    constructor(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number) {
        super();
        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
    }
}

export class SpeedComponent extends Component {
    readonly velocity: number; // stored the velocity in any direction

    // speeds on the x and y axes which are calculated using the fixed velocity
    speedX: number;
    speedY: number;

    constructor(velocity: number) {
        super();
        this.velocity = velocity;
    }

    speedsTo(dx: number, dy: number): [number, number] {
        const hypot = Math.hypot(dx, dy);
        return [dx / hypot * this.velocity, dy / hypot * this.velocity];
    }
}

// doesn't need data, just flags
export class ControllableComponent extends Component { }
export class WalkingComponent extends Component { }

export class HitboxComponent extends Component {
    position: Vec; // relative to the entity's position
    size: Vec;

    constructor(position: Vec, size: Vec) {
        super();
        this.position = position;
        this.size = size;
    }

    getActualHitbox(entityPos: PositionComponent): HitboxComponent {
        return new HitboxComponent(
            this.position.shifted(entityPos.pixels),
            this.size
        );
    }
}