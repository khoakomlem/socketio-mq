import { io as IOClient, Socket as SocketIOClient } from "socket.io-client"
import { RequestData, ResponseData } from "./types"
import { MethodKeys } from "./utils"

export class StaticClient {
	static id: string
	static url: string

	id: string
	url: string
	master: SocketIOClient
	declare remoteHandlers: Map<string, (...args: any) => Promise<any>>

	static instance: StaticClient

	static getInstance<T extends typeof StaticClient>(this: T) {
		if (!this.instance) {
			this.instance = new this()
		}
		return this.instance as InstanceType<T>
	}

	constructor(id?: string, url?: string) {
		// @ts-ignore
		this.id = id || this.constructor.id
		// @ts-ignore
		this.url = url || this.constructor.url

		if (!this.id) {
			throw new Error(
				"Client id is required. Make sure to pass it as first argument in constructor or set it as default value in class definition. Ex: new Client('service-a')"
			)
		}
		if (!this.url) {
			throw new Error(
				"Socket server url is required. Make sure to pass it as second argument in constructor or set it as default value in class definition. Ex: new Client('service-a', 'http://localhost:3000')"
			)
		}

		this.master = IOClient(this.url, {
			query: { id: this.id },
		})
		this.master.on("receive", async (data: RequestData, callback) => {
			// console.log("Received", data)
			try {
				const handler = this.remoteHandlers.get(data.event)
				if (!handler)
					throw new Error(`Method ${data.event} is not a remote handler`)

				const successData: ResponseData = {
					requestData: data,
					status: "success",
					data: await handler.bind(this)(...data.args),
				}
				callback(successData)
			} catch (error) {
				const failureData: ResponseData = {
					requestData: data,
					status: "error",
					error: {
						message: error.message,
						stack: error.stack,
					},
				}
				callback(failureData)
			}
		})
	}

	sendTo(id: string, event: string, ...args: any[]) {
		return new Promise<any>((resolve, reject) => {
			this.master.emit("send-to", id, { event, args }, (data: ResponseData) => {
				if (data.status === "success") {
					resolve(data.data)
				} else {
					reject(new Error(data.error.message))
				}
			})
		})
	}

	use<OtherClient extends typeof StaticClient>(
		otherClient: OtherClient,
		id?: string
	) {
		// TODO: ping here make sure the client is alive
		if (!id && !otherClient.getInstance().id) {
			throw new Error(
				"Client id is required. Make sure to pass it as first argument in constructor or set it as default value in class definition. Ex: new Client('service-a')"
			)
		}

		const senderClient = this
		// return new remote instance of clientB
		return new (function () {
			Object.getOwnPropertyNames(otherClient.prototype).forEach((key) => {
				const reservedKeys = ["constructor", "remoteHandlers"]
				if (reservedKeys.includes(key)) return
				this[key] = (...args: any[]) => {
					if (!otherClient.prototype.remoteHandlers.has(key)) {
						throw new Error(
							`Method ${key} is not an "remote handler" in ${otherClient.name}. Use @RemoteHandler decorator to make it remote.`
						)
					}
					return senderClient.sendTo(id, key, ...args)
				}
			})
			return
		})() as {
			[K in Exclude<
				MethodKeys<InstanceType<OtherClient>>,
				keyof StaticClient
			>]: InstanceType<OtherClient>[K] extends (...args: any[]) => any
				? (
						...args: Parameters<InstanceType<OtherClient>[K]>
				  ) => Promise<Awaited<ReturnType<InstanceType<OtherClient>[K]>>>
				: never
		}
	}
}
