"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteHandler = void 0;
// export type TuppleRemoteHandler<T extends Client> = {
// 	[K in Exclude<keyof T, keyof Client>]: T[K] extends (
// 		...args: infer Params
// 	) => infer Return
// 		? { params: Params; return: Return }
// 		: never
// }
function RemoteHandler(target, key, descriptor) {
    var originalMethod = descriptor.value;
    target.remoteHandlers =
        target.remoteHandlers || new Map();
    target.remoteHandlers.set(key, originalMethod.bind(target));
    return descriptor;
}
exports.RemoteHandler = RemoteHandler;
