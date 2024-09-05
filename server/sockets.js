const fs = require('fs');       

module.exports.connect = function (io, channelMessages) {
  
  function saveData() {                                 // save the messages to the file funtion 
    fs.writeFileSync('data.json', JSON.stringify(channelMessages, null, 2)); // save the messages to the data.json file
  }
//
  io.on('connection', (socket) => {                     // socket.io connection event
    console.log('A user connected');  

    socket.on('joinChannel', (channelName) => {         // socket.io event listener
      socket.join(channelName);                         // socket.io method
      console.log(`User joined channel: ${channelName}`);

      if (channelMessages[channelName]) {               // check if channel exists
        const sortedMessages = channelMessages[channelName]   // sort messages by timestamp
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))  // sort messages by timestamp    
          .slice(0, 5);                                 // get the last 5 messages        
        socket.emit('chatHistory', sortedMessages);     // send chat history to the user
      } else {
        socket.emit('chatHistory', []);                 // send an empty array if no messages
      }
    });

    socket.on('sendMessage', ({ channelName, message, user }) => {    // socket.io event listener
      const newMessage = {                                // create a new message object
        user: user || 'Anonymous',                        // set the user or default to 'Anonymous'
        message,                                          // set the message
        timestamp: new Date(),                            // set the current date
      };

      if (!channelMessages[channelName]) {                // check if the channel exists
        channelMessages[channelName] = [];                // create an empty array for the channel
      }
      
      channelMessages[channelName].push(newMessage);      // add the new message to the channel
      io.to(channelName).emit('newMessage', newMessage);  // send the new message to all users in the channel

      saveData();                                         // save the messages to the file 
    });

    socket.on('deleteChannel', (channelName) => {         // socket.io event listener
      delete channelMessages[channelName];                // delete the channel from the object
      saveData();                                         // save the messages to the file
    });
  });
  
};
