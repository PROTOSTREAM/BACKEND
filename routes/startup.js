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
const { getMentorUserById, getMentorUser} = require("../controllers/mentors");

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
otplogin,
otpverify,
getStep2ById,
getStep2,
exportMentorandOpenForm,
createStep2,
getStep3ById,
getStep3,
exportStep2andOpenForm3,
createStep3,
getStep2Id,
getAllStep2,
selectIdea,
editIdea
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


//router.param("step3Id",getIdeaById,getStep3ById);

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

router.param("userId", getUserById,getIdeaById,getStep2ById,getStep3ById);
router.param("mentorId",getMentorUserById,getStep2Id);
//router.param("ideaId",getIdeaById);




//user routes
router.get("/getIdea/:userId",isSignedIn,getIdeaById,getIdea);

router.get("/getTrl/:userId",isSignedIn, getTrlValues);
router.post("/updateTrl/:userId",isSignedIn, updateTrlValues);
router.post("/createIdea/:userId",isSignedIn, createIdea);
//router.get("/getUserIdea/:userId", getIdeaOfUser);

router.post("/idea/chooseBranch/:userId",isSignedIn, getIdeaById,chooseBranch);
router.get("/idea/otplogin/:userId",isSignedIn,getIdeaById, otplogin);
router.post("/idea/otpverify/:userId",isSignedIn,getIdeaById, otpverify);


router.get("/idea/clickStep2/:userId",isSignedIn,getIdeaById,getStep2ById,exportMentorandOpenForm);
router.post("/idea/createStep2/:userId",isSignedIn,getIdeaById,getStep2ById,createStep2);
router.get("/idea/getStep2/:userId",isSignedIn,getStep2ById,getStep2);

//router.get("/idea/getStep2/:userId",getIdeaById,getStep2ById,getStep2);
router.get("/idea/clickStep3/:userId",isSignedIn,getIdeaById,getStep3ById,exportStep2andOpenForm3);
//router.post("/idea/createStep2/:userId",getIdeaById,getStep2ById,createStep2);
//router.get("/idea/getStep2/:userId",getStep2ById,getStep2);


router.get("/idea/dropIdea/:userId",isSignedIn,getIdeaById, deleteIdea);

//Mentor Routes
router.get("/getMentor/:mentorId",getMentorUser);
router.get("/idea/getIdeas/:mentorId",getAllStep2);
router.post("/idea/selectIdea/:mentorId",getStep2Id,selectIdea);
router.post("/idea/editIdea/:mentorId",getStep2Id,editIdea);

module.exports = router;
