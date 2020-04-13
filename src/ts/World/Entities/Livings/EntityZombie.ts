import * as PIXI from 'pixi.js';
import {entity} from "../Entity";
import World from "../../World";
import Resources from "../../../Helpers/Resources";
import EntityLivingRenderable from "../EntityLivingRenderable";

@entity(1)
export default class EntityZombie extends EntityLivingRenderable {
    init(id: number, world: World): void {
        super.init(id, world);
        this.size.set(32, 32);
        this.stage.addChild(this.mainSprite = new PIXI.Sprite(Resources.texture(Resources.WORLD.ZOMBIE)));
    }

    protected onHeadAngleChange(): void {
        super.onHeadAngleChange();
        if (this.mainSprite) {
            this.mainSprite.angle = this.headAngle;
        }
    }

    getMaxHealth(): number {
        return 100;
    }
}
