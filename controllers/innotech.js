require('dotenv/config');
const Innotech = require("../models/innotech");
const Hackathon = require("../models/innotech");
const User = require("../models/user");


exports.getInnotechOfUser = (req, res) => {
  console.log("inside getInnotechOfUser");
  User.findById({ _id: req.profile._id })
    .populate("innotechs")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      return res.status(200).json(user.innotechs);
    });
    
};
exports.getInnotechById = (req, res, next, id) => {
  console.log("in getUserById");
  Innotech.findById(id).exec((err, innotech) => {
    if (err || !innotech) {
      return res.status(400).json({
        error: "No Innotech was found in DB",
      });
    }
    req.innotech = innotech;
    next();
  });
};

exports.findAllInnotechs = (req, res) => {
  Innotech.find().exec((err, innotechs) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.status(200).json(innotechs);
  });
};



exports.createNewInnotech = (req, res) => {
console.log(req.profile.PhoneVerfication);
  if(req.profile.PhoneVerfication==="Not-Verified"){
  let innotechs = [];
  const innotech = new Innotech(req.body);
  console.log(innotech);
  innotech.save((err, innotech) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }

    innotechs.push(innotech);

    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { innotechs: innotechs } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save innotech",
          });
        }
      }
    );

    res.status(200).json(innotech);
  });
}
else{
  res.status(400).json({error:"Phone not verified"});
}
};

exports.DeleteInnotech = (req, res) => {
  let innotech = req.innotech;
  console.log(req.innotech);
  innotech.remove((err, deletedInnotech) => {
    if (err || !deletedInnotech) {
      res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "innotech deleted",
      deletedInnotech,
    });
  });
};
