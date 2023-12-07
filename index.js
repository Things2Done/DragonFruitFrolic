const express = require("express");
const { createServer } = require('http');
const { Server } = require('socket.io');

// ----- prepare server (including socket.io)
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
// -----


// ----- [server side tmp data]
// It will be lost once the server stops.
// (Glitch will stop the server after a while.)
const tmpdata = [];
app.post('/api/tmpdata', (req, res) => {
  tmpdata.push(req.body);
  res.json({ result: "success" });
});
app.get('/api/tmpdata', (req, res) => {
  res.json(tmpdata);
});

// ----- [mongodb] data save and retrieve example, i.e. data persistence
app.post('/api/data', async (req, res) => {
  console.log(req.body);
  await db.push('magicData', req.body);
  res.json({ result: "success" });
});

app.get('/api/data', async (req, res) => {
  const data = await db.get('magicData');
  res.json(data);
});

app.get('/api/remove-all-data', async (req, res) => {
  await db.set('magicData', null);
  res.json({ result: "success" });
});
// -----


const points = []; // or get from mongodb

app.get('/api/points', (req, res) => {
  res.json(points);
});

// ----- [socket.io] for live logic
io.on('connection', (socket) => {
  
  socket.on('message', (msg) => {
    // console.log(msg);
    // send a message to everyone except the sender
    socket.broadcast.emit('message', msg);
  });
  
  socket.on('point', (point) => {
    // add to local array.
    points.push(point);
    
    // if you want to keep it after the server stops, save it to mongodb as well.
    
    socket.broadcast.emit('point', point);
  });
});


// ----- start server
let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('listening at ', port);
});
