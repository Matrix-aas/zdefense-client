import {Packet, packet, PacketSide} from "./Packet";
import ArrayBufferStream from "../ArrayBufferStream";
import Entity from "../../World/Entities/Entity";

@packet(4, PacketSide.CLIENT)
export default class Packet4SpawnEnitity extends Packet {
    private data: ArrayBufferStream;
    private _entity: Entity = null;

    constructor(entity?: Entity) {
        super();
        this._entity = entity || null;
        if (this._entity) {
            this._entity.writeEntityToBuffer(this.data);
        }
    }

    public readData(buffer: ArrayBufferStream): void {
        const len = buffer.readUInt();
        const data = buffer.read(len);
        this.data = new ArrayBufferStream(data);
    }

    public writeData(buffer: ArrayBufferStream): void {
        if (this.data) {
            buffer.writeUInt(this.data.size());
            buffer.write(this.data.toArrayBuffer(), 0, this.data.size());
        }
    }

    public getEntity(): Entity {
        if (!this._entity) {
            this._entity = Entity.createEntityFromBuffer(this.data);
        }
        return this._entity;
    }
}
