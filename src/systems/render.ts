/* 
 * systems/render.ts
 *
 * The system responsible for rendering every single entity in the game.
 * Properties of the image component can be changed in other 
 * systems to create animations, because this systems renders whichever 
 * part of the image is specified in the component at the time of rendering.
 */

import * as components from "../components/components";
import { System, SystemTrigger } from "../engine/ecs";

export class RenderSystem extends System {
    constructor() {
        super(
            [
                components.PositionComponent,
                components.ImageComponent,
            ],
            SystemTrigger.Render, // run every frame
            (game, entity) => {
                const positionComponent = game.ecs
                    .getComponent(entity, components.PositionComponent);

                const imageComponent = game.ecs
                    .getComponent(entity, components.ImageComponent);

                game.ctx.drawImage(
                    imageComponent.image,
                    imageComponent.sx,
                    imageComponent.sy,
                    imageComponent.sw,
                    imageComponent.sh,
                    positionComponent.position.x,
                    positionComponent.position.y,
                    game.tileWidth,
                    game.tileWidth
                );
            }
        );
    }
}