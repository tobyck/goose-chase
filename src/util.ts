/* 
 * util.ts
 *
 * This file contains useful miscellaneous functions and 
 * classes used throughout the codebase.
 */

export class Vec {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static equal(a: Vec, b: Vec): boolean {
        return a.x === b.x && a.y === b.y;
    }

    shifted(vec: Vec): Vec {
        return new Vec(this.x + vec.x, this.y + vec.y);
    }

    scaled(from: number, to: number): Vec {
        return new Vec(this.x / from * to, this.y / from * to);
    }

    clone(): Vec {
        return new Vec(this.x, this.y);
    }
}