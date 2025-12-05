import WebSocket from "ws";
import readline from "readline";
import fs from "fs";
import { resolve } from "path";

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

const privateMessage = (fromId)=>{
  return new Promise((resolve,reject)=>{

  
  rl.question("Enter the id of user, to message it",(id)=>{
    const data = fs.readFileSync(filePath,"utf-8")
    const dataArray = JSON.parse(data)
    const foundUser = dataArray.find((user)=> user.id === Number(id))
    if(!foundUser){
      console.log("User not found")
    }
    return {
      type: "privateMessage",
      from : fromId,
      toUser: id,
    }

  }})
}

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
    // socket.send(JSON.stringify(input))
    socket.send(input);
    rl.prompt();
  });
};

const handleLogin = () => {
  rl.question("Enter yout ID: (if you haven`t account enter 0)", (id) => {
    const data = fs.readFileSync(filePath, "utf-8");
    const dataArray = JSON.parse(data);
    const foundUser = dataArray.find((user) => user.id === Number(id));

    if (!foundUser || id === 0) {
      const ids = dataArray.map((user) => user.id);
      const maxId = Math.max(...ids);

      rl.question("Enter youe name: ", (name) => {
        const user = {
          id: maxId == -Infinity ? 1 : maxId + 1,
          name,
        };
        const cuurentUsers = readMessages();
        cuurentUsers.push(user);
        fs.writeFileSync(filePath, JSON.stringify(cuurentUsers));
              console.log(`Your ID is ${user.id}`);
              privateMessage(user.id);
              startChat(user);
      });

    }

    if (foundUser) {
      console.log(`Welcome ${foundUser.name}`);
      const privateMessage = privateMessage(foundUser.id);
      console.log(privateMessage)
      setTimeout(()=>{
        startChat(foundUser);
        
      },3000)
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
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log(`Server ${event.data.toString()}`);
  rl.prompt(true);
};

socket.onclose = () => {
  console.log("Disconnected");
  process.exit(0);
};
