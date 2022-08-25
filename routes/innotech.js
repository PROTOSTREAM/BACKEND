const express = require("express");
const {
  findAllInnotechs,
  getInnotechOfUser,
  createNewInnotech,
} = require("../controllers/innotech");

const { getUserById } = require("../controllers/user");
const {
  getHackYear,
  getInnotechById,
  DeleteInnotech,
} = require("../controllers/innotech");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

const router = express.Router();

// router.param("HackYear", getHackYear);
router.param("innotechId", getInnotechById);
router.param("UserId", getUserById);


//hackathon route---> static page have 2 buttons for see hackathon project list by year and,
// create new hackathon project having by user have userID

router.get("/innotech/allInnotechs", isSignedIn, findAllInnotechs);
router.get("/innotech/:UserId", isSignedIn, getInnotechOfUser);
router.post("/innotech/createInnotech/:UserId", isSignedIn, createNewInnotech);


router.delete(
  "/innotech/:innotechId/:UserId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  DeleteInnotech
);



module.exports = router;
