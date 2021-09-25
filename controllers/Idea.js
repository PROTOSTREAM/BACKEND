const User = require("../models/user");
const Idea = require("../models/Ideas/idea");
const Step2 = require("../models/Ideas/Step2");
const Step3 = require("../models/Ideas/Step3");

//!Idea..

exports.getIdeaById = (req, res, id, next) => {
  Idea.findById({ _id: id }).then((err, idea) => {
    if (err || !idea) {
      return res.status(500).json({
        error: err || "Idea Not found",
      });
    }
    res.Idea = idea;
  });
};
exports.createIdea = (req, res) => {
  Idea.save(req.body).then((err, idea) => {
    if (err || !idea) {
      return res.status(500).json({
        error: err || "Idea cannot be created",
      });
    }

    res.status(200).json({
      message: "Idea Created",
      idea: idea,
    });
  });
};

exports.deleteIdea = (req, res) => {
  const id = req.idea._id;
  Idea.deleteOne({ _id: id }).then((err, deletedIdea) => {
    if (err || !deletedIdea) {
      return res.status(500).json({
        error: err || "Idea cannot be deleted",
      });
    }
    return res.status(200).json({
      message: "Idea Deleted",
    });
  });
};

//!Step2..

exports.createReview = (req, res) => {};
//!Step3...

exports.updateIdea = (req, res) => {};
