# Socket.IO Integration

This project uses Socket.IO for real-time communication between the client and the server. Below is a summary of how the socket works and the flow of working.

## Flow of Working

1. **Initialization**:
   - The socket connection is initialized when the project component mounts.
   - The `initializeSocket` function is called with the project ID, which establishes a connection to the server.

2. **Authentication**:
   - The server uses middleware to authenticate the socket connection using a JWT token.
   - The token is extracted from the socket handshake and verified.
   - If the token is valid, the user and project information are attached to the socket object.

3. **Joining a Room**:
   - Once authenticated, the socket joins a room corresponding to the project ID.
   - This allows messages to be broadcasted to all users in the same project room.

4. **Sending Messages**:
   - The client can send messages using the `sendMessage` function.
   - The message is emitted to the server with the event name `project-message`.

5. **Receiving Messages**:
   - The server listens for the `project-message` event and broadcasts the message to all other users in the same room.
   - The client listens for the `project-message` event using the `receiveMessage` function and updates the UI accordingly.

## Socket Code

### Client-side (Frontend)

```javascript
// filepath: /C:/Users/ankit/Desktop/SOEN/Frontend/src/config/socket.js
import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = (projectId) => {
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token'),
        },
        query: {
            projectId
        }
    });

    return socketInstance;
}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}
```

### Server-side (Backend)

```javascript
// filepath: /C:/Users/ankit/Desktop/SOEN/Backend/server.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from "./models/project.model.js";

// ...existing code...

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid project id'));
        }

        socket.project = await projectModel.findById(projectId);

        if (!token) return next(new Error('unauthorized'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication failed'));
        }

        socket.user = decoded;
        next();
    } catch (error) {
        next(error);
    }
});

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString();
    console.log('New user connected');
    socket.join(socket.roomId);

    socket.on('project-message', data => {
        console.log(data);
        socket.broadcast.to(socket.roomId).emit('project-message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// ...existing code...
```

## Hinglish Documentation

### Client-side (Frontend)

- **Socket.IO client ko import kar rahe hain**: Socket.IO client ko import karte hain jo server se real-time communication establish karta hai.
- **Ek variable jisme socket instance ko store karenge**: Ek variable define karte hain jisme socket instance ko store karenge.
- **Socket ko initialize karne ka function**: Ek function define karte hain jo socket ko initialize karta hai aur server se connect karta hai.
- **Messages ko receive karne ka function**: Ek function define karte hain jo specific event ke messages ko receive karta hai.
- **Messages ko send karne ka function**: Ek function define karte hain jo specific event ke messages ko server ko send karta hai.

### Server-side (Backend)

- **Socket.IO server ko import kar rahe hain**: Socket.IO server ko import karte hain jo client se real-time communication establish karta hai.
- **Socket.IO server ko create kar rahe hain**: Ek Socket.IO server create karte hain aur CORS policy set karte hain.
- **Middleware jo socket connection ko authenticate karega**: Ek middleware define karte hain jo socket connection ko JWT token ke through authenticate karta hai.
- **Connection event ko handle kar rahe hain**: Ek event listener define karte hain jo new connection ko handle karta hai.
- **Project message ko handle kar rahe hain**: Ek event listener define karte hain jo project messages ko handle karta hai aur unhe broadcast karta hai.
- **Disconnect event ko handle kar rahe hain**: Ek event listener define karte hain jo disconnect event ko handle karta hai.


 "@webcontainer/api": "^1.5.1-internal.8",
    "axios": "^1.7.9",
    "highlight.js": "^11.11.1",
    "markdown-to-jsx": "^7.7.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.3",
    "remixicon": "^4.6.0",
    "socket.io-client": "^4.8.1"
  