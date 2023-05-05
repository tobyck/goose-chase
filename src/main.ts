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
import { ECS, SystemTrigger } from "./engine/ecs";
import { generateMap } from "./engine/mapgen";
import { Room } from "./engine/room";
import { RenderSystem } from "./systems/render";
import { Vec } from "./util";
import { WalkingSystem } from "./systems/walking";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    ecs = new ECS(this);

    images: { [key: string]: CanvasImageSource } = {};

    // object to store which keys are currently pressed
    keys: { [key: string]: boolean } = {};

    level: number;

    tileWidth: number; // width of a tile in pixels
    roomCount: Vec; // amount of rooms
    roomSize: Vec; // amount of tiles
    rooms: Room[]; // flat list of rooms (pos stored in each room object)
    room: Vec; // vector representing which room the player is in

    constructor(canvas: HTMLCanvasElement, level: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.level = level;

        // onkeydown set the key in the keys object to true
        onkeydown = event => this.keys[event.key.toLowerCase()] = true;

        // onkeyup set it to false
        onkeyup = event => this.keys[event.key.toLowerCase()] = false;

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
        this.roomSize.y = Math.floor(10 * (innerHeight / innerWidth + 1));
        this.tileWidth = Math.floor(innerHeight / this.roomSize.y);
        this.roomSize.x = Math.floor(innerWidth / this.tileWidth);


        // size the canvas to fit a room

        this.canvas.width = this.roomSize.x * this.tileWidth;
        this.canvas.height = this.roomSize.y * this.tileWidth;

        // turn off anti-aliasing

        this.ctx.imageSmoothingEnabled = false;

        // pre-load images

        const files: string[] = ["tiles", "player"]; // list of filenames without extension
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

            // generate the rooms using the function in mapgen.ts
            this.rooms = generateMap(this);

            // add the player

            const player = this.ecs.createEntity();

            this.ecs.addComponent(player, components.ImageComponent, [
                this.images["player"],
                0, 0, 16, 16
            ]);

            this.ecs.addComponent(player, components.PositionComponent, [new Vec(100, 100), this.room]);
            this.ecs.addComponent(player, components.SpeedComponent, [this.tileWidth / 20]); // move 1/20 of a tile per frame
            this.ecs.addComponent(player, components.WalkingComponent);
            this.ecs.addComponent(player, components.ControllableComponent);
            this.ecs.addComponent(player, components.HitboxComponent, [
                new Vec(2, 0).scaled(16, this.tileWidth),
                new Vec(12, 16).scaled(16, this.tileWidth)
            ]);

            // add systems

            this.ecs.systemManager.addSystem(new ControllableSystem());
            this.ecs.systemManager.addSystem(new WalkingSystem());
            this.ecs.systemManager.addSystem(new RenderSystem());

            // start the game loop
            this.tick();
        });
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