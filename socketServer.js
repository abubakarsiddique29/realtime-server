const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Create Express app
const app = express();

// Set up CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server with CORS enabled for all origins
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining with userId
  socket.on('join', (data) => {
    const { userId } = data;
    if (userId) {
      const roomName = `user-${userId}`;
      socket.join(roomName);
      console.log(`User ${userId} joined room: ${roomName}`);
      
      // Send confirmation to the user
      socket.emit('joined', { roomName, userId });
    }
  });

  // Handle disconnection gracefully
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// POST endpoint for booking status notifications
app.post('/notify', (req, res) => {
  try {
    const { userId, bookingId, status } = req.body;

    // Validate required fields
    if (!userId || !bookingId || !status) {
      return res.status(400).json({
        error: 'Missing required fields: userId, bookingId, and status are required'
      });
    }

    const roomName = `user-${userId}`;
    
    // Emit booking status event to the user's room
    io.to(roomName).emit('booking-status', {
      bookingId,
      status,
      timestamp: new Date().toISOString()
    });

    console.log(`Notification sent to ${roomName}: bookingId=${bookingId}, status=${status}`);

    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: { userId, bookingId, status }
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send notification'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Real-time server is running' });
});

// Get the port from environment or default to 4000
const PORT = process.env.PORT || 4000;

// Start the server
server.listen(PORT, () => {
  console.log(`Real-time server is running on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
});

module.exports = { app, server, io };