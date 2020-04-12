import Game from "../Game";
import NetworkClientHandler from "./NetworkClientHandler";
import EntityPlayerMP from "../World/Entities/Livings/EntityPlayerMP";

export default class NetworkManager {
    protected networkHandler: NetworkClientHandler = null;

    constructor() {
        (window as any).connectToServer = this.connect.bind(this);
    }

    public async connect(address: string, username: string): Promise<void> {
        this.disconnect();

        await new Promise((resolve, reject) => {
            try {
                const ws = new WebSocket(address);
                this.networkHandler = new NetworkClientHandler(ws, address, username, {
                    connected: (): void => {
                        resolve();
                    },
                    disconnected: (reason): void => {
                        this.onClosed(reason);
                        reject();
                    },
                    error: (e: Error): void => {
                        console.warn('Connection problems: ', e);
                        reject();
                    }
                });
            } catch (e) {
                this.disconnect();
                reject();
            }
        });
    }

    public disconnect(): void {
        if (this.isConnected()) {
            this.networkHandler.close();
        }
    }

    protected onClosed(reason: string): void {
        if (this.networkHandler) {
            if (reason) {
                console.warn(`Kicked: ${reason}`);
            }
            this.networkHandler = null;
            Game.instance.emit('network.disconnected');
        }
    }

    public isConnected(): boolean {
        return this.networkHandler !== null ? this.networkHandler.isConnected() : false;
    }

    public isInGame(): boolean {
        return this.isConnected() && this.getPlayer() !== null;
    }

    public async networkTick(): Promise<void> {
        if (this.isConnected()) {
            await this.networkHandler.process();
        }
    }

    public getPlayer(): EntityPlayerMP {
        return this.isConnected() ? this.networkHandler.getPlayer() : null;
    }

    public getNetworkHandler(): NetworkClientHandler {
        return this.networkHandler;
    }
}
