export type MethodKeys<T> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

// export type TuppleRemoteHandler<T extends Client> = {
// 	[K in Exclude<keyof T, keyof Client>]: T[K] extends (
// 		...args: infer Params
// 	) => infer Return
// 		? { params: Params; return: Return }
// 		: never
// }

export function RemoteHandler<T extends (...args: any) => any>(
	target: any,
	key: string,
	descriptor: TypedPropertyDescriptor<T>
) {
	const originalMethod = descriptor.value
	target.remoteHandlers =
		target.remoteHandlers || new Map<string, (...args: any) => any>()
	target.remoteHandlers.set(key, originalMethod)

	return descriptor
}
