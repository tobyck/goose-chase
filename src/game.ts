/*
 * main.ts
 *
 * This file contains the Game class which is a wrapper for everything
 * in the game and will be re-instantiated with each level.
 */

import * as components from "./components";

// systems
import ControllableSystem from "./systems/controllable";
import WalkingSystem from "./systems/walking";
import RenderSystem from "./systems/render";
import PlaceSystem from "./systems/place";
import KeyUpSystem from "./systems/keyup";
import HealthBarSystem from "./systems/health_bar";
import WeaponSystem from "./systems/weapon";
import Followsystem from "./systems/follow";
import ClickSystem from "./systems/click";
import ParticleSystem from "./systems/particles";
import RespawnSystem from "./systems/respawn";
import EvadeSystem from "./systems/evade";
import HuntSystem from "./systems/hunt";

// imports from the engine
import { Asset, Assets } from "./engine/asset_loader";
import { ECS, type Entity, SystemTrigger } from "./engine/ecs";
import { addEntities } from "./entity_gen";
import { Room } from "./engine/room";
import { Particle } from "./engine/particle";

// misc imports
import { newPlayerEntity } from "./templates/player";
import { generateMap } from "./map_gen";
import { Rect, Vec } from "./helpers";
import { showGameStoppedScreen } from "./gui";

type EventHandler = (event?: Event) => void;

export default class Game {
    static maxLevel = 15;

    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;

    shouldPlayMusic: boolean;
    shouldPlaySFX: boolean;

    startTime: number;

    paused = false;

    eventListeners: Record<string, EventHandler> = {};

    readonly assets: Assets;
    readonly level: number;
    readonly ecs = new ECS(this);
    readonly player: Entity;
    goose: Entity;

    toRespawn: Entity[] = [];

    particles: Particle[] = [];

    // maximum distance (in tiles) that an entity can be from the entity it wants to hit
    readonly minHitDist = 1.7;

    currentFrameRate: number;
    timeOfLastFrame = 0;

    readonly leftHandItemBox: Entity;
    readonly rightHandItemBox: Entity;
    readonly leftHandItemPos: Vec;
    readonly rightHandItemPos: Vec;

    keys: { [key: string]: boolean } = {};
    keyReleased: string;
    lastClickPos: Vec;

    readonly tileSize: number; // width of a tile in pixels
    readonly roomCount: Vec; // amount of rooms
    readonly roomSize: Vec; // amount of tiles
    readonly rooms: Room[]; // flat list of rooms (pos stored in each room object)

    constructor(canvas: HTMLCanvasElement, assets: Assets, level: number, shouldPlayMusic: boolean, shouldPlaySFX: boolean) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        if (level > 0 && level <= Game.maxLevel) {
            this.level = level;
        } else {
            throw new Error(`Level ${level} does not exist`);
        }

        this.assets = assets;

        this.shouldPlayMusic = shouldPlayMusic;
        this.shouldPlaySFX = shouldPlaySFX;

        // room dimensions:
        // level 1: 1x1
        // level 2: 2x1
        // level 3: 2x2
        // level 4: 3x2
        // ...

        this.roomCount = new Vec(
            Math.ceil(level / 2),
            Math.ceil(level / 2)
        );

        if (level % 2 === 0) this.roomCount.x++;

        // size the rooms to have a roughly even number of tiles with different aspect ratios

        this.roomSize = new Vec(null, null);
        this.roomSize.y = Math.floor(9 * (innerHeight / innerWidth + 1));
        this.tileSize = Math.floor(innerHeight / this.roomSize.y);
        this.roomSize.x = Math.floor(innerWidth / this.tileSize);

        // size the canvas to fit a room

        this.canvas.width = this.roomSize.x * this.tileSize;
        this.canvas.height = this.roomSize.y * this.tileSize;

        // turn off anti-aliasing

        this.ctx.imageSmoothingEnabled = false;

        // add the player in the middle of the room

        this.player = newPlayerEntity(this, new Vec(
            (this.roomSize.x / 2 - .5) * this.tileSize,
            (this.roomSize.y / 2 - .5) * this.tileSize
        ));

        // add boxes to show items held by the player

        [this.leftHandItemBox, this.leftHandItemPos] = this.addItemBox(new Vec(
            this.tileSize,
            (this.roomSize.y - 4) * this.tileSize
        ));

        [this.rightHandItemBox, this.rightHandItemPos] = this.addItemBox(new Vec(
            (this.roomSize.x - 4) * this.tileSize,
            (this.roomSize.y - 4) * this.tileSize
        ));

        // generate the rooms using the function in mapgen.ts

        this.rooms = generateMap(this);

        // add items to the rooms

        addEntities(this);

        for (const room of this.rooms) { // for each room
            // bring all walking entities to the front
            this.ecs.entitiesWithComponents(room, [components.WalkingComponent])
                .forEach(this.ecs.bringToFront, this.ecs);
        }

        // add systems

