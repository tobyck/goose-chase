/* 
 * systems/healthbar.ts
 *
 * Renders all the health bars for entities that have a health component.
 * This is done after the main renderer so that the health bars are always
 * on top of the entities and visible.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";

export class HealthBarSystem extends System {
    constructor() {
        super([
            components.HealthComponent,
            components.PositionComponent
        ], SystemTrigger.Tick, (game, entity) => {
            const healthComponent = game.ecs.getComponent(entity, components.HealthComponent);
            const positionComponent = game.ecs.getComponent(entity, components.PositionComponent);

            const renderHealthBar = (colour: string, amount: number) => {
                game.ctx.fillStyle = colour;

                game.ctx.fillRect(
                    positionComponent.pixels.x,
                    positionComponent.pixels.y + game.tileSize + 4, // 4 pixels below the entity
                    game.tileSize * amount,
                    game.tileSize / 8
                );
            }

            // render a grey underlay
            renderHealthBar("#ccc", 1);

            // make the health bar go from green to red as the health decreases
            // the math will make sense if you look at a hsl colour picker
            renderHealthBar(
                `hsl(${healthComponent.health / healthComponent.maxHealth * 100}, 100%, 50%)`,
                healthComponent.health / healthComponent.maxHealth
            );
        });
    }
}