const express = require("express");
const { getTbiUserById,getTbiUser } = require("../controllers/tbi");
const router = express.Router();

router.param("TbiUserId", getTbiUserById);

router.get("/user/:TbiUserId", getTbiUser);

module.exports = router;
