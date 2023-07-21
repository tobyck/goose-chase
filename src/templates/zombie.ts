import * as components from "../components";
import { Room } from "../engine/room";
import { Rect, setRandomEntityPos, Vec } from "../helpers";
import Game from "../game";

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

    const playerVelocity = game.ecs.getComponent(game.player, components.SpeedComponent).velocity;

    // between playerVelocity / 3 and 2 * playerVelocity / 3 relative to level
    game.ecs.addComponent(zombie, components.SpeedComponent, [
        (playerVelocity / 3) + (playerVelocity / 3) * (game.level / Game.maxLevel)
    ]);

    game.ecs.addComponent(zombie, components.FollowComponent, [
        game.player, (game.roomSize.x / 2) + (game.roomSize.x / 2) * game.level / Game.maxLevel
    ]);

    // health between 20 and 70 relative to level
    game.ecs.addComponent(zombie, components.HealthComponent, [
        70 * (game.level / Game.maxLevel) + 20,
        game,
        zombie
    ]);

    const minTimeBetweenHits = 1000 - 500 * game.level / Game.maxLevel;

    game.ecs.addComponent(zombie, components.HunterComponent, [
        game.player,
        [
            minTimeBetweenHits,
            minTimeBetweenHits + 1000,
        ],
        1.5
    ]);

    const minTimeUntilRespawn = 8000 - 5000 * game.level / Game.maxLevel;

    game.ecs.addComponent(zombie, components.RespawnableComponent, [[
        minTimeUntilRespawn,
        minTimeUntilRespawn + 5000
    ]]);

    // make a sword for the zombie
    // todo: make relative to level

    const sword = game.ecs.createEntity();

    game.ecs.addComponent(sword, components.ImageComponent, [
        game.getImage("items"),
        new Rect(16, 32, 16, 16)
    ]);

    game.ecs.addComponent(sword, components.PositionComponent, [
        new Vec(game.canvas.width, game.canvas.height), room.pos
    ]);

    game.ecs.addComponent(sword, components.HoldableComponent);
    game.ecs.addComponent(sword, components.WeaponComponent, [10]); // sword does 10 damage

    game.ecs.addComponent(zombie, components.HandsComponent, [sword, null]);
    game.ecs.addComponent(zombie, components.WalkingComponent, [false]);
    game.ecs.addComponent(zombie, components.ParticleColourComponent, ["#bb0000"]);
};