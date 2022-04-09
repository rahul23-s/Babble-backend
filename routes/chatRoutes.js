const express = require("express");
const router = express.Router();
const { authorize } = require("../middlewares/auth");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");

router.route("/").post(authorize, accessChat);
router.route("/").get(authorize, fetchChats);
router.route("/group").post(authorize, createGroupChat);
router.route("/rename").put(authorize, renameGroup);
router.route("/groupadd").put(authorize, addToGroup);
router.route("/groupremove").put(authorize, removeFromGroup);

module.exports = router;
