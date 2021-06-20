const express = require("express");
const {
  findAllProjects,
  createProject,
} = require("../controllers/projectController");
const { getUserById } = require("../controllers/user");

const router = express.Router();

router.get("/projects", findAllProjects);

//params..
router.param("UserId", getUserById);

router.post("/project/:UserId", createProject);

module.exports = router;
