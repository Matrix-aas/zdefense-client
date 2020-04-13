import * as PIXI from 'pixi.js';
import ArrayBufferStream from "../../../Network/ArrayBufferStream";
import {Packet} from "../../../Network/Packets/Packet";
import World from "../../World";
import Resources from "../../../Helpers/Resources";
import EntityLivingRenderable from "../EntityLivingRenderable";

export default class EntityPlayer extends EntityLivingRenderable {
    protected username: string;
    protected usernameText: PIXI.Text;

    constructor() {
        super();
        this.size.set(32, 32);
    }

    init(id: number, world: World): void {
        super.init(id, world);
        this.stage.addChild(this.mainSprite = new PIXI.Sprite(Resources.texture(Resources.WORLD.PLAYER)));

        this.usernameText = new PIXI.Text(this.username, {
            fontSize: 14,
        });
        this.usernameText.y -= 22;

        this.stage.addChild(this.usernameText);
    }

    public getMaxHealth(): number {
        return 100;
    }

    protected onHeadAngleChange(): void {
        super.onHeadAngleChange();
        if (this.mainSprite) {
            this.mainSprite.angle = this.headAngle;
        }
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    writeDataToBuffer(outputBuffer: ArrayBufferStream): void {
        super.writeDataToBuffer(outputBuffer);
        Packet.writeString(this.username, outputBuffer);
    }

    readDataFromBuffer(inputBuffer: ArrayBufferStream): void {
        super.readDataFromBuffer(inputBuffer);
        this.username = Packet.readString(inputBuffer);
    }
}
