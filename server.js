var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

//accept json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// header
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept, Origin"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// init sequelize
const db = require("./models");
db.sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("DB Initialized.");
});

// simple route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Skizzo backend." });
});

require("./routes/user.routes")(app);
require("./routes/login.routes")(app);
require("./routes/res.routes")(app);

app.ws('/esp32', function (ws, req) {
  console.log("Client ESP32 connecté !");
  app.set("esp32_client", ws);

  ws.on('close', req => {
    app.set("esp32_client", null);
    console.log("Client ESP32 déconnecté !");
  });

  ws.on('message', function (msg) {
    console.log("Message reçu du client ESP32: ", msg);

    var flutter = app.get("flutter_client");
    if (flutter) {
      flutter.send(msg);
    }
  });
});

app.ws('/flutter', function (ws, req) {
  console.log("Client flutter connecté !");
  app.set("flutter_client", ws);

  ws.on('close', req => {
    app.set("flutter_client", null);
    console.log("Client flutter déconnecté !");
  });

  ws.on('message', function (msg) {
    console.log("Message reçu du client Flutter: ", msg);
    ws.send(msg);
    var esp32Client = app.get("esp32_client");
    if (esp32Client) {
      esp32Client.send(msg);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});


// const express = require("express");
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);

// // parse requests of content-type - application/json
// app.use(express.json());
// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
// // header
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept, Origin"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });

// // init sequelize
// const db = require("./models");
// db.sequelize.sync({ force: false, alter: false }).then(() => {
//   console.log("Initialized.");
// });

// // simple route
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Welcome to the Skizzo backend." });
// });

// require("./routes/user.routes")(app);
// require("./routes/login.routes")(app);


// io.on('connection', (socket) => {
//   console.log(`A user connected: ${socket.id}`);

//   socket.on('message', data => {
//     console.log(data)
//     socket.broadcast.emit('message', data)
//   })
//   socket.on('open light', data => {
//     socket.broadcast.emit('open_light', data)
//     console.log(data)
//   })
//   socket.on('disconnect', () => {
//     console.log(`A user disconnected: ${socket.id}`);
//   });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`App listening at http://localhost:${PORT}`)
// });

//TMP
// const server = require('http').createServer(app);
// const io = require('socket.io')(server, {
//   cors:{
//       origin:"*"
//   },
// });
// app.get('/html', (req, res) => {
//   res.sendFile(__dirname + '/html/index.html');
// });
// io.on('connection', (socket) => {
//   console.log(`A user connected: ${socket.id}`);

//   socket.on('stream', function(image) {
//     //Send image received to all users connected
//     console.log(image);
//     var imgArray = new Uint8Array(image.buffer);
//     console.log(imgArray);

//     // socket.broadcast.emit('stream', imgArray);
//     socket.emit('stream', imgArray);
//   });

//   socket.on('disconnect', () => {
//     console.log(`A user disconnected: ${socket.id}`);
//   });
// });
//TMP

// set port, listen for requests
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running: http://127.0.0.1:${PORT}/`);
// });