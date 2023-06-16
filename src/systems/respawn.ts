import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";
import { anyHitboxesCollide, setRandomEntityPos } from "../helpers";

export default class RespawnSystem extends System {
    constructor() {
        super([], SystemTrigger.Tick, game => {
            for (const entity of game.toRespawn) {
                const respawnable = game.ecs.getComponent(entity, components.RespawnableComponent);

                // if the entity has been dead for long enough, respawn it
                if (performance.now() - respawnable.timeOfDeath > respawnable.timeUntilRespawn) {
                    // un-hide the entity
                    game.ecs.removeComponent(entity, components.HiddenComponent);

                    // heal the entity to full health
                    const health = game.ecs.getComponent(entity, components.HealthComponent);
                    health.heal(health.maxHealth);

                    // if the entity is colliding with anything, move it to a random position
                    const position = game.ecs.getComponent(entity, components.PositionComponent);

                    if (anyHitboxesCollide(game, entity)) {
                        setRandomEntityPos(game, game.roomAt(position.room), entity);
                    }

                    game.ecs.bringToFront(entity);

                    // remove it from the list of entities to respawn
                    game.toRespawn.splice(game.toRespawn.indexOf(entity), 1);
                }
            }
        });
    }
}