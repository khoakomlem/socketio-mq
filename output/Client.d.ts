import { Socket as SocketIOClient } from "socket.io-client";
import { MethodKeys } from "./utils";
export declare class Client {
    id: string;
    url: string;
    master: SocketIOClient;
    remoteHandlers: Map<string, (...args: any) => Promise<any>>;
    constructor(id: string, url: string);
    sendTo(id: string, event: string, ...args: any[]): Promise<any>;
    use<OtherClient extends typeof Client>(otherClient: OtherClient, id: string): { [K in Exclude<MethodKeys<InstanceType<OtherClient>>, keyof Client>]: InstanceType<OtherClient>[K] extends (...args: any[]) => any ? (...args: Parameters<InstanceType<OtherClient>[K]>) => Promise<ReturnType<InstanceType<OtherClient>[K]>> : never; };
}
