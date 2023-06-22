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

    game.ecs.addComponent(zombie, components.SpeedComponent, [
        (playerVelocity / 3) + (playerVelocity / 3) * (game.level / Game.maxLevel)
    ]);

    game.ecs.addComponent(zombie, components.FollowComponent, [
        game.player, (game.roomSize.x / 2) + (game.roomSize.x / 2) * game.level / Game.maxLevel
    ]);

    game.ecs.addComponent(zombie, components.HealthComponent, [
        10 + 110 * (game.level / Game.maxLevel),
        game,
        zombie
    ]);

    const minTimeBetweenHits = 1000 - 500 * game.level / Game.maxLevel;

    game.ecs.addComponent(zombie, components.HunterComponent, [game.player, [
        minTimeBetweenHits,
        minTimeBetweenHits + 1000
    ]]);

    const minTimeUntilRespawn = 8000 - 5000 * game.level / Game.maxLevel;

    game.ecs.addComponent(zombie, components.RespawnableComponent, [[
        minTimeUntilRespawn,
        minTimeUntilRespawn + 5000
    ]]);

    //console.log(`zombie settings:\nspeed = ${game.ecs.getComponent(zombie, components.SpeedComponent).velocity}\nmax follow dist = ${game.ecs.getComponent(zombie, components.FollowComponent).maxTiles}\nhealth = ${game.ecs.getComponent(zombie, components.HealthComponent).maxHealth}\ntime between hits = ${game.ecs.getComponent(zombie, components.HunterComponent).timeBetweenHitsRange}\nrespawn = ${game.ecs.getComponent(zombie, components.RespawnableComponent).timeUntilRespawnRange}`)

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
    game.ecs.addComponent(zombie, components.ParticleColourComponent, ["#bb0000"]);
};