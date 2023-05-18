import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";

export class WeaponSystem extends System {
    constructor() {
        super([
            components.WeaponComponent
        ], SystemTrigger.Tick, (game, entity) => {
            const weapon = game.ecs.getComponent(entity, components.WeaponComponent);

            if (weapon.frameCount < weapon.totalFrames) {
                weapon.frameCount++;

                const weaponImage = game.ecs.getComponent(entity, components.ImageComponent);

                const holderPosition = game.ecs.getComponent(weapon.holder, components.PositionComponent);
                const holderCentre = holderPosition.pixels.centred(game.tileSize);

                // save the current context state
                game.ctx.save();

                // move the context's origin to the center of the holder
                game.ctx.translate(
                    weapon.pivotPointOffset.x + holderCentre.x,
                    weapon.pivotPointOffset.y + holderCentre.y
                );

                // rotate the context around the top left corner of where it was just moved to
                game.ctx.rotate(
                    weapon.startAngle + weapon.swingRadians * weapon.frameCount / weapon.totalFrames
                );

                // draw the weapon on the rotated context
                game.ctx.drawImage(
                    weaponImage.image,
                    weaponImage.frame.x,
                    weaponImage.frame.y,
                    weaponImage.frame.width,
                    weaponImage.frame.height,

                    // move the weapon up so it pivots around the bottom left corner of the weapon
                    0, -game.tileSize * .8,

                    // scale the weapon down a bit
                    game.tileSize * .8,
                    game.tileSize * .8
                );

                // restore the context to what it was before the weapon was drawn
                game.ctx.restore();
            }
        });
    }
}