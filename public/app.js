const socket = io();

socket.emit('message', { message: 'ping' });

socket.on('message', (msg) => {
  console.log(msg);
});