        [
            // systems that set speeds
            ControllableSystem,
            Followsystem,
            EvadeSystem,

            // system that actually moves entities
            WalkingSystem,

            // input systems
            ClickSystem,
            KeyUpSystem,
            PlaceSystem,

            // misc systems
            RespawnSystem,
            HuntSystem,

            // systems that render things
            RenderSystem,
            HealthBarSystem,
            WeaponSystem,
            ParticleSystem
        ].forEach(system => this.ecs.systemManager.addSystem(new system()));

        // start music loop
    }

    // method to get the position of the last mouse click relative to the canvas

    setLastClickPos(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        this.lastClickPos = new Vec(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    }

    // method to add a box to show items held by the player
    // returns the pixel position of where the item inside should be

    addItemBox(pos: Vec): [Entity, Vec] {
        const itemBox = this.ecs.createEntity();

        this.ecs.addComponent(itemBox, components.ImageComponent, [
            this.getImage("item_box"),
            new Rect(0, 0, 48, 48), new Vec(this.tileSize * 3, this.tileSize * 3)
        ]);

        this.ecs.addComponent(itemBox, components.PositionComponent, [
            pos, this.playerRoomPos
        ]);

        this.ecs.addComponent(itemBox, components.HitboxComponent, [Rect.fromVecs(
            // scale up pixels from spritesheet to pixels on canvas
            new Vec(11, 11).scaled(16, this.tileSize),
            new Vec(26, 26).scaled(16, this.tileSize)
        )]);

        return [itemBox, pos.shifted(new Vec(this.tileSize, this.tileSize))];
    }

    get playerRoomPos(): Vec {
        return this.ecs.getComponent(this.player, components.PositionComponent).room;
    }

    // returns the Room object at 
    roomAt(pos: Vec): Room {
        return this.rooms.find(room => Vec.equal(room.pos, pos));
    }

    // returns the actual asset matching the given name 
    // (this will either be an image or an audio element)
    getAsset(name: string): Asset {
        const assetArray: Asset[] = [];

        for (const assetSubArr in this.assets) {
            assetArray.push(...this.assets[assetSubArr]);
        }

        return assetArray.find(asset => new RegExp(`${name}\\.[^\\.]+`).test(asset.src));
    }

    // methods to case the result of getAsset

    getImage(name: string) {
        return this.getAsset(name) as CanvasImageSource;
    }

    getAudio(name: string) {
        return this.getAsset(name) as HTMLAudioElement;
    }

    // adds all the necessary event listeners and remembers them in an object
    addEventListeners(): Record<string, EventListener> {
        const listeners = {
            "blur": this.pause.bind(this),
            "keydown": event => {
                const key = event.key.toLowerCase();

                if (key === "p" || key === "escape") {
                    this.pause();
                }

                this.keys[key] = true;
                this.ecs.systemManager.updateSystems(SystemTrigger.Keyboard);
            },
            "keyup": event => {
                const key = event.key.toLowerCase();
                this.keyReleased = key;
                this.ecs.systemManager.updateSystems(SystemTrigger.KeyUp);
                delete this.keys[key];
                this.ecs.systemManager.updateSystems(SystemTrigger.Keyboard);
            },
            "click": event => {
                this.setLastClickPos(event);
                this.ecs.systemManager.updateSystems(SystemTrigger.Click);
            },
            "contextmenu": event => {
                event.preventDefault(); // prevent context menu from opening
                this.setLastClickPos(event);
                this.ecs.systemManager.updateSystems(SystemTrigger.RightClick);
            }
        };

        for (const key in listeners) {
            document.addEventListener(key, listeners[key]);
        }

        return listeners;
    }

    // removes all event listeners added by Game.addEventListeners
    removeEventListeners(): void {
        Object.entries(this.eventListeners).forEach(([type, listener]) => {
            document.removeEventListener(type, listener);
        });
    }

    // methods to start/stop the game

    start() {
        this.paused = false;
        this.eventListeners = this.addEventListeners();
        this.startTime = performance.now();
        this.timeOfLastFrame = performance.now();
        this.tick(performance.now());

        if (this.shouldPlayMusic) {
            const music = this.getAudio("music");
            music.loop = true;
            music.volume = .5; // quiten the music a bit
            music.play();
        }
    }

    pause() {
        if (!this.paused) {
            showGameStoppedScreen("Game Paused", "Quit", true);
            this.removeEventListeners();
            this.getAudio("music").pause();
        }
    }

    // re-render the whole game every frame using requestAnimationFrame

    tick(timestamp: number) {
        if (!this.paused) { // stop game loop if paused
            this.currentFrameRate = 1000 / (timestamp - this.timeOfLastFrame);
            this.timeOfLastFrame = timestamp;

            // find the current room and render 
            this.roomAt(this.playerRoomPos).render();

            // update all systems triggerd by rendering
            this.ecs.systemManager.updateSystems(SystemTrigger.Tick);

            // request the next frame
            requestAnimationFrame(timestamp => this.tick(timestamp));
        }
    }
}