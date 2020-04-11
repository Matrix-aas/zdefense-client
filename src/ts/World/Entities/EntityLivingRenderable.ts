import EntityLiving from "./EntityLiving";

export default abstract class EntityLivingRenderable extends EntityLiving {
    protected onHeadAngleChange(): void {
        super.onHeadAngleChange();
        this.stage.angle = this.headAngle;
    }
}
