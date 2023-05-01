import { Component } from "../engine/ecs";

export class ImageComponent extends Component {
    image: CanvasImageSource;
    sx: number; // source x
    sy: number; // source y
    sw: number; // source width
    sh: number; // source height

    constructor(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number) {
        super();
        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
    }
}