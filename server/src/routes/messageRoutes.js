const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

// SEND MESSAGE + FILE
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  sendMessage
);

// GET MESSAGES
router.get(
  "/:groupId",
  authMiddleware,
  getMessages
);

module.exports = router;