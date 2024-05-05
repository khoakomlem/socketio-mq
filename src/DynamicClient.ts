import { io as IOClient, Socket as SocketIOClient } from "socket.io-client"
import { RequestData, ResponseData } from "./types"

type BaseEventMap = {
	[key: string]: (...args: any) => Promise<any>
	// "*": (...args: any) => Promise<any>
}

export class DynamicClient<EventMap extends Record<string, Function>> {
	master: SocketIOClient
	remoteHandlers = new Map<string, (...args: any) => Promise<any>>()

	constructor(public id: string, public url: string) {
		this.master = IOClient(url, {
			query: { id },
		})
		this.master.on("receive", async (data: RequestData, callback) => {
			try {
				const handler = this.remoteHandlers.get(data.event)
				if (!handler)
					throw new Error(`Handler for event "${data.event}" is not found!`)

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
					console.log(
						`Error while sending event "${data.requestData.event}" from "${
							data.requestData.from
						}" -> "${data.requestData.to}" with payload ${JSON.stringify(
							data.requestData.args
						)}: ${data.error.message}`
					)
					reject(new Error(data.error.message))
				}
			})
		})
	}

	use<OtherEventMap extends BaseEventMap>(id: string) {
		// TODO: ping here make sure the client is alive

		const client = this

		return new Proxy(
			{},
			{
				get(target, prop, receiver) {
					return async (...args: any[]) =>
						client.sendTo(id, prop as string, ...args)
				},
			}
		) as OtherEventMap
	}

	useSelf() {
		const client = this

		return new Proxy(
			{},
			{
				get(target, prop, receiver) {
					return async (...args: any[]) => {
						const handler = client.remoteHandlers.get(prop as string)
						if (!handler) {
							throw new Error(
								`Client "${client.id}" does not have a handler for event "${
									prop as string
								}". Make sure to call the "on" method to register the handler!`
							)
						}
						return handler.bind(client)(...args)
					}
				},
			}
		) as EventMap
	}

	on<EventKey extends keyof EventMap>(
		eventKey: EventKey,
		handler: EventMap[EventKey]
	) {
		// @ts-ignore
		this.remoteHandlers.set(eventKey as string, handler)
	}
}
