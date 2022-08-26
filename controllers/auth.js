require("dotenv").config();
const User = require("../models/user");
const TbiUser = require("../models/tbi");
const MentorUser = require("../models/mentors");
const ExternalUser = require("../models/externalUser");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var _ = require("lodash");
const { VideoGrant } = require("twilio/lib/jwt/AccessToken");

const regx = /^([a-z]+)(\.)([0-9]{4})([a-z]{2,4})([0-9]{4})(@)(kiet)(\.)(edu)$/;
const tbiregx = /^(tbikiet)(@)(gmail)(\.)(com)$/;
const mentorRegx = /^([a-z]+)(\.)([a-z]{2,4})(@)(kiet)(\.)(edu)$/;
const externalUser = /^([a-zA-Z0-9_]*)(@)(gmail)(\.)(com)$/;


const mentor_emails = {
  CSE: [
    "",
    "mentora.cse@kiet.edu",
    "mentorb.cse@kiet.edu",
    "mentorc.cse@kiet.edu",
  ],
  CS: ["mentora.cs@kiet.edu", "mentorb.cs@kiet.edu", "mentorc.cs@kiet.edu"],
  IT: ["mentora.it@kiet.edu", "mentorb.it@kiet.edu", "mentorc.it@kiet.edu"],
  CSIT: [
    "mentora.csit@kiet.edu",
    "mentorb.csit@kiet.edu",
    "mentorc.csit@kiet.edu",
  ],
  EEE: ["mentora.eee@kiet.edu", "mentorb.eee@kiet.edu", "mentorc.eee@kiet.edu"],
  ECE: ["mentora.ece@kiet.edu", "mentorb.ece@kiet.edu", "mentorc.ece@kiet.edu"],
  ME: ["mentora.me@kiet.edu", "mentorb.me@kiet.edu", "mentorc.me@kiet.edu"],
  CE: ["mentora.ce@kiet.edu", "mentorb.ce@kiet.edu", "mentorc.ce@kiet.edu"],
  MCA: ["mentora.mca@kiet.edu", "mentorb.mca@kiet.edu", "mentorc.mca@kiet.edu"],
  MBA: ["mentora.mba@kiet.edu", "mentorb.mba@kiet.edu", "mentorc.mba@kiet.edu"],
};
const tbi_emails = [
  "tbikiet@gmail.com",
  "tbi1@kiet.edu",
  "tbi2@kiet.edu",
  "tbi3@kiet.edu",
  "tbi4@kiet.edu",
];

