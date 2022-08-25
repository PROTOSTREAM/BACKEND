const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    
      if(file.fieldname==="image"){
        fs.access("public", function(error) {
          if (error) {
            console.log("Public Directory does not exist.")
            fs.mkdir('./public/',(err)=>{
              if(err) {
                return console.log(err);
              }
              else{
                console.log("Public Directory created.");
                let dir= './public';
                fs.mkdir(dir + '/image/', (err)=> {
                  if (err){
                    return console.error(err);
                  } else{
                    console.log("Image Directory created.");
                    cb(null, "public/image");
                  }
                });
              }
            });
          } 
          else {
            console.log("Public Directory exists.")
            fs.access('public/image', function(error) {
                  if(error) {
                    console.log("Image Directory does not exist!!");
                    fs.mkdir('./public/image',(err)=>{
                      if(err) {
                        return console.log(err);
                      }
                      else{
                        console.log("Image directory created.");
                        cb(null, "public/image");
                      }
                    });
                  }
                  else{
                    console.log("Image Directory exists!!");
                    cb(null, "public/image");
                  }
              });
          }
        });
        
      }
      else if(file.fieldname==="files"){
        fs.access("public", function(error) {
          if (error) {
            console.log("Public Directory does not exist!!")
            fs.mkdir('./public/',(err)=>{
              if(err) {
                return console.log(err);
              }
              else{
                console.log("Public Directory created.");
                let dir= './public';
                fs.mkdir(dir + '/files/', (err)=> {
                  if (err) {
                    return console.error(err);
                  } else{
                    console.log("File Directory created.");
                    cb(null, "public/files");
                  }
                });
              }
            });
          } 
          else {
            console.log("Public Directory exists.")
            fs.access('public/files', function(error) {
                  if(error) {
                    console.log("Files Directory does not exist!!");
                    fs.mkdir('./public/files',(err)=>{
                      if(err) {
                        return console.log(err);
                      }
                      else{
                        console.log("Files directory created.");
                        cb(null, "public/files");
                      }
                    });
                  }
                  else{
                    console.log("Files Directory exists!!");
                    cb(null, "public/files");
                  }
              });
          }
        });
      }
  },
  filename: (req, file, cb) => {
      if(file.fieldname==="image"){
          cb(null, file.fieldname + '-' + Date.now() + file.originalname);
      }
      else if(file.fieldname==="files"){
          cb(null, file.fieldname + '-' + Date.now() + file.originalname);
      }
  },
});

const upload = multer({storage: multerStorage});

const {
  findallSchemes,
  createNewScheme,
  DeleteScheme,
} = require("../controllers/scheme");

const { getUserById } = require("../controllers/user");

const { getSchemeById } = require("../controllers/scheme");

const { isSignedIn, isAdmin, isTBI } = require("../controllers/auth");

const router = express.Router();

router.param("schemeId", getSchemeById);
router.param("UserId", getUserById);

// this route showing error-----

router.get("/schemes/allSchemes", isSignedIn, findallSchemes);


router.post(
  "/schemes/createScheme/:UserId",upload.fields([{
  name: 'image', maxCount: 1
}, {
  name: 'files', maxCount: 1
}]),
  isSignedIn,
  isTBI,
  createNewScheme
);
  
  router.delete("/schemes/:schemeId/:UserId", isSignedIn, isAdmin, DeleteScheme);
  
  module.exports = router;
  
  