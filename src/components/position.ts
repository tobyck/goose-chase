import { Component } from "../engine/ecs";
import { Vec } from "../util";

export class PositionComponent extends Component {
    position: Vec;
    room: Vec;

    constructor(position: Vec, room: Vec) {
        super();
        this.position = position;
        this.room = room;
    }
}