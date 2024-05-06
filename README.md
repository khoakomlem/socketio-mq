
# socketio-mq

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fkhoakomlem%2Fsocketio-mq%2F&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=Visitors&edge_flat=true)](https://hits.seeyoufarm.com)
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://i.ibb.co/DbGgp7v/iconm.png" alt="Logo" width="80" >
  </a>
  <h3 align="center">SOCKET.IO MQ</h3>

  <p align="center">
    An integration of typing with Socket.IO and message queue
    <br />
    <br />
    <a href="https://codesandbox.io/p/devbox/eager-cohen-srcycy">View Demo</a>
    ·
    <a href="https://github.com/khoakomlem/socketio-mq/issues">Report Bug</a>
    ·
    <a href="https://github.com/khoakomlem/socketio-mq/issues">Request Feature</a>
  </p>
</div>

## Overview

`socketio-mq` is a library that combines typing with Socket.IO and message queues to provide a structured and efficient way of handling real-time communication and event-driven architecture. It allows you to define typed events and messages, ensuring type safety and improving the development experience.

## Features

- Typed events and messages: Define events and messages with specific types, enabling type checking and autocompletion.
- Integration with Socket.IO: Seamlessly integrate with Socket.IO for real-time communication between clients and servers.
- TypeScript support: Written in TypeScript, providing type safety and enhanced developer productivity.

## Installation

With npm:

```bash
npm install socketio-mq
```

With yarn:

```bash
yarn add socketio-mq
```

## Usage

### StaticClient

Use **StaticClient** when you want to build something in class and use OOP features like inheritance

```typescript
import { RemoteHandler, StaticClient, Server } from "socketio-mq"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

class ServiceA extends StaticClient {
 static id = "service-a"
 static url = "http://localhost:3000"

 // Use @RemoteHandler for register method as "remote-able" or else these methods will be recognize as not "remote-able" and throw error if trying to use remote
 @RemoteHandler
 async getPosts(userID: number) {
  await delay(1000)
  return ["post1", "post2", "post3"]
 }
}

class ServiceB extends StaticClient {
 @RemoteHandler
 async getUser(id: number) {
  await delay(1000)
  return { id, name: "John Doe" }
 }
}

const server = new Server(3000)

const serviceA = ServiceA.getInstance() // Singleton support (ip and url is defined in class)
const serviceB = new ServiceB("service-b", "http://localhost:3000") // Construct new instance (will override "ip" or "url" if you specific in constructor params)

const remoteB = serviceA.use(ServiceB, "service-b") // Create remote service B

;(async () => {
 const user = await remoteB.getUser(1) // remote call
 const post = await serviceA.getPosts(1) // normal call

 console.log(`user: ${JSON.stringify(user)}, post: ${post}`)
})()
```

### DynamicClient

Use **DynamicClient** when you want to build something flexible, register handler anywhere, anytime

```javascript
import { DynamicClient, Server } from "socketio-mq"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Define events map first

type EventMapA = {
 getPosts: (userID: number) => Promise<string[]>
}

type EventMapB = {
 getUser: (id: number) => Promise<{ id: number; name: string }>
}

const server = new Server(3000)
const serviceA = new DynamicClient<EventMapA>(
 "service-a",
 "http://localhost:3000"
)
const serviceB = new DynamicClient<EventMapB>(
 "service-b",
 "http://localhost:3000"
)

serviceB.on("getUser", async (id: number) => {
 await delay(1000)
 return { id, name: "John Doe" }
})

// We will not register handler for "getPosts" here to see error!
// a.on("getPosts", async (userID: number) => {
//  await delay(1000)
//  return ["post1", "post2", "post3"]
// })
;(async () => {
 const remoteB = serviceA.use<EventMapB>("service-b")

 const user = await remoteB.getUser(1)
 const post = await serviceA.useSelf().getPosts(1)
 console.log(`user ${JSON.stringify(user)}, post: ${post}`)
})().catch((e) => {
 console.log("We got an error: ", e)
 // Error: Client "service-a" does not have a handler for event "getPosts". Make sure to call the "on" method to register the handler!
})
```

### Server

Just a socket.io server for the clients

```javascript
import { Server } from "socketio-mq"
const server = new Server(3000) // Socket.io server will lift at http://localhost:3000
```

## Conclusion

This package is "message queue" but still has lacks of features to be a full-featured message queue. It's more like a "message broker" for now, would be the best if you guys can help me to improve this package. Thanks! 🙏

[forks-shield]: https://img.shields.io/github/forks/khoakomlem/socketio-mq.svg?style=for-the-badge
[forks-url]: https://github.com/khoakomlem/socketio-mq/network/members
[stars-shield]: https://img.shields.io/github/stars/khoakomlem/socketio-mq.svg?style=for-the-badge
[stars-url]: https://github.com/khoakomlem/socketio-mq/stargazers
