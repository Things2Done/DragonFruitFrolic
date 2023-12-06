const express = require("express");
const { createServer } = require('http');
const { Server } = require('socket.io');

let app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.json());

// ----- serve html pages
app.use('/', express.static('public'));

// ----- prepare mongodb (https://www.mongodb.com/)
const { Database } = require("quickmongo");
// Writing the password here means it will be leaked, but for convenience...
const db = new Database("mongodb+srv://yuqian:yuqianma@cluster0.v8pqot1.mongodb.net/?retryWrites=true&w=majority");
db.on("ready", () => {
  console.log("Connected to the database");
});
db.connect();

// ----- socket.io

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log(msg);
    // send a message to everyone except the sender
    socket.broadcast.emit('message', msg);
  });
});


// ----- start the server
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('listening at ', port);
});
