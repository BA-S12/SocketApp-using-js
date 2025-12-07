import { WebSocketServer } from "ws";
import fs from "fs";

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

const login = () => {
  try {
    if (fs.existsSync("./data/login.json")) {
      const data = fs.readFileSync("./data/login.json", "utf-8");
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
      connectedUsers.set(Number(data.userId), ws);
      ws.userId = data.userId;
      console.log(`User regitsered: ${data.userId}`);
    }

    if (data.type === "privateMessage") {
      const { from, to } = data;
      if (from === to) {
        ws.send(JSON.stringify({ error: "You can't message yourself" }));
        return;
      }

      const reciver = connectedUsers.get(Number(to));

      if (reciver) {
        reciver.send(
          JSON.stringify({
            type: "private",
            from: data.from,
            text: data.text,
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            error: "User is offonline",
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

    let message = JSON.parse(msg);

    if (message.type === "register") {
      const registerLog = {
        id: Date.now().toString(),
        timestamb: new Date().toISOString(),
        user: ws.userId?.toString(),
      };
      const LoginLog = login();
      LoginLog.push(registerLog);

      fs.writeFileSync("./data/login.json", JSON.stringify(LoginLog, null, 2));
    } else {
      message = {
        id: Date.now().toString(),

        from: ws.userId?.toString() ?? message.from?.toString() ?? "unknown",

        to: message.to?.toString() || "public",

        type: message.type?.toString() || "unknown",

        timestamb: new Date().toISOString(),

        message: message.text?.toString() || "null",
      };
    }

    const currentMessages = readMessages();
    currentMessages.push(message);

    fs.writeFileSync(filePath, JSON.stringify(currentMessages, null, 2));
  });
});
