const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "html");

// Servir arquivos estáticos
app.use(express.static(gamedirectory));

// Configuração da porta
const PORT = process.env.PORT || 3000;
httpserver.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

var rooms = [];
var usernames = [];

// Configuração do socket.io
io.on('connection', function(socket) {
  socket.on("join", function(room, username) {
    if (username !== "") {
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      socket.leaveAll();
      socket.join(room);
      io.in(room).emit("recieve", "Server : " + username + " Entrou na sala.");
      socket.emit("join", room);
    }
  });

  socket.on("send", function(message) {
    io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] + " : " + message);
  });

  socket.on("recieve", function(message) {
    socket.emit("recieve", message);
  });
});

