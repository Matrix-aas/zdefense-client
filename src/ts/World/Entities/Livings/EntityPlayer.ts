import * as PIXI from 'pixi.js';
import Point from "../../../Helpers/Point";
import ArrayBufferStream from "../../../Network/ArrayBufferStream";
import {Packet} from "../../../Network/Packets/Packet";
import World from "../../World";
import Resources from "../../../Helpers/Resources";
import EntityLivingRenderable from "../EntityLivingRenderable";

export default class EntityPlayer extends EntityLivingRenderable {
    protected username: string;
    protected usernameText: PIXI.Text;
    protected rect: PIXI.Graphics;

    init(id: number, world: World): void {
        super.init(id, world);
        this.stage.addChild(this.mainSprite = new PIXI.Sprite(Resources.texture(Resources.WORLD.PLAYER)));

        this.usernameText = new PIXI.Text(this.username, {
            fontSize: 14,
        });

        this.rect = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, 0, this.size.x, this.size.y).endFill();

        this.stage.addChild(this.usernameText);
        this.stage.addChild(this.rect);
    }

    public getMaxHealth(): number {
        return 100;
    }

    public get size(): Point {
        return new Point(32, 32);
    }

    tick(delta: number): void {
        super.tick(delta);
        this.usernameText.position.set(this.positionCenter.x + this.usernameText.width / 2, this.position.y);
        this.rect.position.set(this.position.x, this.position.y);
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
