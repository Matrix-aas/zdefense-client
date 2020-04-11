import EntityLiving from "../EntityLiving";
import {entity} from "../Entity";
import Point from "../../../Helpers/Point";
import World from "../../World";
import Resources from "../../../Helpers/Resources";

@entity(2)
export default class EntityZombie extends EntityLiving {
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
