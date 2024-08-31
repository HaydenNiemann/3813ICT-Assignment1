module.exports.connect = function (io) {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('message', (message) => {
        io.emit('message', message);
      });
  
      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  };
  