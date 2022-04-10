const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./database");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/error");

app.use(cors());

dotenv.config();

//connecting to db
connectToDB();
app.use(express.json());

//Endpoints

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req, res) => {
//   const chat = chats.filter((chat) => chat._id === req.params.id);
//   res.send(chat);
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log("Server running on PORT ", PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 50000,
  cors: {
    origins: ["*"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket Connected!");

  //To take data from frontend and Join a room
  socket.on("setup", (userData) => {
    //create new room with id of that user
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
    socket.emit("Joined");
  });

  socket.on("newMsg", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("Message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"));
});
