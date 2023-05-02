/*
 * main.ts
 *
 * This file contains the Game class which is a wrapper for everything
 * in the game and will be re-instantiated with each level. The Game class's 
 * constructor is also responsible for loading images and starting the gameLoop.
 * In the gameLoop, the canvas is cleared then the room's render function
 * handles rendering of room.
 */

import { ECS, SystemTrigger } from "./engine/ecs";
import { generateMap } from "./engine/mapgen";
import { Room } from "./engine/room";
import { RenderSystem } from "./systems/render";
import { Vec } from "./util";

export default class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    ecs = new ECS(this);

    images: { [key: string]: CanvasImageSource } = {};

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

        const files: string[] = ["tiles"]; // list of filenames without extension
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

            // add systems
            this.ecs.systemManager.addSystem(new RenderSystem());

            // start the game loop
            this.gameLoop();
        });
    }

    // re-render the whole game every frame using requestAnimationFrame

    gameLoop() {
        // clear the whole canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // find the current room and render 
        this.currentRoom.render();

        // update all systems triggerd by rendering
        this.ecs.systemManager.updateSystems(SystemTrigger.Render);


        // request the next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    // getter function to find the current room

    get currentRoom() {
        return this.rooms.find(room => Vec.equal(room.pos, this.room));
    }
}

const game = new Game(document.querySelector("canvas"), 4);