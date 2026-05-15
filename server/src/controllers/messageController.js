const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      groupId: req.params.groupId,
    }).populate("sender", "firstName lastName");

    const formatted = messages.map((m) => ({
      _id: m._id,
      groupId: m.groupId,
      text: m.text,
      userId: m.sender?._id,
      userName: m.sender
        ? `${m.sender.firstName} ${m.sender.lastName}`
        : "Unknown",
      createdAt: m.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};