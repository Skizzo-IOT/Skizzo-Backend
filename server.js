const express = require("express");

// App
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Clear and create
// const db = require("./models");
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Skizzo backend." });
});

require("./routes/user.routes")(app);
require("./routes/login.routes")(app);

// ajout de socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(8080, () => {
  console.log(`Server is running: http://127.0.0.1:${PORT}/`);
});


// var io = require('socket.io').listen(server);

// io.sockets.on('connection', function(socket){
//     socket.on('stream', function(image){
//      socket.broadcast.emit('stream', image);
//     });
// });