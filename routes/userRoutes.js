const express = require("express");
const { authorize } = require("../middlewares/auth");
const {
  registerUser,
  authUser,
  allUsers,
  updateProfilePhoto,
} = require("../controllers/userControllers");

const router = express.Router();

router.route("/").post(registerUser).get(authorize, allUsers);
router.post("/login", authUser);
router.put("/profile/photo", authorize, updateProfilePhoto);

module.exports = router;

