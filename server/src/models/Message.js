const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    text: {
      type: String,
      default: "",
    },

    // FILE SUPPORT
    file: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);