const express = require("express");
const PORT = process.env.PORT || 3000;

// App
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Clear and create
//Option to resst DB
//{ force: true }
const db = require("./models");
db.sequelize.sync().then(() => {
    console.log("Re-sync db.");
});

// simple route
app.get("/json", (req, res) => {
    res.status(200).json({ message: "Welcome to the Skizzo backend." });
});

require("./routes/user.routes")(app);
require("./routes/login.routes")(app);

// ajout de socket.io
//const http = require('http').Server(app);
//const io = require('socket.io')(http); 

const server=require('http').createServer(app);
const io = require('socket.io')(server, {
  cors:{
      origin:"*"
  },
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
//   io.emit('news','Voici un nouvel élément envoyé par le serveur'); 

  socket.on('stream', function(image) {
    
    //Send image received to all users connected
    socket.broadcast.emit('stream', image);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(express.static(__dirname + '/public'));

// set port, listen for requests
server.listen(PORT, () => {
  console.log(`Server is running: http://127.0.0.1:${PORT}/`);
});
 

// const express = require("express");
// const http = require('http')
// const socketio = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server).sockets;

// app.use(express.json());

// const server = require('http').createServer()
// const io = require('socket.io')(server)

// io.on('connection', function (client) {

//   console.log('client connect...', client.id);

//   client.on('typing', function name(data) {
//     console.log(data);
//     io.emit('typing', data)
//   })

//   client.on('message', function name(data) {
//     console.log(data);
//     io.emit('message', data)
//   })

//   client.on('location', function name(data) {
//     console.log(data);
//     io.emit('location', data);
//   })

//   client.on('connect', function () {
//   })

//   client.on('disconnect', function () {
//     console.log('client disconnect...', client.id)
//     // handleDisconnect()
//   })

//   client.on('error', function (err) {
//     console.log('received error from client:', client.id)
//     console.log(err)
//   })
// })

// var server_port = process.env.PORT || 3000;
// server.listen(server_port, function (err) {
//   if (err) throw err
//   console.log('Listening on port %d', server_port);
// });