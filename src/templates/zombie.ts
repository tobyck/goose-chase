import * as components from "../components";
import { Room } from "../engine/room";
import { Rect, setRandomEntityPos, Vec } from "../helpers";
import Game from "../main";

export const newZombieEntity = (game: Game, room: Room) => {
    const zombie = game.ecs.createEntity();

    game.ecs.addComponent(zombie, components.ImageComponent, [
        game.getImage("zombie"),
        new Rect(0, 0, 16, 16)
    ]);

    game.ecs.addComponent(zombie, components.HitboxComponent, [Rect.fromVecs(
        new Vec(2, 0).scaled(16, game.tileSize).shifted(new Vec(0, 2)),
        new Vec(12, 16).scaled(16, game.tileSize).shifted(new Vec(0, -2))
    )]);

    setRandomEntityPos(game, room, zombie);

    // TODO: make relative to level
    game.ecs.addComponent(zombie, components.SpeedComponent, [1]);
    game.ecs.addComponent(zombie, components.FollowComponent, [game.player, 10]);
    game.ecs.addComponent(zombie, components.HealthComponent, [50, game, zombie]);
    game.ecs.addComponent(zombie, components.HunterComponent, [game.player, [1000, 2000]]);
    game.ecs.addComponent(zombie, components.RespawnableComponent, [[5000, 10000]]);

    // make a stick for the zombie

    const stick = game.ecs.createEntity();

    game.ecs.addComponent(stick, components.ImageComponent, [
        game.getImage("items"),
        new Rect(0, 16, 16, 16)
    ]);

    game.ecs.addComponent(stick, components.PositionComponent, [
        new Vec(game.canvas.width, game.canvas.height), room.pos
    ]);

    game.ecs.addComponent(stick, components.HoldableComponent);
    game.ecs.addComponent(stick, components.WeaponComponent, [5]);

    game.ecs.addComponent(zombie, components.HandsComponent, [stick, null]);
    game.ecs.addComponent(zombie, components.WalkingComponent, [false]);
    game.ecs.addComponent(zombie, components.ParticleColorComponent, ["#bb0000"]);
};