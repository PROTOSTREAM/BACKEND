const express = require("express");
const { getUserById, getUser } = require("../controllers/user");
const router = express.Router();

router.param("UserId", getUserById);

router.get("/user/:UserId", getUser);

module.exports = router;
