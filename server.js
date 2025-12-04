import { WebSocketServer } from "ws";
import fs from "fs";

const PORT = 8080;
const filePath = "./data/message.json";

const wss = new WebSocketServer({ port: PORT });


const readMessages = ()=>{
    try{
        if(fs.existsSync(filePath)){
            const data = fs.readFileSync(filePath,"utf-8")
            return JSON.parse(data || [])
        }
    }catch(err){
        console.log("Error reading file: "+err)
    }
    return [];
}



console.log("WebSocket Server running on port", PORT);
wss.on("connection", (ws) => {
  console.log("Client Connected");

  ws.on("message", (msg) => {
    console.log("msg: " + msg);
    const message = {
      id: Date.now().toString(),
      timestamb:new Date().toISOString(),
      message: msg.toString(),
    };

    const currentMessages = readMessages();
    currentMessages.push(message);
    

    fs.writeFileSync(filePath, JSON.stringify(currentMessages));
  });
});
