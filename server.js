import {WebSocketServer} from "ws"
import fs from "fs"

const PORT = 8080
const filePath = "./message.txt"

const wss = new WebSocketServer({port:PORT})

console.log("WebSocket Server running on port", PORT);
wss.on("connection", (ws)=>{
    console.log("Client Connected")

    ws.on("message", (msg)=>{
        console.log("msg: "+msg)
        fs.appendFileSync(filePath, msg)
    })
})