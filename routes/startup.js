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
const { getTbiUserById,getTbiUser } = require("../controllers/tbi");

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
selectIdea2,
editIdea2,
getStep3Id,
getAllStep3,
selectIdea3,
editIdea3,
createSlot
} = require("../controllers/Idea");


const router = express.Router();



// router.post(
//   "/startup/nda/upload/:userId",
//   upload.single("uploadnda"),
//   isSens,
//   isSignedIn,
//   ndaUpload
// );


// REGISTER ROUTES
// router.post(
//   "/createstartup/:ndaId/:userId",
//   upload.single("presentation"),
//   isSens,
//   isNdaVerify,
//   isSignedIn,
//   createNewStartup
// );


//params
router.param("userId", getUserById,getIdeaById,getStep2ById,getStep3ById);
router.param("mentorId",getMentorUserById,getStep2Id);
router.param("tbiId",getTbiUserById,getStep3Id);


//user routes
router.get("/getIdea/:userId",isSignedIn,getIdeaById,getIdea);

router.get("/getTrl/:userId",isSignedIn, getTrlValues);
router.post("/updateTrl/:userId",isSignedIn, updateTrlValues);

router.post("/createIdea/:userId",isSignedIn, createIdea);

router.post("/idea/chooseBranch/:userId",isSignedIn, getIdeaById,chooseBranch);

router.get("/idea/otplogin/:userId",isSignedIn,getIdeaById, otplogin);
router.post("/idea/otpverify/:userId",isSignedIn,getIdeaById, otpverify);

router.get("/idea/clickStep2/:userId",isSignedIn,getIdeaById,getStep2ById,exportMentorandOpenForm);
router.post("/idea/createStep2/:userId",isSignedIn,getIdeaById,getStep2ById,createStep2);
router.get("/idea/getStep2/:userId",isSignedIn,getStep2ById,getStep2);

router.get("/idea/clickStep3/:userId",isSignedIn,getIdeaById,getStep3ById,exportStep2andOpenForm3);
router.post("/idea/createStep3/:userId",isSignedIn,getIdeaById,getStep3ById,createStep3);
router.get("/idea/getStep3/:userId",isSignedIn,getStep3ById,getStep3);

router.get("/idea/dropIdea/:userId",isSignedIn,getIdeaById, deleteIdea);


//Mentor Routes
router.get("/getMentor/:mentorId",getMentorUser);
router.get("/idea/getMENTORIdeas/:mentorId",getAllStep2);
router.post("/idea/selectIdea/:mentorId",getStep2Id,selectIdea2);
router.post("/idea/editIdea/:mentorId",getStep2Id,editIdea2);

//Tbi Routes
router.get("/getTbi/:tbiId",getTbiUser);
router.get("/idea/getTBIIdeas/:tbiId",getAllStep3);
router.post("/idea/selectIdea3/:tbiId",getStep3Id,selectIdea3);
router.post("/idea/editIdea3/:tbiId",getStep3Id,editIdea3);
router.post("/idea/createSlot/:tbiId",getStep3Id,createSlot);



module.exports = router;
