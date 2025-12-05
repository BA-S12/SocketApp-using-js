import { WebSocketServer } from "ws";
import fs from "fs";
import { Socket } from "dgram";

const PORT = 8080;
const filePath = "./data/message.json";

const wss = new WebSocketServer({ port: PORT });

const readMessages = () => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data || []);
    }
  } catch (err) {
    console.log("Error reading file: " + err);
  }
  return [];
};

const connectedUsers = new Map();

console.log("WebSocket Server running on port", PORT);
wss.on("connection", (ws) => {
  console.log("Client Connected");

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type == "register") {
      connectedUsers.set(data.userId, ws);
      ws.userId = data.userId;
      console.log(`User regitsered: ${data.userId}`);
    }

    if (data.type === "privateMessage") {
      const { from, toUser } = data;
      if (from === toUser) {
        console.log("you can`t send message to yourself");
      }
      const recwiver = connectedUsers.get(toUser);

      if (recwiver) {
        recwiver.send(
          JSON.stringify({
            type: "private",
            from: data.from,
            text: data.text,
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            error: "User is offoline",
          })
        );
      }
    }

    if (data.type === "chat") {
      wss.clients.forEach((client) => {

          client.send(
            JSON.stringify({
              from: data.from,
              text: data.text,
            })
          );
        
      });
    }

    console.log("msg: " + msg);
    const message = {
      id: Date.now().toString(),
      timestamb: new Date().toISOString(),
      message: msg.toString(),
    };

    const currentMessages = readMessages();
    currentMessages.push(message);

    fs.writeFileSync(filePath, JSON.stringify(currentMessages));
  });
});
