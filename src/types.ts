export type RequestData = {
	event: string
	args: any[]
	from: string // sender ID or roomID
	to: string // receiver ID or roomID
}

export type ResponseData = {
	requestData: RequestData
} & (
	| {
			status: "success"
			data: any
	  }
	| {
			status: "error"
			error: {
				message: string
				stack: string
			}
	  }
)
