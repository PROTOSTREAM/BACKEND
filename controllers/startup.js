require("dotenv/config");
const Internship = require("../models/internship");
const Startup = require("../models/startup");
const User = require("../models/user");
const Nda = require("../models/nda");
const fs = require("fs");
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

exports.readytoRegister = (req, res) => {
  res.send({
    name: req.profile.profiledata.Profilename,
    number: req.profile.number,
    status: req.profile.phonestatus,
  });
};

exports.isSens = (req, res, next) => {
  if (req.profile.role === 1) {
    next();
  } else {
    return res.json({
      error: "Access Denied",
    });
  }
};

exports.otplogin = (req, res) => {
  console.log(req.profile.number);
  console.log("inside otp login");
  // console.log(req.profile);
  // console.log(req.profile.number);
  // console.log(process.env.RESET_PASS_SERVICE_ID);
  if (req.profile.number) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+${req.profile.number}`,
        channel: "sms",
      })
      .then((data) => {
        if (data.status === "pending") {
          res.status(200).send({ data });
        }
        User.findOneAndUpdate(
          { _id: req.profile._id },
          { phonestatus: data.status },
          { new: true },
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              // console.log(result);
            }
          }
        );
      });
  } else {
    res.status(400).send({
      message: "Wrong number :(",
    });
  }
};


exports.otpverify = (req, res) => {

  if (req.body.code.length === 6) {
    console.log("inside this");
    User.findOne({ email: req.profile.email }).exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        client.verify
          .services(process.env.SERVICE_ID)
          .verificationChecks.create({
            to: `+${req.profile.number}`,
            code: req.body.code,
          })
          .then((data) => {
            const status = data.status;
            console.log(status);
            if (status=== "approved") {
              res.status(200).send({ data });
              console.log("after sending..");
              User.findOneAndUpdate(
                { _id: req.profile._id },
                { phonestatus: data.status,role:1 },
                {new: true},
                function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    // console.log(result);
                  }
                });
            } else {
              res.status(400).send({
                err: "wrong code",
              });
            }
          }).catch(err =>console.log(err));
      }
    });
  } else {
    res.status(400).send({
      message: "Wrong code:(",
    });
  }
};


exports.ndaUpload = (req,res) => {
  console.log(req.profile.phonestatus);
  if(req.profile.phonestatus==="approved"){
    let uploadNda = fs.readFileSync(req.file.path);
    let encode_uploadNda = uploadNda.toString("base64");
    let final_uploadNda = {
      path: req.file.path,
      contentType: req.file.mimetype,
      file: Buffer.from(encode_uploadNda, "base64"),
    };
    const { StartupName } = req.body;
  
    const nda = new Nda({
      StartupName,
      Nda: final_uploadNda,
    });
    nda.save((err, nda) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      const NDA = [];
      NDA.push(nda);
  
      User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { ndas: NDA } },
        { new: true },
        (err, nda) => {
          if (err) {
            return res.status(400).json({
              error: "Unable to save hackathon",
            });
          } else {
            return res.status(200).json(nda);
          }
        }
      );
    });
  }
  else{
    res
      .status(400)
      .json({
        error: "You have not proper register your phone no. for Startup!!",
      });
  }
  
};



exports.getNdaById = (req, res, next, id) => {
  Nda.findById(id).exec((err, nda) => {
    if (err || !nda) {
      return res.status(400).json({
        error: "No nda was found in DB",
      });
    }
    req.nda = nda;
    next();
  });
};


exports.getNda = (req, res) => {
  return res.json(req.nda);
};

exports.findAllNdas = (req, res) => {
  Nda.find().exec((err, nda) => {
    if (err || !nda) {
      res.status(500).json({
        error: err,
      });
    }
    res.status(200).json(nda);
  });
};

exports.findAllUserNdas = (req, res) => {
  console.log("inside findndausers");
  User.findById({ _id: req.profile._id })
    .populate("ndas")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.status(200).json(user.ndas);
    });
};

exports.verifyNda = (req, res) => {
  Nda.findOneAndUpdate(
    { _id: req.nda._id },
    { VerifyByTbi: true },
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.status(200).send({
          msg: "Nda Verified",
        });
      }
    }
  );
};

exports.isNdaVerify = (req, res, next) => {
  Nda.findOne({ _id: req.nda._id }, function (err, foundnda) {
    if (true) {
      next();
    } else {
      return res.json({
        msg: "Nda not Verified",
        status: false,
      });
    }
  });
};

exports.createNewStartup = (req, res) => {
  if (req.profile.phonestatus === "approved") {
    let presentationFile = fs.readFileSync(req.file.path);
    let encode_presentationFile = presentationFile.toString("base64");
    let final_presentationFile = {
      path: req.file.path,  
      contentType: req.file.mimetype,
      file: Buffer.from(encode_presentationFile, "base64"),
    };
    const {
      StartupName,
      StartupDomain,
      StartupStage,
      StartupType,
      FounderName,
      FounderEmail,
      AadharNumber,
      StartupBreif,
      CofounderName,
      CofounderEmail,
      CofounderNumber,
      Link,
      ProjectSummary,
    } = req.body;
    const startup = new Startup({
      StartupName,
      StartupDomain,
      StartupStage,
      StartupType,
      FounderName,
      FounderEmail,
      AadharNumber,
      StartupBreif,
      CofounderName,
      CofounderEmail,
      CofounderNumber,
      Link,
      ProjectSummary,
      PresentationFile: final_presentationFile,
    });
    startup.save((err, startup) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      }
      startups=[]
      startups.push(startup);
      User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { startups: startups } },
        { new: true },
        (err, updatedUser) => {
          if (err) {
            console.log("inside error");
            return res.status(400).json({
              error: "Unable to save hackathon",
            });
          } else {
            res.status(200).json(startup);
          }
        }
      );
    });
  } else {
    res
      .status(400)
      .json({
        error: "You have not proper register your phone no. for Startup!!",
      });
  }
};

exports.internship = (req, res) => {
  const internship = new Internship(req.body);
  internship.save((err, Internship) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { internship: Internship } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save hackathon",
          });
        }
      }
    );
  });
};

exports.getStartupById = (req, res) => {
  User.findById({ _id: req.profile._id })
    .populate("startups")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      return res.status(200).json(user.startups);
    });
};

exports.findAllStartups = (req, res) => {
  Startup.find().exec((err, startup) => {
    if (err || !startup) {
      res.status(500).json({
        error: err,
      });
    }

    res.status(200).json(startup);
  });
};
