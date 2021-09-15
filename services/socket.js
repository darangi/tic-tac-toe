const socket = require('socket.io');

let io;

module.exports = {
  initialize: (server) => {
    if (io) {
      console.log('Socket connection has been initiated');
      return;
    }
    io = socket(server);
  },
  emit: (event, data) => {
    if (io) {
      io.sockets.emit(event, data);
    }
  },

};
