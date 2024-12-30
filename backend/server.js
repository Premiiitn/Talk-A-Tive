const express = require('express');
const dotenv = require('dotenv'); 
const path = require("path");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Serve Frontend in Production
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
  
  // Serve static files from the frontend's dist directory
  const staticPath = path.join(__dirname1, "frontend", "dist");
  //console.log("Serving static files from:", staticPath);
  app.use(express.static(staticPath));

  // Handle client-side routing by returning index.html for any unrecognized route
  app.get("*", (req, res) => {
    //console.log(`Handling client-side route: ${req.url}`);
    res.sendFile(path.join(staticPath, "index.html"));
  });
} else {
  //console.log("Running in development mode");
  
  // Define root route for development
  app.get('/', (req, res) => {
    res.send("API is running successfully");
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

// Configure Socket.IO
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("user joined room:" + room);
  });

  socket.on('typing', (room) => {
    socket.broadcast.to(room).emit("typing");
  });

  socket.on('stop typing', (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach(user => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    const rooms = Array.from(socket.rooms); 
    rooms.forEach((room) => {
      console.log(`Socket ${socket.id} leaving room: ${room}`);
      socket.leave(room);
    });
  });
});
