/*
 * main.ts
 *
 * This file contains the Game class which is a wrapper for everything
 * in the game and will be re-instantiated with each level. The Game class's 
 * constructor is also responsible for loading images and starting the gameLoop.
 * In the gameLoop, the canvas is cleared then the room's render function
 * handles rendering of room.
 */

import * as components from "./components";
import { ControllableSystem } from "./systems/controllable";
import { ECS, type Entity, SystemTrigger } from "./engine/ecs";
import { generateMap } from "./engine/map_gen";
import { Room } from "./engine/room";
import { RenderSystem } from "./systems/render";
import { Rect, Vec } from "./helpers";
import { WalkingSystem } from "./systems/walking";
import { HitSystem } from "./systems/hit";
import { PlaceSystem } from "./systems/place";
import { KeyUpSystem } from "./systems/keyup";
import { HealthBarSystem } from "./systems/health_bar";
import { addItems } from "./engine/item_gen";
import { WeaponSystem } from "./systems/weapon";
import { AssetLoader, AssetType } from "./engine/asset_loader";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    ecs = new ECS(this);

    player: Entity;

    assets: typeof AssetLoader.prototype.assets;

    level: number;

    leftHandItemBox: Entity;
    rightHandItemBox: Entity;

    leftHandItemPos: Vec;
    rightHandItemPos: Vec;

    keys: { [key: string]: boolean } = {};
    lastClickPos: Vec;

    tileSize: number; // width of a tile in pixels
    roomCount: Vec; // amount of rooms
    roomSize: Vec; // amount of tiles
    rooms: Room[]; // flat list of rooms (pos stored in each room object)
    room: Vec; // vector representing which room the player is in

    constructor(canvas: HTMLCanvasElement, level: number, assets: typeof AssetLoader.prototype.assets) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.level = level;

        this.assets = assets;

        document.addEventListener("keydown", event => {
            this.keys[event.key.toLowerCase()] = true;
            this.ecs.systemManager.updateSystems(SystemTrigger.Keyboard);
        });

        document.addEventListener("keyup", event => {
            this.ecs.systemManager.updateSystems(SystemTrigger.KeyUp);
            delete this.keys[event.key.toLowerCase()];
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

        // put the character in the middle of the map

        this.room = new Vec(
            Math.floor(this.roomCount.x / 2),
            Math.floor(this.roomCount.y / 2)
        );

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

        // add boxes to show items held by the player

        [this.leftHandItemBox, this.leftHandItemPos] = this.addItemBox(new Vec(
            this.tileSize,
            (this.roomSize.y - 4) * this.tileSize
        ));

        [this.rightHandItemBox, this.rightHandItemPos] = this.addItemBox(new Vec(
            (this.roomSize.x - 4) * this.tileSize,
            (this.roomSize.y - 4) * this.tileSize
        ));

        // add the player

        this.player = this.ecs.createEntity();

        this.ecs.addComponent(this.player, components.ImageComponent, [
            this.getImage("player"),
            new Rect(0, 0, 16, 16)
        ]);

        // put the player in the middle of the room
        this.ecs.addComponent(this.player, components.PositionComponent, [
            new Vec(
                (this.roomSize.x / 2 - .5) * this.tileSize,
                (this.roomSize.y / 2 - .5) * this.tileSize
            ),
            this.room
        ]);

        this.ecs.addComponent(this.player, components.SpeedComponent, [this.tileSize / 28]); // move 1/20 of a tile per frame
        this.ecs.addComponent(this.player, components.WalkingComponent);
        this.ecs.addComponent(this.player, components.ControllableComponent);
        this.ecs.addComponent(this.player, components.HandsComponent, [null, null]);
        this.ecs.addComponent(this.player, components.HealthComponent, [100]);
        this.ecs.addComponent(this.player, components.HitboxComponent, [Rect.fromVecs(
            new Vec(2, 0).scaled(16, this.tileSize).shifted(new Vec(0, 2)),
            new Vec(12, 16).scaled(16, this.tileSize).shifted(new Vec(0, -2))
        )]);

        // generate the rooms using the function in mapgen.ts

        this.rooms = generateMap(this);

        // add items to the rooms

        addItems(this);

        // bring the player to the front so they are drawn on top of everything else
        // (this is so that items without hitboxes will be drawn behind the player)

        this.ecs.bringToFront(this.player);

        // add systems

        this.ecs.systemManager.addSystem(new ControllableSystem());
        this.ecs.systemManager.addSystem(new WalkingSystem());
        this.ecs.systemManager.addSystem(new HitSystem());
        this.ecs.systemManager.addSystem(new PlaceSystem());
        this.ecs.systemManager.addSystem(new KeyUpSystem());
        this.ecs.systemManager.addSystem(new RenderSystem());
        this.ecs.systemManager.addSystem(new HealthBarSystem());
        this.ecs.systemManager.addSystem(new WeaponSystem());

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
            pos, this.room
        ]);

        this.ecs.addComponent(itemBox, components.HitboxComponent, [Rect.fromVecs(
            new Vec(11, 11).scaled(16, this.tileSize),
            new Vec(26, 26).scaled(16, this.tileSize)
        )]);

        return [itemBox, pos.shifted(new Vec(this.tileSize, this.tileSize))];
    }

    // re-render the whole game every frame using requestAnimationFrame

    tick() {
        // find the current room and render 
        this.currentRoom.render();

        // update all systems triggerd by rendering
        this.ecs.systemManager.updateSystems(SystemTrigger.Tick);

        // request the next frame
        requestAnimationFrame(() => this.tick());
    }

    // getter function to find the current room

    get currentRoom() {
        return this.rooms.find(room => Vec.equal(room.pos, this.room));
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

type Asset = HTMLImageElement | HTMLAudioElement;

const assetLoader = new AssetLoader([
    { type: AssetType.Image, path: "assets/images/tiles.png" },
    { type: AssetType.Image, path: "assets/images/player.png" },
    { type: AssetType.Image, path: "assets/images/items.png" },
    { type: AssetType.Image, path: "assets/images/item_box.png" },
    { type: AssetType.Audio, path: "assets/sounds/music.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/footstep.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/pick_up.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/place.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/swap_hands.mp3" },
    { type: AssetType.Audio, path: "assets/sounds/decline.mp3" },
]);

assetLoader.loadAll().then(assets => { // once all assets are loaded
    // initialize game object
    const game = new Game(document.querySelector("canvas"), 4, assets);

    // start the game loop
    game.tick();
});