require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const Message = require("./models/Message");
const User = require("./models/User");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chatapp_db";
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// --- REST routes ---
app.use("/api/auth", authRoutes);

/**
 * Optional: route to get all users (for sidebar)
 * GET /api/users
 */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 }).sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * Optional: fetch chat history between two users
 * GET /api/messages/:userA/:userB
 */
app.get("/api/messages/:a/:b", async (req, res) => {
  try {
    const { a, b } = req.params;
    const msgs = await Message.find({
      $or: [
        { from: a, to: b },
        { from: b, to: a }
      ]
    }).sort({ timestamp: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// --- SOCKET.IO ---
const io = new Server(server, {
  cors: { origin: "*" },
});

// username -> socketId
const onlineUsers = new Map();

/**
 * Middleware-like token verification for socket connections.
 * Clients should send `{ token }` inside socket.auth when connecting.
 */
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: token missing"));

  try {
    const data = jwt.verify(token, JWT_SECRET);
    socket.user = { id: data.id, username: data.username };
    return next();
  } catch (err) {
    return next(new Error("Authentication error: invalid token"));
  }
});

io.on("connection", (socket) => {
  const username = socket.user.username;
  console.log(`${username} connected, socketId=${socket.id}`);

  // register online user
  onlineUsers.set(username, socket.id);

  // notify others user is online (optional)
  io.emit("user_online", { username });

  // Send stored undelivered messages (optional)
  (async () => {
    const undelivered = await Message.find({ to: username, delivered: false });
    for (const m of undelivered) {
      // send to socket
      socket.emit("private_message", {
        from: m.from,
        to: m.to,
        text: m.text,
        timestamp: m.timestamp
      });
      m.delivered = true;
      await m.save();
    }
  })();

  // private message event
  socket.on("private_message", async ({ to, text }) => {
    if (!to || !text) return;

    // Save to DB
    const msg = new Message({ from: username, to, text, timestamp: new Date() });
    await msg.save();

    // send to recipient if online
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("private_message", {
        from: username,
        to,
        text,
        timestamp: msg.timestamp
      });

      // mark delivered
      msg.delivered = true;
      await msg.save();
    }

    // ACK back to sender (so sender can show message)
    socket.emit("message_sent", {
      to,
      text,
      timestamp: msg.timestamp
    });
  });

  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);
    onlineUsers.delete(username);
    io.emit("user_offline", { username });
  });
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
