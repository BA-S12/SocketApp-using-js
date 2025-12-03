import WebSocket from "ws"
import readline from "readline"



const socket = new WebSocket("ws://localhost:8080")




const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.setPrompt("--->")


socket.onopen =()=>{
    console.log("The server is connected")
    console.log("Type 'exit' to quit")
    rl.prompt()

}


socket.onmessage = (event)=>{
    console.log(event.data.toString())
    rl.prompt()
}


rl.on("line", (input)=>{
    if(input.trim().toLowerCase() =="exit"){
        socket.close()
        rl.close()
        return;
    }

        socket.send(input)
        rl.prompt()

    
})
socket.onclose = ()=>{
    console.log("Disconnected")
}

