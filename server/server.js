const express = require('express');
const http = require('http');
const cors = require('cors');
const socketHandler = require('./sockets'); 
const fs = require('fs'); 

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

let channelMessages = {};

function loadData() {
  if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json');
    channelMessages = JSON.parse(data);
  }
}

loadData();

socketHandler.connect(io, channelMessages);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
