const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(`user-${userId}`);
  });
  socket.on('disconnect', () => {});
});

app.post('/notify', (req, res) => {
  const { userId, bookingId, status } = req.body;
  io.to(`user-${userId}`).emit('booking-status', { bookingId, status });
  res.send({ ok: true });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});