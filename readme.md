# Real-time Server

A real-time server built with Express and Socket.IO for booking status notifications.

## Features

- Express server with CORS and JSON body parsing
- Socket.IO integration for real-time communication
- User room management for targeted notifications
- RESTful API endpoint for sending notifications
- Graceful connection handling

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

The server will start on port 4000 (or the PORT environment variable).

## API Endpoints

### Health Check
```
GET /health
```

### Send Notification
```
POST /notify
Content-Type: application/json

{
  "userId": "123",
  "bookingId": "booking-456",
  "status": "confirmed"
}
```

## Socket.IO Events

### Client Events
- `join`: Join a user room with `{ userId: "123" }`
- `disconnect`: Automatically handled

### Server Events
- `joined`: Confirmation of room join
- `booking-status`: Real-time booking status updates
