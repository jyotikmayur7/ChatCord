const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when a client connects
io.on('connection', socket => {

    // Welcome current user
    socket.emit('message', 'Welcome to ChatCord');

    // Broadcast when a user connects (sends message to everyone except the user who just got connected)
    socket.broadcast.emit('message', 'A user has joined that chat');

    // Runs when user disconnects (sends message to everyone except the user who just got disconnected)
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left that chat');
    });

    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        // Sending the incoming user's chat message to everyone
        io.emit('message', msg);
    })
})

server.listen(3000, () => {
    console.log(`Server running on port 3000`);
})