exports.register = (req, res) => {
  console.log("inside register");
  if (
    regx.test(req.body.email) ||
    tbiregx.test(req.body.email) ||
    mentorRegx.test(req.body.email)
  ) {
    if (regx.test(req.body.email)) {
      let testemail = req.body.email;
      let data = _.capitalize(testemail).split(".");
      let proname = data[0];
      let proid = data[1].split("@")[0];
      let probranch = proid.slice(4, 6);
      let proyear = "20" + proid.slice(0, 2) + "-" + proid.slice(2, 4);
      let profiledata = {
        Profilename: proname,
        ProfileID: proid,
        ProfileBranch: probranch,
        ProfileYear: proyear,
      };
      User.findOne({ email: req.body.email }, function (err, foundUser) {
        // console.log("[Found User]",foundUser);
        if (foundUser) {
          return res.json({ error: "Email already registered" });
        } else {
          bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            const newUser = new User({
              email: req.body.email,
              password: hash,
              profiledata: profiledata,
              role: 0,
              number: req.body.number,
            });

            newUser.save(function (err, savedUser) {
              // console.log("[SavedUser]",savedUser);
              if (!err) {
                const token = jwt.sign(
                  { _id: newUser._id },
                  process.env.SECRET_KEY
                );
                res.cookie("token", token, { expire: new Date() + 7 });
                const {
                  _id,
                  projects,
                  hackathons,
                  schemes,
                  startup,
                  email,
                  profiledata,
                  role,
                  phonestatus,
                  number,
                  TRL_Test,
                } = savedUser;

                return res.send({
                  token,
                  cookies: res.cookies,
                  user: {
                    _id,
                    projects,
                    hackathons,
                    email,
                    schemes,
                    startup,
                    profiledata,
                    role,
                    phonestatus,
                    number,
                    TRL_Test,
                  },
                });
              } else {
                return res.status(400).json({
                  error: err,
                });
              }
            });
          });
        }
      });
    } else if (tbiregx.test(req.body.email)) {
      console.log("inside");
      let testemail = req.body.email;
      let data = _.capitalize(testemail).split("@");
      let proname = data[0];
      let profiledata = {
        Profilename: proname,
      };
      console.log(profiledata);
      TbiUser.findOne({ email: req.body.email }, function (err, foundUser) {
        // console.log("[Found User]",foundUser);
        if (foundUser) {
          return res.json({ error: "Email already registered" });
        } else {
          bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            const newUser = new TbiUser({
              email: req.body.email,
              password: hash,
              profiledata: profiledata,
              role: 2,
              number: req.body.number,
            });

            newUser.save(function (err, savedUser) {
              // console.log("[SavedUser]",savedUser);
              if (!err) {
                const token = jwt.sign(
                  { _id: newUser._id },
                  process.env.SECRET_KEY
                );
                res.cookie("token", token, { expire: new Date() + 7 });
                const { _id, email, profiledata, role, number } = savedUser;

                return res.send({
                  token,
                  cookies: res.cookies,
                  user: {
                    _id,
                    email,
                    profiledata,
                    role,
                    number,
                  },
                });
              } else {
                return res.status(400).json({
                  error: err,
                });
              }
            });
          });
        }
      });
    } else if (
      mentorRegx.test(req.body.email) &&
      mentor_emails[req.body.branch].includes(req.body.email)
    ) {
      console.log("inside mentor signup");
      let testemail = req.body.email;
      let data = _.capitalize(testemail).split(".");
      let proname = data[0];
      let branch = _.lowerCase(data[1].split("@")[0]);
      let profiledata = {
        Profilename: proname,
      };
      console.log(profiledata);
      MentorUser.findOne({ email: req.body.email }, function (err, foundUser) {
        // console.log("[Found User]",foundUser);
        if (foundUser) {
          return res.json({ error: "Email already registered" });
        } else {
          bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            const newUser = new MentorUser({
              email: req.body.email,
              password: hash,
              profiledata: profiledata,
              role: 3,
              department: branch,
              number: req.body.number,
            });

            newUser.save(function (err, savedUser) {
              // console.log("[SavedUser]",savedUser);
              if (!err) {
                const token = jwt.sign(
                  { _id: newUser._id },
                  process.env.SECRET_KEY
                );
                res.cookie("token", token, { expire: new Date() + 7 });
                const { _id, email, profiledata, role, department, number } =
                  savedUser;

                return res.send({
                  token,
                  cookies: res.cookies,
                  user: {
                    _id,
                    email,
                    profiledata,
                    department,
                    role,
                    number,
                  },
                });
              } else {
                return res.status(400).json({
                  error: err,
                });
              }
            });
          });
        }
      });
    }
  } 
  else if(externalUser.test(req.body.email)){
    console.log("inside");
    let testemail = req.body.email;
    let data = _.capitalize(testemail).split("@");
    let proname = data[0];
    let profiledata = {
      Profilename: proname,
    };
    ExternalUser.findOne({ email: req.body.email }, function (err, foundUser) {
      // console.log("[Found User]",foundUser);
      if (foundUser) {
        return res.json({ error: "Email already registered" });
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          const newUser = new ExternalUser({
            email: req.body.email,
            password: hash,
            profiledata: profiledata,
            role: 5,
            number: req.body.number,
          });

          newUser.save(function (err, savedUser) {
            // console.log("[SavedUser]",savedUser);
            if (!err) {
              const token = jwt.sign(
                { _id: newUser._id },
                process.env.SECRET_KEY
              );
              res.cookie("token", token, { expire: new Date() + 7 });
              const { _id, email, profiledata, role, number } = savedUser;

              return res.send({
                token,
                cookies: res.cookies,
                user: {
                  _id,
                  email,
                  profiledata,
                  role,
                  number,
                },
              });
            } else {
              return res.status(400).json({
                error: err,
              });
            }
          });
        });
      }
    });

  }
  else {
    return res.status(400).json("Invalid Email id");
  }
};

