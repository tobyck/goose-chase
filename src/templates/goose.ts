import * as components from "../components";
import { Entity } from "../engine/ecs";
import Game from "../game";
import { Rect, setRandomEntityPos, Vec } from "../helpers";

export const newGooseEntity = (game: Game, roomPos: Vec): Entity => {
    const goose = game.ecs.createEntity();

    game.ecs.addComponent(goose, components.AlwaysUpdateComponent);

    game.ecs.addComponent(goose, components.ImageComponent, [
        game.getImage("goose"),
        new Rect(0, 0, 16, 16)
    ]);

    game.ecs.addComponent(goose, components.HitboxComponent, [Rect.fromVecs(
        new Vec(2, 0).scaled(16, game.tileSize).shifted(new Vec(0, 2)),
        new Vec(12, 16).scaled(16, game.tileSize).shifted(new Vec(0, -2))
    )]);

    setRandomEntityPos(game, game.roomAt(roomPos), goose);

    // health between 50 and 100 relative to level
    game.ecs.addComponent(goose, components.HealthComponent, [game.level / Game.maxLevel * 50 + 50, game, goose]);

    // speed between 0.4 and 2.4 relative to level
    game.ecs.addComponent(goose, components.SpeedComponent, [game.level / Game.maxLevel * 1.3 + .4]);

    game.ecs.addComponent(goose, components.WalkingComponent, [false]);
    game.ecs.addComponent(goose, components.EvaderComponent, [game.player]);
    game.ecs.addComponent(goose, components.ParticleColourComponent, ["#bb0000"]);

    return goose;
};