import ArrayBufferStream from "./ArrayBufferStream";
import {Packet, PacketSide} from "./Packets/Packet";

class UnknownMessageTypeError extends Error {
}

export default abstract class NetworkHandler {
    protected socket: WebSocket = null;
    private address: string;

    private packetsToProcess: Packet[] = [];
    private packetsToSend: Packet[] = [];

    constructor(webSocket: WebSocket, address: string) {
        this.socket = webSocket;
        this.address = address;

        this.socket.addEventListener('message', (message: MessageEvent) => {
            try {
                this.handleMessage(message);
            } catch (e) {
                this._onError(e);
            }
        });

        this.socket.addEventListener('open', this.onConnect.bind(this));
        this.socket.addEventListener('close', this.onDisconnect.bind(this));
        this.socket.addEventListener('error', this._onError.bind(this));
    }

    public getAddress(): string {
        return this.address;
    }

    public isConnected(): boolean {
        return this.socket.readyState === WebSocket.OPEN;
    }

    public close(): void {
        if (this.isConnected()) {
            this.socket.close();
        }
    }

    public onConnect(): void {
        //
    }

    public onDisconnect(): void {
        //
    }

    private _onError(e: Error): void {
        if (e instanceof UnknownMessageTypeError) {
            this.close();
            return;
        }

        this.onError(e);
        this.close();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public onError(e: Error): void {
        //
    }

    private handleMessage(message: MessageEvent): void {
        if (!this.isConnected()) {
            return;
        }

        if (!(message.data instanceof Blob)) {
            throw new UnknownMessageTypeError();
        }

        message.data.arrayBuffer().then((buffer: ArrayBuffer) => {
            const packet = Packet.createPacketFromStream(new ArrayBufferStream(buffer), PacketSide.CLIENT);
            this.packetsToProcess.push(packet);
        });
    }

    public async process(): Promise<void> {
        if (!this.isConnected()) {
            return;
        }

        await this.networkTick();

        let processDone = false;

        const processThread = async (): Promise<void> => {
            let packet;
            while (this.isConnected() && (packet = this.packetsToProcess.shift()) instanceof Packet) {
                try {
                    this.handlePacket(packet);
                } catch (e) {
                    this._onError(e);
                }
            }

            processDone = true;
        };

        const sendThread = async (): Promise<void> => {
            await new Promise(resolve => {
                const doSend = (): void => {
                    let packet;
                    while (this.isConnected() && (packet = this.packetsToSend.shift()) instanceof Packet) {
                        try {
                            this.sendPacketToSocket(packet);
                        } catch (e) {
                            this._onError(e);
                        }
                    }

                    if (!processDone && this.isConnected()) {
                        setTimeout(doSend.bind(this), 0);
                    } else {
                        resolve();
                    }
                };
                doSend();
            });
        };

        await Promise.all([processThread(), sendThread()]);
    }

    protected abstract handlePacket(packet: Packet): void;

    protected async networkTick(): Promise<void> {
        //
    }

    public addPacketToQueue(packet: Packet): void {
        if (!this.isConnected()) {
            return;
        }

        if (!packet) {
            throw new Error('Packet can\'t be null!');
        }

        this.packetsToSend.push(packet);
    }

    private sendPacketToSocket(packet: Packet): void {
        NetworkHandler.sendPacketToSocket(packet, this.socket);
    }

    public static sendPacketToSocket(packet: Packet, socket: WebSocket): void {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(packet.writePacketToStream(new ArrayBufferStream()).toArrayBuffer());
        }
    }
}