exports.login = (req, res) => {
  console.log("in login route");
  const username = req.body.email;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  if (regx.test(req.body.email)) {
    User.findOne({ email: username }, function (err, foundUser) {
      console.log("inside User find");
      if (err || !foundUser) {
        console.log("error", err);
        return res.status(400).json({
          error: err || "User not found",
        });
      } else {
        console.log("else case");
        if (foundUser) {
          // console.log("found user",foundUser);
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result === true) {
              const token = jwt.sign(
                { _id: foundUser._id },
                process.env.SECRET_KEY
              );
              // console.log(typeof token);
              // res.cookie("hii", "hiiia");
              console.log(req.cookies);
              // res.cookie("token", token);

              const {
                _id,
                projects,
                hackathons,
                schemes,
                startup,
                email,
                profiledata,
                role,
                number,
                phonestatus,
                TRL_Test,
              } = foundUser;
              // console.log(res.headers);
              // return res.send("sending response");

              // req.profile = foundUser;
              console.log("returning ");
              return res.send({
                token,
                cookies: res.cookies,
                user: {
                  _id,
                  projects,
                  hackathons,
                  email,
                  schemes,
                  startup,
                  profiledata,
                  role,
                  number,
                  phonestatus,
                  TRL_Test,
                },
              });
            } else {
              return res.status(401).json({
                error: "Email or password do not match",
              });
            }
          });
        }
      }
    });
  } else if (tbiregx.test(req.body.email)) {
    TbiUser.findOne({ email: username }, function (err, foundUser) {
      console.log("inside TBI find");
      if (err || !foundUser) {
        console.log("error", err);
        return res.status(400).json({
          error: err || "User not found",
        });
      } else {
        console.log("else case");
        if (foundUser) {
          // console.log("found user",foundUser);
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result === true) {
              const token = jwt.sign(
                { _id: foundUser._id },
                process.env.SECRET_KEY
              );
              // console.log(typeof token);
              // res.cookie("hii", "hiiia");
              console.log(req.cookies);
              // res.cookie("token", token);

              const { _id, email, profiledata, role, number } = foundUser;
              // console.log(res.headers);
              // return res.send("sending response");

              // req.profile = foundUser;
              console.log("returning ");
              return res.send({
                token,
                cookies: res.cookies,
                user: {
                  _id,
                  email,
                  profiledata,
                  role,
                  number,
                },
              });
            } else {
              return res.status(401).json({
                error: "Email or password do not match",
              });
            }
          });
        }
      }
    });
  } else if (mentorRegx.test(req.body.email)) {
    MentorUser.findOne({ email: username }, function (err, foundUser) {
      console.log("inside MENTOR find");
      if (err || !foundUser) {
        console.log("error", err);
        return res.status(400).json({
          error: err || "User not found",
        });
      } else {
        console.log("else case");
        if (foundUser) {
          // console.log("found user",foundUser);
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result === true) {
              const token = jwt.sign(
                { _id: foundUser._id },
                process.env.SECRET_KEY
              );
              // console.log(typeof token);
              // res.cookie("hii", "hiiia");
              console.log(req.cookies);
              // res.cookie("token", token);

              const {
                _id,
                email,
                profiledata,
                role,
                department,
                number,
                Ideas,
              } = foundUser;
              // console.log(res.headers);
              // return res.send("sending response");

              // req.profile = foundUser;
              console.log("returning ");
              return res.send({
                token,
                cookies: res.cookies,
                user: {
                  _id,
                  email,
                  profiledata,
                  role,
                  department,
                  number,
                  Ideas,
                },
              });
            } else {
              return res.status(401).json({
                error: "Email or password do not match",
              });
            }
          });
        }
      }
    });
  } else {
    return res.status(200).json({
      error: "Outsider not allowed",
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "User signout Successfully",
  });
};

// protected Routes..

exports.isSignedIn = (req, res, next) => {
  // console.log(req.headers);
  // console.log(req.cookies);
  // console.log(req.session);
  next();
};

exports.isAuthenticated = (req, res, next) => {
  console.log(req.profile);
  console.log(req.auth);
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  // console.log(req.profile);
  if (req.profile.role === 1) {
    next();
  } else {
    return res.status(403).json({
      error: "You are not admin, Access Denied",
    });
  }
};

exports.isTBI = (req, res, next) => {
  if (req.profile.role === 2) {
    next();
  } else {
    return res.status(403).json({
      error: "You are not TBI Member, Access Denied",
    });
  }
};

exports.isMENTOR = (req, res, next) => {
  if (req.profile.role === 3) {
    next();
  } else {
    return res.status(403).json({
      error: "You are not Mentor, Access Denied",
    });
  }
};
