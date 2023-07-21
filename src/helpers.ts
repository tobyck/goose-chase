/* 
 * helpers.ts
 *
 * This file contains useful miscellaneous functions and 
 * classes used throughout the codebase.
 */

import * as components from "./components";
import { ECS, Entity } from "./engine/ecs";
import { Room } from "./engine/room";
import Game from "./game";

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

    multiplied(n: number): Vec {
        return new Vec(this.x * n, this.y * n);
    }

    angleTo(vec: Vec): number {
        return Math.atan2(vec.y - this.y, vec.x - this.x);
    }

    distTo(vec: Vec): number {
        const dx = vec.x - this.x;
        const dy = vec.y - this.y;
        return Math.hypot(dx, dy);
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

/**
 * @param game The game object
 * @param entity The entity to check for collisions
 * @param room The room to check for collisions in (defaults to the player's current room)
 * @returns Whether or not the entity's hitbox collides with any other hitboxes in the room
 */

export const anyHitboxesCollide = (game: Game, entity: Entity, room = game.roomAt(game.playerRoomPos)): boolean => {
    const position = game.ecs.getComponent(entity, components.PositionComponent);

    if (game.ecs.hasComponent(entity, components.HitboxComponent)) {
        return room.entities.some(otherEntity => {
            // don't check if the entity collides with itself
            if (otherEntity === entity) return false;

            if (game.ecs.hasComponent(otherEntity, components.HitboxComponent)) {
                const otherHitbox = game.ecs.getComponent(otherEntity, components.HitboxComponent)
                    .getActualHitbox(game.ecs.getComponent(otherEntity, components.PositionComponent));

                const hitbox = game.ecs.getComponent(entity, components.HitboxComponent)
                    .getActualHitbox(position);

                return hitbox.overlaps(otherHitbox);
            }

            // if the entity doesn't have a hitbox, it can't collide with anything
            return false;
        });
    } else {
        const lhHitbox = game.ecs.getComponent(game.leftHandItemBox, components.HitboxComponent)
            .getActualHitbox(game.ecs.getComponent(game.leftHandItemBox, components.PositionComponent));

        const rhHitbox = game.ecs.getComponent(game.rightHandItemBox, components.HitboxComponent)
            .getActualHitbox(game.ecs.getComponent(game.rightHandItemBox, components.PositionComponent));

        // add a temporary hitbox
        game.ecs.addComponent(entity, components.HitboxComponent, [new Rect(0, 0, game.tileSize, game.tileSize)]);

        const hitbox = game.ecs.getComponent(entity, components.HitboxComponent)
            .getActualHitbox(position);

        let ret: boolean;

        if (lhHitbox.overlaps(hitbox) || rhHitbox.overlaps(hitbox)) ret = true;
        else ret = false;

        // remove temporary hitbox
        game.ecs.removeComponent(entity, components.HitboxComponent);

        return ret;
    }
};

/**
 * Place item from hands at `pos` if it doesn't collide with anything
 * @param game The game object
 * @param hands The hands component of the player
 * @param pos The position to place the item at (centred)
 * @returns True if the item was placed, false if it was put back in hands
 */

export const attemptPlace = (game: Game, hands: components.HandsComponent, pos: Vec): boolean => {
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
    if (hands.allEmpty()) return false;

    const [item, hand] = hands.takeItem();

    const itemPosition = game.ecs.getComponent(item, components.PositionComponent);

    const oldPixelPos = itemPosition.pixels.clone();

    itemPosition.pixels = pos;

    if (anyHitboxesCollide(game, item)) {
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

        // make sure the item is placed on top of everything else
        game.ecs.bringToFront(item);

        // (except walking entities)
        game.ecs.entitiesWithComponents(game.roomAt(game.playerRoomPos), [components.WalkingComponent])
            .forEach(game.ecs.bringToFront, game.ecs);

        if (game.shouldPlaySFX) cloneAudio(game.getAudio("place")).play();

        return true;
    }
};

// creates a clone of an audio element
// this is used so that the same audio can be overlapped
export const cloneAudio = (audio: HTMLAudioElement): HTMLAudioElement => {
    return audio.cloneNode() as HTMLAudioElement;
};

/**
 * Move an entity on each axis if it doesn't collide with anything
 * @param game The game object
 * @param entity The entity to try to move
 */

export const tryMove = (game: Game, room: Room, entity: Entity): void => {
    const position = game.ecs.getComponent(entity, components.PositionComponent);
    const speed = game.ecs.getComponent(entity, components.SpeedComponent);

    const speedX = speed.speedX * game.tileSize / game.currentFrameRate;
    const speedY = speed.speedY * game.tileSize / game.currentFrameRate;

    position.pixels.x += speedX; // move by x speed
    // if there's a collision, move back
    if (anyHitboxesCollide(game, entity, room)) position.pixels.x -= speedX;

    // same thing with y speed
    position.pixels.y += speedY;
    if (anyHitboxesCollide(game, entity, room)) position.pixels.y -= speedY;

};

/**
 * Gives an entity a random pixel position in a room making sure it doesn't 
 * collide with any other entities
 * @param game The game object
 * @param room The room to place the entity in
 * @param entity The entity to set the position of
 */

export const setRandomEntityPos = (game: Game, room: Room, entity: Entity): void => {
    let pixelPos: Vec;

    do {
        // set position on tile grid then add random offset
        // (also makes sure it's not too close to a wall)
        pixelPos = new Vec(
            (randInt(2, game.roomSize.x - 3) + Math.random() - .5) * game.tileSize,
            (randInt(2, game.roomSize.y - 3) + Math.random() - .5) * game.tileSize
        );

        game.ecs.addComponent(entity, components.PositionComponent, [pixelPos, room.pos.clone()]);
    } while (anyHitboxesCollide(game, entity, room));
};

export const drawLine = (
    ctx: CanvasRenderingContext2D,
    colour: string,
    start: Vec,
    end: Vec,
    offset = 0
): void => {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(start.x + offset, start.y + offset);
    ctx.lineTo(end.x + offset, end.y + offset);
    ctx.stroke();
};

export const shuffle = <T>(array: T[]): T[] => array
    .map(value => ({ value, rand: Math.random() })) // add random number to each element
    .sort((a, b) => a.rand - b.rand) // sort by that random number
    .map(({ value }) => value); // extract the value

// next two functions are just here to get around circular dependencies

export const isHidden = (ecs: ECS, entity: Entity): boolean => {
    return ecs.hasComponent(entity, components.HiddenComponent);
};

export const shouldAlwaysUpdate = (ecs: ECS, entity: Entity): boolean => {
    return ecs.hasComponent(entity, components.AlwaysUpdateComponent);
};