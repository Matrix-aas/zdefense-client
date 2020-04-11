import * as PIXI from 'pixi.js';
import {entity} from "../Entity";
import Point from "../../../Helpers/Point";
import World from "../../World";
import Resources from "../../../Helpers/Resources";
import EntityLivingRenderable from "../EntityLivingRenderable";

@entity(1)
export default class EntityZombie extends EntityLivingRenderable {
    init(id: number, world: World): void {
        super.init(id, world);
        this.stage.addChild(this.mainSprite = new PIXI.Sprite(Resources.texture(Resources.WORLD.ZOMBIE)));
    }

    getMaxHealth(): number {
        return 100;
    }

    get size(): Point {
        return new Point(32, 32);
    }
}
