import {WebSocketServer} from "ws"

const PORT = 8080

const wss = new WebSocketServer({port:PORT})

console.log("WebSocket Server running on port", PORT);
wss.on("connection", (ws)=>{
    console.log("Client Connected")

    ws.on("message", (msg)=>{
        console.log("msg: "+msg)
        ws.send("Hi client")
    })
})