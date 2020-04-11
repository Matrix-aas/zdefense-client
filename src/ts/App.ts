import Game from "./Game";
import NetworkClientHandler from "./Network/NetworkClientHandler";

export default class App {
    public async init(): Promise<void> {
        await import('./Network/Packets');
        await import('./World/Entities/Livings');

        new NetworkClientHandler('ws://localhost:8081/');

        Game.instance.init();
    }
}
