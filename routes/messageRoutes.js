const express = require("express");
const { authorize } = require("../middlewares/auth");
const {
  sendMessage,
  allMessages,
  deleteMessage,
} = require("../controllers/messageControllers");
const router = express.Router();

router.route("/").post(authorize, sendMessage);
router.route("/:chatId").get(authorize, allMessages);
router.delete("/:messageId", authorize, deleteMessage);

module.exports = router;
