import WebSocket from "ws";
import readline from "readline";
import fs from "fs";

const socket = new WebSocket("ws://localhost:8080");

const filePath = "./data/users.json";

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

const privateMessage = (fromId) => {
  return new Promise((resolve, reject) => {
    rl.question("Enter the id of user, to message it: ", (id) => {
      try {
        const data = fs.readFileSync(filePath, "utf-8");
        const dataArray = JSON.parse(data);
        const foundUser = dataArray.find((user) => user.id === Number(id));

        if (!foundUser) {
          console.log("User not found");
          resolve(null);
        }

        const messagePacket = {
          type: "privateMessage",
          from: fromId,
          toUser: id,
          text: "Hello",
        };

        resolve(messagePacket);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const startChat = (user) => {
  console.log("Type 'exit' to quit");
  rl.setPrompt(`${user.name} >`);
  rl.prompt();
  rl.on("line", (input) => {
    if (input.trim().toLowerCase() == "exit") {
      socket.close();
      rl.close();
      return;
    }

    if (input.startsWith("@")) {
      const [to, ...mesParts] = input.split(" ");
      const toUser = to.slice(1);
      const text = mesParts.join(" ");

      socket.send(
        JSON.stringify({
          type: "privateMessage",
          from: user.id,
          toUser,
          text,
        })
      );
    } else {
      socket.send(
        JSON.stringify({
          type: "chat",
          from: user.id,
          text: input,
        })
      );
    }

    // socket.send(input);
    rl.prompt();
  });
};

const handleLogin = () => {
  rl.question("Enter yout ID: (if you haven`t account enter 0)", async (id) => {
    const data = fs.readFileSync(filePath, "utf-8");
    const dataArray = JSON.parse(data);
    const foundUser = dataArray.find((user) => user.id === Number(id));

    if (!foundUser || id === 0) {
      const ids = dataArray.map((user) => user.id);
      const maxId = Math.max(...ids);

      rl.question("Enter youe name: ", async (name) => {
        const user = {
          id: maxId == -Infinity ? 1 : maxId + 1,
          name,
        };
        const cuurentUsers = readMessages();
        cuurentUsers.push(user);
        fs.writeFileSync(filePath, JSON.stringify(cuurentUsers));
        console.log(`Your ID is ${user.id}`);
        socket.send(
          JSON.stringify({
            type: "register",
            userId: user.id,
          })
        );

        startChat(user);
      });
    }

    if (foundUser) {
      socket.send(JSON.stringify({ type: "register", userId: foundUser.id }));

      const packet = await privateMessage(foundUser.id);
      if (packet) socket.send(JSON.stringify(packet));

      startChat(foundUser);
    }
  });
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.onopen = () => {
  console.log("The server is connected");

  handleLogin();
};

socket.onmessage = (event) => {
  console.log(event.data.toString());

  const data = JSON.parse(event.data);

  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log(`Server ${event.data.toString()}`);
  if (data.type === "private") {
    console.log(`\n [PRIVATE] From ${data.from}: ${data.text}`);
  } else {
    console.log(`\n [PUBLIC] From ${data.from}: ${data.text}`);
  }

  rl.prompt(true);
};

socket.onclose = () => {
  console.log("Disconnected");
  process.exit(0);
};
