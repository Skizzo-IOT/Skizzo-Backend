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
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Skizzo backend." });
});

require("./routes/user.routes")(app);
require("./routes/login.routes")(app);

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors:{
      origin:"*"
  },
});

app.get('/html', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('stream', function(image) {
    //Send image received to all users connected
    console.log(image);
    /* socket.emit("stream", 2); */
    socket.broadcast.emit('stream', image);
    socket.emit('stream', image);
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

app.use(express.static(__dirname + '/public'));

// set port, listen for requests
server.listen(PORT, () => {
  console.log(`Server is running: http://127.0.0.1:${PORT}/`);
});