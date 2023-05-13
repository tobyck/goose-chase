/* 
 * systems/render.ts
 *
 * The system responsible for rendering every single entity in the game.
 * Properties of the image component can be changed in other 
 * systems to create animations, because this systems renders whichever 
 * part of the image is specified in the component at the time of rendering.
 */

import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";

export class RenderSystem extends System {
    constructor() {
        super([
            components.PositionComponent,
            components.ImageComponent,
        ], SystemTrigger.Tick, (game, entity) => {
            // get the position and speed components
            const positionComponent = game.ecs.getComponent(entity, components.PositionComponent);
            const imageComponent = game.ecs.getComponent(entity, components.ImageComponent);

            // draw the image at the specified position
            game.ctx.drawImage(
                imageComponent.image,
                imageComponent.frame.x,
                imageComponent.frame.y,
                imageComponent.frame.width,
                imageComponent.frame.height,
                positionComponent.pixels.x,
                positionComponent.pixels.y,
                imageComponent.dest.x ?? game.tileSize,
                imageComponent.dest.y ?? game.tileSize
            );

            // if holding the h key and the entity has a hitbox, render the hitbox
            if (game.keys["h"] && game.ecs.hasComponent(entity, components.HitboxComponent)) {
                const hitbox = game.ecs.getComponent(entity, components.HitboxComponent)
                    .getActualHitbox(positionComponent);

                game.ctx.strokeStyle = "#ff2222";
                game.ctx.lineWidth = Math.ceil(game.tileSize / 90);
                game.ctx.strokeRect(
                    hitbox.x,
                    hitbox.y,
                    hitbox.width,
                    hitbox.height
                );
            }
        });
    }
}