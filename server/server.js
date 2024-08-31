// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const sockets = require('./sockets'); 
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

sockets.connect(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
