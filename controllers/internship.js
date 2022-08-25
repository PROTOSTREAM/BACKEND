const internship = require("../models/internship");
const Internship = require("../models/internship");

exports.createNewInternship = (req, res) => {
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

  res.status(200).json(internship);
};

exports.findAllInternships = (req, res) => {
  Internship.find().exec((err, internship) => {
    if (err || !internship) {
      res.status(400).json({
        error: "error",
      });
    }
    res.status(200).json(internship);
  });
};
