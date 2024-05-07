const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const messages = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  //incoming chat messages
  socket.on('chat message', (data) => {
    console.log('Message received:', data);
    const { message } = data;
    const messageId = generateMessageId();
    const newMessage = { messageId, message, senderId: socket.id };
    messages.push(newMessage);
    io.emit('chat message', newMessage);
  });

  //message deletion events
  socket.on('delete message', ({ messageId, deleteForEveryone }) => {
    const messageIndex = messages.findIndex((msg) => msg.messageId === messageId);

    if (messageIndex !== -1) {
      if (deleteForEveryone) {
        messages[messageIndex].message = "Message deleted for everyone";
        io.emit('delete message', { messageId, deletedForEveryone: true });
      } else {
        socket.emit('delete message', { messageId, deletedForEveryone: false });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function generateMessageId() {
  return Math.random().toString(36).substr(2, 9);
}
