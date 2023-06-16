import * as components from "../components";
import { Entity } from "../engine/ecs";
import { Room } from "../engine/room";
import { Rect, setRandomEntityPos } from "../helpers";
import Game from "../main";

export const newItemEntity = (
    game: Game,
    room: Room,
    image: CanvasImageSource,
    frame: Rect,
    hitbox?: Rect
): Entity => {
    const entity = game.ecs.createEntity();

    // add hitbox if provided
    if (hitbox) game.ecs.addComponent(
        entity,
        components.HitboxComponent,
        [hitbox]
    );

    setRandomEntityPos(game, room, entity);

    game.ecs.addComponent(entity, components.ImageComponent, [image, frame]);

    // allow all items to be picked up
    game.ecs.addComponent(entity, components.HoldableComponent);

    return entity;
};