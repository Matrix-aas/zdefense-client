import NetworkHandler from "./NetworkHandler";
import {Packet} from "./Packets/Packet";

export default class NetworkClientHandler extends NetworkHandler {
    constructor(address: string) {
        super(new WebSocket(address), address);
    }

    onConnect(): void {
        super.onConnect();
        console.log('Connected!');
    }

    onDisconnect(): void {
        super.onDisconnect();
        console.log('Disconnected!');
    }

    onError(e: Error): void {
        super.onError(e);
        console.warn('Error!', e);
    }

    protected handlePacket(packet: Packet): void {
        console.log(packet);
    }
}
