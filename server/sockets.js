const fs = require('fs'); 

module.exports.connect = function (io, channelMessages) {
  
  function saveData() {
    fs.writeFileSync('data.json', JSON.stringify(channelMessages, null, 2)); 
  }

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinChannel', (channelName) => {
      socket.join(channelName);
      console.log(`User joined channel: ${channelName}`);

      if (channelMessages[channelName]) {
        const sortedMessages = channelMessages[channelName]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5);
        socket.emit('chatHistory', sortedMessages);
      } else {
        socket.emit('chatHistory', []);
      }
    });

    socket.on('sendMessage', ({ channelName, message, user }) => {
      const newMessage = {
        user: user || 'Anonymous',
        message,
        timestamp: new Date(),
      };

      if (!channelMessages[channelName]) {
        channelMessages[channelName] = [];
      }
      channelMessages[channelName].push(newMessage);

      io.to(channelName).emit('newMessage', newMessage);

      saveData();
    });

    socket.on('deleteChannel', (channelName) => {
      delete channelMessages[channelName];
      console.log(`Channel ${channelName} and its messages have been deleted.`);
      
      
      saveData();
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
