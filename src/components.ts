/* 
 * components.ts
 *
 * Stores all components in the game. These will usually just contain data,
 * but occasionally a couple of small methods, or sometimes no data at all
 * if it's just a flag to indicate that an entity has a certain capability.
 */

import { Component, type Entity } from "./engine/ecs";
import { Rect, Vec } from "./helpers";

export class PositionComponent implements Component {
    pixels: Vec;
    room: Vec;

    constructor(pixels: Vec, room: Vec) {
        this.pixels = pixels;
        this.room = room;
    }

    getCentre(tileSize: number): Vec {
        return new Vec(
            this.pixels.x + tileSize / 2,
            this.pixels.y + tileSize / 2
        );
    }
}

export class ImageComponent implements Component {
    image: CanvasImageSource;

    // source rectangle
    frame: Rect;

    // destination vector
    dest: Vec;

    // time when the frame was last changed
    lastFrameChange = Date.now();

    constructor(image: CanvasImageSource, frame: Rect, dest?: Vec) {
        this.image = image;
        this.frame = frame;
        this.dest = dest || new Vec(null, null);
    }
}

export class SpeedComponent implements Component {
    readonly velocity: number; // stored the velocity in any direction

    // speeds on the x and y axes which are calculated using the fixed velocity
    speedX: number;
    speedY: number;

    constructor(velocity: number) {
        this.velocity = velocity;
        this.speedX = 0;
        this.speedY = 0;
    }

    speedsTo(dx: number, dy: number): [number, number] {
        const hypot = Math.hypot(dx, dy);
        return [dx / hypot * this.velocity, dy / hypot * this.velocity];
    }

    get currentVelocity(): number {
        return Math.hypot(this.speedX, this.speedY);
    }
}

export class HitboxComponent extends Rect implements Component {
    constructor(rect: Rect) {
        super(rect.x, rect.y, rect.width, rect.height);
    }

    getActualHitbox(entityPos: PositionComponent): HitboxComponent {
        return new HitboxComponent(new Rect(this.x + entityPos.pixels.x,
            this.y + entityPos.pixels.y,
            this.width,
            this.height
        ));
    }
}

export class HandsComponent implements Component {
    leftHand: Entity;
    rightHand: Entity;

    constructor(leftHand: Entity, rightHand: Entity) {
        this.leftHand = leftHand;
        this.rightHand = rightHand;
    }

    // checks if there's a free hand
    hasSpace(): boolean {
        return this.leftHand === null || this.rightHand === null;
    }

    // checks if both hands are empty
    allEmpty(): boolean {
        return this.leftHand === null && this.rightHand === null;
    }

    // adds an item to a free hand and returns the item
    addItem(item: Entity, hand: "left" | "right"): Entity {
        if (hand === "left" && this.leftHand === null) {
            this.leftHand = item;
            return item;
        }

        if (this.rightHand === null) {
            this.rightHand = item;
            return item;
        }

        return null;
    }

    // remove the left hand item if present, otherwise right hand item, and return it
    takeItem(): [Entity, "left" | "right"] {
        if (this.leftHand !== null) {
            const item = this.leftHand;
            this.leftHand = null;
            return [item, "left"];
        } else if (this.rightHand !== null) {
            const item = this.rightHand;
            this.rightHand = null;
            return [item, "right"];
        } else return null;
    }
}

export class HealthComponent implements Component {
    health: number;
    maxHealth: number;

    constructor(maxHealth: number) {
        this.health = maxHealth;
        this.maxHealth = maxHealth;
    }

    heal(amount: number): void {
        // add the amount, but don't go over the max health
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    damage(amount: number): void {
        this.health = Math.max(this.health - amount, 0);
        if (this.health === 0) {
            // entity is dead
            // implement death here
        }
    }
}

// entity can be controlled by the user
export class ControllableComponent implements Component {
    sneaking = false;
}

// these components don't need data, they're just flags
export class WalkingComponent implements Component { } // entity can walk
export class HoldableComponent implements Component { } // entity can be picked up