import {
	Server as SocketIOServer,
	Socket as SocketInstanceServer,
} from "socket.io"
import { RequestData } from "./types"

export class Server {
	master: SocketIOServer
	socketByClientId = new Map<string, SocketInstanceServer>()

	constructor(public port: number) {
		this.master = new SocketIOServer(port)

		this.master
			.use((socket, next) => {
				socket.data.id = socket.handshake.query.id
				this.socketByClientId.set(socket.data.id, socket)
				next()
			})
			.on("connection", (socket) => {
				console.log(`Socket ${socket.data.id} connected!`)
				socket.on(
					"send-to",
					async (id: string, data: RequestData, callback) => {
						data.from = socket.data.id
						data.to = id
						const destSocket = this.socketByClientId.get(id)
						if (!destSocket) {
							return callback({
								status: "error",
								error: {
									message: `Client with id ${id} not found`,
								},
							})
						}
						// console.log("sending", id, data)
						destSocket.emit("receive", data, callback)
					}
				)

				socket.on("broad-cast", (data: RequestData) => {
					data.from = socket.data.id
					data.to = "all"
					this.master.emit("receive", data)
				})
			})
	}
}
