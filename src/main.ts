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

// imports from the engine
import { Asset, AssetLoader, Assets, AssetType } from "./engine/asset_loader";
import { ECS, type Entity, SystemTrigger } from "./engine/ecs";
import { addEntities } from "./entity_gen";
import { Room } from "./engine/room";
import { Particle } from "./engine/particle";

// misc imports
import { newPlayerEntity } from "./templates/player";
import { generateMap } from "./map_gen";
import { Rect, Vec } from "./helpers";
import RespawnSystem from "./systems/respawn";
import HuntSystem from "./systems/hunt";

export default class Game {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;

    readonly level: number;

    readonly assets: Assets;

    readonly ecs = new ECS(this);

    readonly player: Entity;

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

    constructor(canvas: HTMLCanvasElement, level: number, assets: Assets) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.level = level;

        this.assets = assets;

        document.addEventListener("keydown", event => {
            this.keys[event.key.toLowerCase()] = true;
            this.ecs.systemManager.updateSystems(SystemTrigger.Keyboard);
        });

        document.addEventListener("keyup", event => {
            const key = event.key.toLowerCase();
            this.keyReleased = key;
            this.ecs.systemManager.updateSystems(SystemTrigger.KeyUp);
            delete this.keys[key];
            this.ecs.systemManager.updateSystems(SystemTrigger.Keyboard);
        });

        document.addEventListener("click", event => {
            this.setLastClickPos(event);
            this.ecs.systemManager.updateSystems(SystemTrigger.Click);

            // temporary place to start music
            const music = this.getAudio("music");
            music.loop = true;
            music.volume = .5;
            music.play();
        });

        document.addEventListener("contextmenu", event => {
            event.preventDefault(); // prevent context menu from opening
            this.setLastClickPos(event);
            this.ecs.systemManager.updateSystems(SystemTrigger.RightClick);
        });

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

            // system that moves them
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
            new Vec(11, 11).scaled(16, this.tileSize),
            new Vec(26, 26).scaled(16, this.tileSize)
        )]);

        return [itemBox, pos.shifted(new Vec(this.tileSize, this.tileSize))];
    }

    // re-render the whole game every frame using requestAnimationFrame

    tick(timestamp: number) {
        this.currentFrameRate = 1000 / (timestamp - this.timeOfLastFrame);
        this.timeOfLastFrame = timestamp;

        // pause the game if the window is not focused (e.g. on another tab)
        if (document.hasFocus()) {
            // find the current room and render 
            this.roomAt(this.playerRoomPos).render();

            // update all systems triggerd by rendering
            this.ecs.systemManager.updateSystems(SystemTrigger.Tick);
        }

        // request the next frame
        requestAnimationFrame(timestamp => this.tick(timestamp));
    }

    get playerRoomPos(): Vec {
        return this.ecs.getComponent(this.player, components.PositionComponent).room;
    }

    roomAt(pos: Vec) {
        return this.rooms.find(room => Vec.equal(room.pos, pos));
    }

    getAsset(name: string) {
        const assetArray: Asset[] = [];

        for (const assetSubArr in this.assets) {
            assetArray.push(...this.assets[assetSubArr]);
        }

        return assetArray.find(asset => new RegExp(`${name}\\.[^\\.]+`).test(asset.src));
    }

    getImage(name: string) {
        return this.getAsset(name) as CanvasImageSource;
    }

    getAudio(name: string) {
        return this.getAsset(name) as HTMLAudioElement;
    }
}

const assetLoader = new AssetLoader([
    { type: AssetType.Image, path: "assets/images/tiles.png" },
    { type: AssetType.Image, path: "assets/images/player.png" },
    { type: AssetType.Image, path: "assets/images/items.png" },
    { type: AssetType.Image, path: "assets/images/item_box.png" },
    { type: AssetType.Image, path: "assets/images/zombie.png" },
    { type: AssetType.Audio, path: "assets/sounds/music.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/footstep.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/pick_up.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/place.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/swap_hands.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/decline.mp3" },
]);

(async () => {
    const assets = await assetLoader.loadAll();
    const game = new Game(document.querySelector("canvas"), 2, assets);
    game.tick(0);
})();