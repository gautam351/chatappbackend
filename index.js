const express = require("express");
const env = require("dotenv");
const { server } = require("./app");
const connectDb = require("./config/dbConfig");
const app = server();
// configuing env amd dbCOnnect file just one line
env.config();
connectDb();
// defining port
PORT = process.env.PORT || 8001;

// app.use statements
const socketserver = app.listen(PORT, () => {
  console.log("running on " + PORT);
});

// socket initialization
const io = require("socket.io")(socketserver, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  // socket joining room
  socket.on("setup", (email) => {
    socket.join(email);
    console.log("admin joined " + email);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(room + "joined the room");
  });
  socket.on("send message", (usermessage) => {
    console.log(usermessage);
    socket.in(usermessage.to).emit("new message", usermessage);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// socket initialization ends
