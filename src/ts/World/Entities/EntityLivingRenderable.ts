import EntityLiving from "./EntityLiving";
import MathUtils from "../../Helpers/MathUtils";

export default abstract class EntityLivingRenderable extends EntityLiving {
    protected onHeadAngleChange(): void {
        super.onHeadAngleChange();
        this.stage.angle = MathUtils.toDegree(this.headAngle);
    }
}
