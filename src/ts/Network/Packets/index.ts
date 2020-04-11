import {Packet} from "./Packet";
import Packet1Handshake from "./Packet1Handshake";
import Packet2WorldInfo from "./Packet2WorldInfo";
import Packet3Chat from "./Packet3Chat";
import Packet4SpawnEnitity from "./Packet4SpawnEnitity";
import Packet5DamageEntity from "./Packet5DamageEntity";
import Packet6MoveEntity from "./Packet6MoveEntity";
import Packet255Kicked from "./Packet255Kicked";

Packet.registerPacket(Packet1Handshake);
Packet.registerPacket(Packet2WorldInfo);
Packet.registerPacket(Packet3Chat);
Packet.registerPacket(Packet4SpawnEnitity);
Packet.registerPacket(Packet5DamageEntity);
Packet.registerPacket(Packet6MoveEntity);
Packet.registerPacket(Packet255Kicked);
