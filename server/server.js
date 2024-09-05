const express = require('express');
const http = require('http');
const cors = require('cors');
const socketHandler = require('./sockets'); 
const fs = require('fs'); 

const app = express();
app.use(cors());                                    

const server = http.createServer(app);              // create a new http server
const io = require('socket.io')(server, {           // create a new socket.io server
  cors: {
    origin: "http://localhost:4200",                // allow requests from the client app
    methods: ["GET", "POST"]                        // allow GET and POST requests
  }
});

let channelMessages = {};                           // create an object to store messages

function loadData() {                               // load the messages from the file function
  if (fs.existsSync('data.json')) {                 // check if the file exists
    const data = fs.readFileSync('data.json');      // read the file
    channelMessages = JSON.parse(data);             // parse the JSON data
  }
}

loadData();                                         // load the messages from the file

socketHandler.connect(io, channelMessages);         // connect the socket.io server

const PORT = 3000;                                  // set the port number
server.listen(PORT, () => {                         // start the server  
  console.log(`Server is running on port ${PORT}`); 
});
