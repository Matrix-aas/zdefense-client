import Game from "../Game";
import NetworkClientHandler from "./NetworkClientHandler";

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

    public async networkTick(): Promise<void> {
        if (this.isConnected()) {
            await this.networkHandler.process();
        }
    }
}
