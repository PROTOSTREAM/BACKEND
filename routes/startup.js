const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "presentation") {
      fs.access("public", function (error) {
        if (error) {
          console.log("Public Directory does not exist!!");
          fs.mkdir("./public/", (err) => {
            if (err) {
              return console.log(err);
            } else {
              console.log("Public Directory created.");
              let dir = "./public";
              fs.mkdir(dir + "/presentation/", (err) => {
                if (err) {
                  return console.error(err);
                } else {
                  console.log("File Directory created.");
                  cb(null, "public/presentation");
                }
              });
            }
          });
        } else {
          console.log("Public Directory exists.");
          fs.access("public/presentation", function (error) {
            if (error) {
              console.log("presentation Directory does not exist!!");
              fs.mkdir("./public/presentation", (err) => {
                if (err) {
                  return console.log(err);
                } else {
                  console.log("presentation directory created.");
                  cb(null, "public/presentation");
                }
              });
            } else {
              console.log("presentation Directory exists!!");
              cb(null, "public/presentation");
            }
          });
        }
      });
    } else if (file.fieldname === "uploadnda") {
      fs.access("public", function (error) {
        if (error) {
          console.log("Public Directory does not exist.");
          fs.mkdir("./public/", (err) => {
            if (err) {
              return console.log(err);
            } else {
              console.log("Public Directory created.");
              let dir = "./public";
              fs.mkdir(dir + "/uploadnda/", (err) => {
                if (err) {
                  return console.error(err);
                } else {
                  console.log("uploadnda Directory created.");
                  cb(null, "public/uploadnda");
                }
              });
            }
          });
        } else {
          console.log("Public Directory exists.");
          fs.access("public/uploadnda", function (error) {
            if (error) {
              console.log("uploadnda Directory does not exist!!");
              fs.mkdir("./public/uploadnda", (err) => {
                if (err) {
                  return console.log(err);
                } else {
                  console.log("uploadnda directory created.");
                  cb(null, "public/uploadnda");
                }
              });
            } else {
              console.log("uploadnda Directory exists!!");
              cb(null, "public/uploadnda");
            }
          });
        }
      });
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "nda") {
      cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    } else if (file.fieldname === "presentation") {
      cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    } else if (file.fieldname === "uploadnda") {
      cb(null, file.fieldname + "-" + Date.now() + file.originalname);
    }
  },
});

const upload = multer({ storage: multerStorage });

const { getUserById, getUser } = require("../controllers/user");
const { getMentorUserById, getMentorUser } = require("../controllers/mentors");
const { getTbiUserById, getTbiUser } = require("../controllers/tbi");

const { isSignedIn, isAuthenticated, isTBI, isMENTOR} = require("../controllers/auth");

const {
getTrlValues,
updateTrlValues,
createIdea,
getIdeaOfUser,
chooseBranch,
getIdeaById,
getIdea,
deleteIdea,
} = require("../controllers/Idea");
// const {
//   createNewStartup,
//   readytoRegister,
//   getStartupById,
//   otplogin,
//   otpverify,
//   isSens,
//   ndaUpload,
//   findAllUserNdas,
//   findAllNdas,
//   getNda,
//   getNdaById,
//   verifyNda,
//   isNdaVerify,
//   internship,
//   findAllStartups,
// } = require("../controllers/startup");



//const { createNewInternship } = require("../controllers/internship");

const router = express.Router();

router.param("userId", getUserById,getIdeaById);
router.param("tbiId", getTbiUserById);
router.param("mentorId",getMentorUserById);
//router.param("startupId", getStartupById);
//router.param("ndaId", getNdaById);

//router.use("/startup/createinternship/", isSens);

// SENS ROUTES
// router.get("/startup/:userId", isSignedIn, readytoRegister);
// router.get("/startup/register/:userId", isSignedIn, otplogin);
// router.post("/startup/verify/:userId", isSignedIn, otpverify);
// router.post(
//   "/startup/nda/upload/:userId",
//   upload.single("uploadnda"),
//   isSens,
//   isSignedIn,
//   ndaUpload
// );

//router.get("/startups/allstartups/:userId", findAllStartups);

// REGISTER ROUTES
// router.post(
//   "/createstartup/:ndaId/:userId",
//   upload.single("presentation"),
//   isSens,
//   isNdaVerify,
//   isSignedIn,
//   createNewStartup
// );
// router.post("/createstartup/:userId",upload.single('presentation'),
//             // isSens,
//             // isNdaVerify,
//             isSignedIn,
//             createNewStartup,
// );                                                         // 2ND TEST REMAINS WITH isNdaVerify and :ndaId
// router.post(
//   "/register/internship/:startupId/:userId",
//   isSignedIn,
//   isSens,
//   createNewInternship
// ); //NOT TESTED

//router.get("/myndas/:userId", isSignedIn, findAllUserNdas); //NOT TESTED

//TBI ROUTES
//router.post("/ndalist/:userId", isSignedIn, isTBI, findAllNdas); //NOT TESTED
//router.post("/nda/:ndaId/:userId", isSignedIn, isTBI, getNda); //NOT TESTED
//router.patch("/verifynda/:ndaId/:userId", isSignedIn, isTBI, verifyNda); //NOT TESTED


//user routes
router.get("/getIdea/:userId",getIdeaById,getIdea);
router.get("/getTrl/:userId", getTrlValues);
router.post("/updateTrl/:userId", updateTrlValues);
router.post("/createIdea/:userId", createIdea);
router.get("/getUserIdea/:userId", getIdeaOfUser);
router.post("/chooseBranch/:userId", chooseBranch);

router.get("/dropIdea/:userId",getIdeaById, deleteIdea);

module.exports = router;
