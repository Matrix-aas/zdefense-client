import * as PIXI from 'pixi.js';
import Point from "../../../Helpers/Point";
import ArrayBufferStream from "../../../Network/ArrayBufferStream";
import {Packet} from "../../../Network/Packets/Packet";
import World from "../../World";
import Resources from "../../../Helpers/Resources";
import EntityLivingRenderable from "../EntityLivingRenderable";

export default class EntityPlayer extends EntityLivingRenderable {
    protected username: string;

    init(id: number, world: World): void {
        super.init(id, world);
        this.stage.addChild(this.mainSprite = new PIXI.Sprite(Resources.texture(Resources.WORLD.PLAYER)));
    }

    public getMaxHealth(): number {
        return 100;
    }

    public get size(): Point {
        return new Point(32, 32);
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
