import { Server as SocketIOServer, Socket as SocketInstanceServer } from "socket.io";
export declare class Server {
    port: number;
    master: SocketIOServer;
    socketByClientId: Map<string, SocketInstanceServer<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
    constructor(port: number);
}
