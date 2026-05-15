const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const Message = require("./models/Message");

// START CRON JOBS
require("./cronJobs/birthdayCron");

const app = express();

// --------------------
// MIDDLEWARE
// --------------------
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// --------------------
// DATABASE
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// --------------------
// ROUTES
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);

// --------------------
// LOAD MESSAGES API
// --------------------
app.get("/api/messages/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({
      groupId,
    }).populate("sender", "firstName lastName");

    const formatted = messages.map((m) => ({
      _id: m._id,
      groupId: m.groupId,
      text: m.text,
      userId: m.sender?._id,
      userName: m.sender
        ? `${m.sender.firstName} ${m.sender.lastName}`
        : "Unknown User",
      createdAt: m.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Failed to load messages",
    });
  }
});

// --------------------
// SOCKET SERVER
// --------------------
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// --------------------
// ONLINE USERS
// --------------------
const onlineUsers = new Map();

// --------------------
// SOCKET EVENTS
// --------------------
io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  // USER ONLINE
  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);

    io.emit(
      "onlineUsers",
      Array.from(onlineUsers.keys())
    );
  });

  // JOIN GROUP
  socket.on("join_group", (groupId) => {
    socket.join(groupId);
  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {
    try {
      const {
        groupId,
        userId,
        text,
      } = data;

      if (!groupId || !userId || !text) {
        return;
      }

      const message = new Message({
        groupId,
        sender: userId,
        text,
      });

      await message.save();

      const populated =
        await Message.findById(
          message._id
        ).populate(
          "sender",
          "firstName lastName"
        );

      const formatted = {
        _id: populated._id,
        groupId: populated.groupId,
        text: populated.text,
        userId: populated.sender?._id,
        userName: populated.sender
          ? `${populated.sender.firstName} ${populated.sender.lastName}`
          : "Unknown User",
        createdAt: populated.createdAt,
      };

      io.to(groupId).emit(
        "receive_message",
        formatted
      );
    } catch (err) {
      console.log(err);
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
      }
    }

    io.emit(
      "onlineUsers",
      Array.from(onlineUsers.keys())
    );
  });
});

// --------------------
// START SERVER
// --------------------
server.listen(5000, () => {
  console.log(
    "Server running on http://localhost:5000"
  );
});