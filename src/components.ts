/* 
 * components.ts
 *
 * Stores all components in the game. These will usually just contain data,
 * but occasionally a couple of small methods, or sometimes no data at all
 * if it's just a flag to indicate that an entity has a certain capability.
 */

import { Component, type Entity } from "./engine/ecs";
import { Particle } from "./engine/particle";
import { randInt, Rect, Vec } from "./helpers";
import Game from "./game";
import { showGameStoppedScreen } from "./gui";

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
    timeOflastFrameChange = 0;

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

    // returns x and y speeds that will result moving by dx and dy at this.velocity
    speedsTo(dx: number, dy: number): [number, number] {
        const hypot = Math.hypot(dx, dy);
        return [(dx / hypot * this.velocity) || 0, (dy / hypot * this.velocity) || 0];
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

    // used for the code that kills the entity when health reaches 0
    #game: Game;
    #entity: Entity;

    constructor(maxHealth: number, game: Game, entity: Entity) {
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.#game = game;
        this.#entity = entity;
    }

    heal(amount: number): void {
        // add the amount, but don't go over the max health
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    damage(amount: number): void {
        this.health -= amount;

        if (this.health <= 0) {
            if (this.#entity === this.#game.player) {
                showGameStoppedScreen("Game Over", "Menu", false);
                this.#game.paused = true;
            } else if (this.#entity === this.#game.goose) {
                showGameStoppedScreen("You Win!", "Menu", false);
            } else {
                if (this.#game.ecs.hasComponent(this.#entity, ParticleColourComponent)) {
                    Particle.createBurst(
                        this.#game,
                        17, // number of particles
                        17, // delay between creation of each particle
                        this.#game.ecs
                            .getComponent(this.#entity, PositionComponent)
                            .getCentre(this.#game.tileSize),
                        0.1, // speed
                        0.997, // friction
                        this.#game.ecs.getComponent(this.#entity, ParticleColourComponent).colour,
                    );
                }

                if (this.#game.ecs.hasComponent(this.#entity, RespawnableComponent)) {
                    this.#game.ecs.addComponent(this.#entity, HiddenComponent);

                    const respawnable = this.#game.ecs.getComponent(this.#entity, RespawnableComponent);
                    respawnable.timeOfDeath = performance.now();
                    respawnable.timeUntilRespawn = randInt(...respawnable.timeUntilRespawnRange);

                    this.#game.toRespawn.push(this.#entity);
                } else {
                    this.#game.ecs.removeEntity(this.#entity);
                }
            }
        }
    }
}

export class WeaponComponent extends Component {
    damage: number; // how much health the weapon takes off

    // properties for the weapon animation
    // these are set when the weapon is swung

    holder: Entity; // entity holding the weapon

    totalFrames: number; // how many ticks the weapon animation takes
    frameCount: number; // how many ticks until the weapon animation is over

    startAngle: number; // angle the weapon starts at (in radians)
    swingRadians: number; // how many radians the weapon swings through

    // this vector will be added to the vector holder's centre to get the pivot point
    pivotPointOffset: Vec;

    constructor(damage: number) {
        super();
        this.damage = damage;
    }
}

// entity can be controlled by the user
export class ControllableComponent implements Component {
    sneaking = false;
}

export class WalkingComponent implements Component {
    canGetTired: boolean;

    constructor(canGetTired: boolean) {
        this.canGetTired = canGetTired;
    }
}

export class HoldableComponent implements Component { }

export class FollowComponent implements Component {
    target: Entity; // the entity to follow
    maxTiles: number; // how close the target has to be before the entity starts following

    randomWalkAngle = Math.random() * Math.PI * 2; // random angle to walk in when the target is too far away
    timeOfLastAngleChange = 0; // time when the random walk angle was last changed

    static readonly angleChangeInterval = 2000; // how often the random walk angle changes

    constructor(target: Entity, maxTiles: number) {
        this.target = target;
        this.maxTiles = maxTiles;
    }
}

export class ParticleColourComponent implements Component {
    colour: string;

    constructor(colour: string) {
        this.colour = colour;
    }
}

export class HiddenComponent implements Component {
    shouldUpdate;

    constructor(shouldUpdate: boolean) {
        this.shouldUpdate = shouldUpdate;
    }
}

export class RespawnableComponent implements Component {
    timeOfDeath: number;
    timeUntilRespawn: number;
    readonly timeUntilRespawnRange: [number, number];

    constructor(timeUntilRespawnRange: [number, number]) {
        this.timeUntilRespawnRange = timeUntilRespawnRange;
    }
}

export class HunterComponent implements Component {
    target: Entity; // entity to hunt

    timeOfLastHit = 0; // time since the hunter last hit the target
    timeUntilNextHit = 0;
    readonly timeBetweenHitsRange: [number, number]; // in milliseconds

    maxHitDist: number; // how close the target has to be before the hunter hits it

    constructor(target: Entity, timeBetweenHitsRange: [number, number], maxHitDist: number) {
        this.target = target;
        this.timeBetweenHitsRange = timeBetweenHitsRange;
        this.maxHitDist = maxHitDist;
    }
}

export class AlwaysUpdateComponent implements Component { }

export class EvaderComponent implements Component {
    entityToEvade: Entity;

    constructor(entityToEvade: Entity) {
        this.entityToEvade = entityToEvade;
    }
}