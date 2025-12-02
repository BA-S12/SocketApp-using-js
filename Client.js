const socket = new WebSocket("ws://localhost:8080")

socket.onopen =()=>{
    console.log("Connected")
    socket.send("The server is connected")
}


socket.onmessage = (event)=>{
    console.log(event.data)
}

socket.onclose = ()=>{
    console.log("Disconnected")
}

