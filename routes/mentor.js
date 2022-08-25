const express = require("express");
const { getMentorUserById,getMentor } = require("../controllers/mentors");
const router = express.Router();

router.param("MentorUserId", getMentorUserById);

router.get("/user/:MentorUserId", getMentorUser);

module.exports = router;
