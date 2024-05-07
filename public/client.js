const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value.trim() !== '') { // Check if input value is not empty or only whitespace
    socket.emit('chat message', { message: input.value, senderId: socket.id });
    input.value = '';
  }
});

socket.on('chat message', (data) => {
  const { message, senderId } = data;

  const item = document.createElement('li');
  item.textContent = message;

  if (senderId === socket.id) {
    // Own message (sent by current client)
    item.classList.add('own-message');
  } else {
    // Message from another user
    item.classList.add('other-message');
  }

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
//github deneme