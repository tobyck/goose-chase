import * as components from "../components";
import { Entity } from "../engine/ecs";
import { Rect, Vec } from "../helpers";
import Game from "../game";

export const newPlayerEntity = (game: Game, pos: Vec): Entity => {
    const player = game.ecs.createEntity();

    game.ecs.addComponent(player, components.PositionComponent, [
        pos,
        new Vec(
            Math.floor(game.roomCount.x / 2),
            Math.floor(game.roomCount.y / 2)
        )
    ]);

    game.ecs.addComponent(player, components.ImageComponent, [
        game.getImage("player"),
        new Rect(0, 0, 16, 16)
    ]);

    game.ecs.addComponent(player, components.SpeedComponent, [3]);
    game.ecs.addComponent(player, components.WalkingComponent, [true]);
    game.ecs.addComponent(player, components.ControllableComponent);
    game.ecs.addComponent(player, components.HandsComponent, [null, null]);
    game.ecs.addComponent(player, components.HealthComponent, [100, game, player]);

    game.ecs.addComponent(player, components.HitboxComponent, [Rect.fromVecs(
        new Vec(2, 0).scaled(16, game.tileSize).shifted(new Vec(0, 2)),
        new Vec(12, 16).scaled(16, game.tileSize).shifted(new Vec(0, -2))
    )]);

    return player;
};