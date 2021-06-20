const Hackathon = require("../models/hackathon");
const User = require("../models/user");

exports.getHackathonOfUser = (req, res) => {
  console.log("inside getHackathonOfUser");
  User.findById({ _id: req.profile._id })
    .populate("hackathons")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      return res.status(200).json(user.hackathons);
    });
};
exports.getHackathonById = (req, res, next, id) => {
  console.log("in getUserById");
  Hackathon.findById(id).exec((err, hackathon) => {
    if (err || !hackathon) {
      return res.status(400).json({
        error: "No Hackathon was found in DB",
      });
    }
    req.hackathon = hackathon;
    next();
  });
};

exports.findAllHackathons = (req, res) => {
  Hackathon.find().exec((err, hackathons) => {
    if (err) {
      return res.json({
        error: err,
      });
    }
    res.status(200).json(hackathons);
  });
};

//this middleware not sending data, which is require
//channel = "sms"

exports.otpverification = (req, res, next) => {
  let vermobile = "+" + req.body.leaderMobile;
  console.log(vermobile);
  client.verify
    .services(opt.serviceId)
    .verifications.create({
      to: vermobile,
      channel: req.body.channel,
    })
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    });
  next();
};

exports.createNewHackathon = (req, res) => {
  const hackathon = new Hackathon(req.body);
  hackathon.save((err, hackathon) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    }
    let hackathons = [];

    hackathons.push(hackathon);

    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { hackathons: hackathons } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: "Unable to save hackathon",
          });
        }
      }
    );

    res.status(200).json(hackathon);
  });
};

exports.DeleteHackathon = (req, res) => {
  let hackathon = req.hackathon;
  hackathon.remove((err, deletedHackathon) => {
    if (err || !deletedHackathon) {
      res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "hackathon deleted",
      deletedHackathon,
    });
  });
};
