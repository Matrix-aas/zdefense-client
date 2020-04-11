import NetworkHandler from "./NetworkHandler";
import {Packet} from "./Packets/Packet";
import Packet1Handshake from "./Packets/Packet1Handshake";
import Packet255Kicked from "./Packets/Packet255Kicked";
import Packet4SpawnEnitity from "./Packets/Packet4SpawnEnitity";
import Packet2WorldInfo from "./Packets/Packet2WorldInfo";
import Packet3Chat from "./Packets/Packet3Chat";
import Packet5DamageEntity from "./Packets/Packet5DamageEntity";
import Game from "../Game";
import World from "../World/World";
import EntityPlayer from "../World/Entities/Livings/EntityPlayer";
import EntityRenderable from "../World/Entities/EntityRenderable";

export interface ConnectionInformationHandlers {
    connected?: () => void;
    disconnected?: (reason: string) => void;
    error?: (e: Error) => void;
}

export default class NetworkClientHandler extends NetworkHandler {
    public static readonly PROTOCOL_VERSION = 1;

    protected username: string;

    protected kickedReason: string = null;

    private connInfHandlers: ConnectionInformationHandlers = null;

    constructor(webSocket: WebSocket, address: string, username: string, connInfHandlers?: ConnectionInformationHandlers) {
        super(webSocket, address);
        this.username = username;
        this.connInfHandlers = connInfHandlers;
    }

    onConnect(): void {
        super.onConnect();
        if (this.connInfHandlers && this.connInfHandlers.connected) {
            this.connInfHandlers.connected();
        }
        this.addPacketToQueue(new Packet1Handshake(NetworkClientHandler.PROTOCOL_VERSION, this.username));
    }

    onDisconnect(): void {
        super.onDisconnect();
        if (this.connInfHandlers && this.connInfHandlers.disconnected) {
            this.connInfHandlers.disconnected(this.kickedReason);
        }
    }

    onError(e: Error): void {
        super.onError(e);
        if (this.connInfHandlers && this.connInfHandlers.error) {
            this.connInfHandlers.error(e);
        }
    }

    protected handlePacket(packet: Packet): void {
        if (packet instanceof Packet255Kicked) {
            this.kickedReason = packet.getReason();
            this.close();
        } else if (packet instanceof Packet2WorldInfo) {
            if (World.WORLD_VERSION < packet.getVersion()) {
                throw new Error('Client out of date!');
            } else if (World.WORLD_VERSION > packet.getVersion()) {
                throw new Error('Server out of date!');
            }
            const entityPlayer = Game.instance.getWorld().getEntity(packet.getPlayerEntityId());
            if (entityPlayer instanceof EntityPlayer) {
                console.log('Current player found!');
            } else {
                console.log('Hmmmm....');
            }
        } else if (packet instanceof Packet3Chat) {
            console.log(`[CHAT] ${packet.getMessage()}`);
        } else if (packet instanceof Packet4SpawnEnitity) {
            const entity = packet.getEntity();
            if (entity) {
                Game.instance.getWorld().spawnEntity(entity as EntityRenderable, entity.id);
            } else {
                throw new Error('Spawn Entity is null!');
            }
        } else if (packet instanceof Packet5DamageEntity) {
            console.log(packet);
        } else {
            console.log(packet);
        }
    }

    public getKickedReason(): string {
        return this.kickedReason;
    }
}
