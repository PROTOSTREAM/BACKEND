const User = require("../models/user");
const Idea = require("../models/Ideas/idea");
const Step2 = require("../models/Ideas/Step2");
const Step3 = require("../models/Ideas/Step3");
const MentorUser = require("../models/mentors");
//!Not completed..

// exports.getAllMentorIdeas = (req, res) => {
//   mentor = req.Mentor;
//   mentor.populate("ListOfIdeas").then((Ideas) => {
//     console.log(Ideas.ListOfIdeas);
//   });
// };


exports.getUserById = (req, res, next, id) => {
  // console.log("in getUserById");
  // console.log(id);
  MentorUser.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};


// exports.createReview = (req, res) => {};

// exports.updateIdea = (req, res) => {};

// exports.getMentor = (req, res, id, next) => {
//   Mentor.findById({ _id: id }).then((err, mentor) => {
//     if (err || !mentor) {
//       return res.status(500).json({
//         error: err || "Mentor not found ",
//       });
//     }

//     req.Mentor = mentor;
//   });
// };

// exports.getAllDepartmentMentors = (req, res) => {
//   Mentor.find({ department: req.body.department }).then((err, mentors) => {
//     if (err || !mentors) {
//       return res.status(404).json({
//         error: err || "Mentor not found ",
//       });
//     }

//     return res.status(200).json(mentors);
//   });
// };

// exports.createMentor = (req, res) => {};

// exports.deleteMentor = (req, res) => {};
// exports.reviewIdea = (req, res) => {};
