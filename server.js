const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users.js');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'ChatCord Bot';

// Run when a client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

        // Broadcast when a user connects (sends message to everyone except the user who just got connected)
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    })


    // Listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        // Sending the incoming user's chat message to everyone
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })


    // Runs when user disconnects (sends message to everyone except the user who just got disconnected)
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }

    });
})

server.listen(3000, () => {
    console.log(`Server running on port 3000`);
})