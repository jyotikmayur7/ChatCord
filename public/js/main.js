const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', message => {
    console.log(message);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    // To make sure form submit event does not submit it to a file
    e.preventDefault();

    // Get message text from the form
    const msg = e.target.elements.msg.value;

    // Emit message to the server
    socket.emit('chatMessage', msg);
}); 
