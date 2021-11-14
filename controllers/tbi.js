const Tbi = require("../models/tbi");

exports.getTbiUserById = (req, res, next, id) => {
  // console.log("in getUserById");
  // console.log(id);
  Tbi.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    console.log(req.profile);
    next();
  });
};

exports.getTbiUser = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};