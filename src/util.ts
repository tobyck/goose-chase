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
}