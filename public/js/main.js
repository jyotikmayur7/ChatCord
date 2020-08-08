const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');


const socket = io();

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
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

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">${message}</p>
    `;

    document.querySelector(".chat-messages").appendChild(div);
}
