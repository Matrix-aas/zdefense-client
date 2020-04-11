import EntityPlayer from "./EntityPlayer";
import Packet3Chat from "../../../Network/Packets/Packet3Chat";
import NetworkHandler from "../../../Network/NetworkHandler";

export default class EntityPlayerMP extends EntityPlayer {
    protected networkHandler: NetworkHandler = null;

    public setNetworkHandler(networkHandler: NetworkHandler): void {
        this.networkHandler = networkHandler;
    }

    public getNetworkHandler(): NetworkHandler {
        return this.networkHandler;
    }

    public sendChatMessage(message: string): void {
        this.networkHandler.addPacketToQueue(new Packet3Chat(message));
    }
}
