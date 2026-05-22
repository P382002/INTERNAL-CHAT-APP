const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

require("./cronjobs/resetWFHCron"); // FIXED: was ./cronJobs (capital J)

const Message = require("./models/Message");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// ======================
// DATABASE
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ======================
// SERVER + SOCKET
// ======================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io);

// ======================
// ROUTES
// ======================
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api/leave", leaveRoutes(io));

// ======================
// GROUPS
// ======================
app.get("/api/groups", async (req, res) => {
  try {
    const groups = await mongoose
      .model("Group")
      .find()
      .populate("members");

    const formatted = await Promise.all(
      groups.map(async (g) => {
        const lastMessage = await Message.findOne({ groupId: g._id })
          .sort({ createdAt: -1 })
          .populate("sender", "firstName lastName");

        return {
          ...g.toObject(),
          lastMessage: lastMessage
            ? {
                text: lastMessage.text,
                sender: lastMessage.sender
                  ? `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`
                  : "User",
                createdAt: lastMessage.createdAt,
              }
            : null,
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// ======================
// MESSAGES
// ======================
app.get("/api/messages/:groupId", async (req, res) => {
  try {
    const messages = await Message.find({
      groupId: req.params.groupId,
    }).populate("sender", "firstName lastName");

    res.json(
      messages.map((m) => ({
        _id: m._id,
        groupId: m.groupId,
        text: m.text,
        userId: m.sender?._id,
        userName: m.sender
          ? `${m.sender.firstName} ${m.sender.lastName}`
          : "Unknown",
        createdAt: m.createdAt,
      }))
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// ======================
// SOCKET
// ======================
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("join_group", (groupId) => {
    socket.join(groupId);
  });

  socket.on("send_message", async (data) => {
    try {
      const { groupId, userId, text } = data;
      if (!groupId || !userId || !text) return;

      const message = await Message.create({
        groupId,
        sender: userId,
        text,
      });

      const populated = await Message.findById(message._id).populate(
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
          : "Unknown",
        createdAt: populated.createdAt,
      };

      io.to(groupId).emit("receive_message", formatted);
      io.emit("refresh_groups");
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) onlineUsers.delete(userId);
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});