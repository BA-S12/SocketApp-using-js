# WebSocket Chat Application

This is a simple command-line chat application built with Node.js that allows users to communicate in a public chat room or send private messages to specific users. It uses WebSockets for real-time communication.

## Features

- Public chat with all connected users.
- Private messaging between users.
- User registration and login.
- Persistent storage of users and messages in JSON files.

## How It Works

The application has two main components:

### 1. Server (`server.js`)

- It starts a WebSocket server using the `ws` library.
- It listens for new client connections.
- When a client connects, it can register with a `userId`. The server keeps track of connected users.
- **Public Messages**: When a message of type `chat` is received, the server broadcasts it to every connected client.
- **Private Messages**: When a `privateMessage` is received, the server sends it only to the intended recipient if they are online.
- All messages and login events are logged into `data/message.json` and `data/login.json` respectively.

### 2. Client (`Client.js`)

- It connects to the WebSocket server.
- It provides a command-line interface for the user.
- **User Handling**:
  - On the first run, a user can register by entering `0` when asked for an ID. They will be prompted for a name and assigned a new ID.
  - Existing users can log in by entering their assigned ID.
  - User data is stored in `data/users.json`.
- **Sending Messages**:
  - Typing a regular message sends it to the public chat.
  - To send a private message, the user prefixes the message with `@<userId>`.

## How to Use

### Prerequisites

- Node.js installed on your machine.

### 1. Installation

Clone the repository and install the dependencies:

```sh
npm install
```

### 2. Start the Server

Open a terminal and run the following command:

```sh
npm start
```

You should see the message: `WebSocket Server running on port 8080`.

### 3. Start the Client

Open one or more new terminal windows and run the following command in each:

```sh
npm run start:client
```

### 4. Chatting

1.  **Register a new user**: When prompted `Enter yout ID: (if you haven't account enter 0)`, type `0` and press Enter. Then, enter a name. The application will give you your new user ID.

    ```
    $ npm run start:client
    > node client.js

    The server is connected
    Enter yout ID: (if you haven`t account enter 0)0
    Enter youe name: Ali
    Your ID is 2
    Type 'exit' to quit
    Ali >
    ```

2.  **Log in**: If you already have an ID, just enter it when prompted.

    ```
    $ npm run start:client
    > node client.js

    The server is connected
    Enter yout ID: (if you haven`t account enter 0)1
    Type 'exit' to quit
    Bassam >
    ```

3.  **Send a public message**: Simply type your message and press Enter.

    ```
    Bassam > Hi
    ```

    Another user in the chat will see:

    ```
    [PUBLIC] Bassam: Hi
    Ali >
    ```

4.  **Send a private message**: To send a message to a user with ID `2`, for example, use the following format:

    ```
    Ali > @1 Hi Bassam how Are you?
    ```

    Only the user with ID `1` (Bassam) will receive this message:

    ```
    [PRIVATE] Ali: Hi Bassam how Are you?
    Bassam >
    ```

5.  **Exit the chat**: Type `exit` and press Enter.
