const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// WebSocket (Socket.IO) server logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for chat message events from clients
  socket.on('chat message', (data) => {
    console.log('Message received:', data);
    // Broadcast the message to all connected clients
    io.emit('chat message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
