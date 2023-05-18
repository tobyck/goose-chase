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
import { generateMap } from "./engine/mapgen";
import { Room } from "./engine/room";
import { RenderSystem } from "./systems/render";
import { Rect, Vec } from "./helpers";
import { WalkingSystem } from "./systems/walking";
import { HitSystem } from "./systems/hit";
import { PlaceSystem } from "./systems/place";
import { KeyUpSystem } from "./systems/keyup";
import { HealthBarSystem } from "./systems/healthbar";
import { addItems } from "./engine/itemgen";
import { WeaponSystem } from "./systems/weapon";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    ecs = new ECS(this);

    player: Entity;

    images: { [key: string]: CanvasImageSource } = {};

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

    constructor(canvas: HTMLCanvasElement, level: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.level = level;

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

        // pre-load images

        const files: string[] = ["tiles", "player", "items", "item-box"]; // list of filenames without extensions
        const promises: Promise<CanvasImageSource>[] = []; // list of promises, one for each image

        // create a promise for each image

        for (const file of files) {
            promises.push(new Promise((resolve, reject) => {
                const img = new Image();
                img.src = "./img/" + file + ".png";
                img.onload = () => resolve(img);
                img.onerror = error => reject(error);
            }));
        }

        // wait for all the images to load then...
        Promise.all(promises).then(images => {
            // store the images in the game instance for use elsewhere
            images.forEach((image, index) => this.images[files[index]] = image);

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

            this.ecs.addComponent(game.player, components.ImageComponent, [
                this.images["player"],
                new Rect(0, 0, 16, 16)
            ]);

            // put the player in the middle of the room
            this.ecs.addComponent(game.player, components.PositionComponent, [
                new Vec(
                    (this.roomSize.x / 2 - .5) * this.tileSize,
                    (this.roomSize.y / 2 - .5) * this.tileSize
                ),
                this.room
            ]);

            this.ecs.addComponent(game.player, components.SpeedComponent, [this.tileSize / 20]); // move 1/20 of a tile per frame
            this.ecs.addComponent(game.player, components.WalkingComponent);
            this.ecs.addComponent(game.player, components.ControllableComponent);
            this.ecs.addComponent(game.player, components.HandsComponent, [null, null]);
            this.ecs.addComponent(game.player, components.HealthComponent, [100]);
            this.ecs.addComponent(game.player, components.HitboxComponent, [Rect.fromVecs(
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

            // start the game loop
            this.tick();
        });
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
            this.images["item-box"],
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
}

const game = new Game(document.querySelector("canvas"), 4);