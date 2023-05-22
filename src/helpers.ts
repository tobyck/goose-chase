/* 
 * util.ts
 *
 * This file contains useful miscellaneous functions and 
 * classes used throughout the codebase.
 */

import { HandsComponent, HitboxComponent, PositionComponent } from "./components";
import { Entity } from "./engine/ecs";
import Game from "./main";

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

    // scale a vector from one range to another
    scaled(from: number, to: number): Vec {
        return new Vec(this.x / from * to, this.y / from * to);
    }

    // returns the vector of the center given the width of a tile
    centred(tileSize: number): Vec {
        return new Vec(
            this.x + tileSize / 2,
            this.y + tileSize / 2
        );
    }

    // checks if a vector is inside a rectangle
    isInside(rect: Rect) {
        return this.x >= rect.x && this.x <= rect.x + rect.width &&
            this.y >= rect.y && this.y <= rect.y + rect.height;
    }

    clone(): Vec {
        return new Vec(this.x, this.y);
    }
}

export class Rect {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    overlaps(other: Rect): boolean {
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
    }

    static fromVecs(pos: Vec, size: Vec): Rect {
        return new Rect(pos.x, pos.y, size.x, size.y);
    }
}

// random integer between min and max (inclusive)
export const randInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// checks if a hitbox collides with any other hitboxes in the game's current room
export const anyHitboxesCollide = (game: Game, entity: Entity, room = game.currentRoom): boolean => {
    return room.entities.some(otherEntity => {
        // don't check if the entity collides with itself
        if (otherEntity === entity) return false;

        if (game.ecs.hasComponent(otherEntity, HitboxComponent)) {
            const hitbox = game.ecs.getComponent(entity, HitboxComponent)
                .getActualHitbox(game.ecs.getComponent(entity, PositionComponent));

            const otherHitbox = game.ecs.getComponent(otherEntity, HitboxComponent)
                .getActualHitbox(game.ecs.getComponent(otherEntity, PositionComponent));

            return hitbox.overlaps(otherHitbox);
        }

        // if the entity doesn't have a hitbox, it can't collide with anything
        return false;
    });
};

// place item from hands at pos (centred) if it doesn't collide with anything
// return true if the item was placed, false if it was put back in hands
export const attemptPlace = (game: Game, hands: HandsComponent, pos: Vec): boolean => {
    /* 
     * This if statement makes sure that an item isn't placed if either there's
     * nothing to place, or if placing it could cause it to be within half
     * a tile width of the edge of the room. The reason for this is that the
     * player doesn't move into the next room unless they're at least half way
     * through the door, so if an item is placed too close to the edge, its
     * hitbox could be withing reach of the the player if they're protruding
     * into the next room, but wouldn't taken into account in the collision
     * detection because it's not in the player's room.
     */
    if (
        hands.allEmpty() ||
        pos.x < game.tileSize / 2 ||
        pos.y < game.tileSize / 2 ||
        pos.x > (game.roomSize.x - 1) * game.tileSize - game.tileSize / 2 ||
        pos.y > (game.roomSize.y - 1) * game.tileSize - game.tileSize / 2
    ) return false;

    const [item, hand] = hands.takeItem();

    const itemPosition = game.ecs.getComponent(item, PositionComponent);

    const oldPixelPos = itemPosition.pixels.clone();

    itemPosition.pixels = pos;

    if (
        game.ecs.hasComponent(item, HitboxComponent) &&
        anyHitboxesCollide(game, item)
    ) {
        itemPosition.pixels = oldPixelPos;
        hands.addItem(item, hand);
        return false;
    } else {
        /* 
         * When the item was in a hand the room vector was bound to
         * the game's current room so that it would always be in the
         * same room as the player. Now that it's been placed, we
         * need to set it to a clone of that position so it's always
         * in the room it was just placed in (until picked up again).
         */
        itemPosition.room = itemPosition.room.clone();
        game.ecs.bringToFront(item);
        game.ecs.bringToFront(game.player);
        cloneAudio(game.getAudio("place")).play();
        return true;
    }
};

export const cloneAudio = (audio: HTMLAudioElement): HTMLAudioElement => {
    return audio.cloneNode() as HTMLAudioElement;
}