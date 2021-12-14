const express = require("express");
const PORT = process.env.PORT || 8080;

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
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
/*   io.emit('news','Voici un nouvel élément envoyé par le serveur'); */

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
http.listen(PORT, () => {
  console.log(`Server is running: http://127.0.0.1:${PORT}/`);
});