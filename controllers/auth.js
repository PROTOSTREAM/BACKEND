require("dotenv").config();
const User = require("../models/user");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var _ = require("lodash");
const { VideoGrant } = require("twilio/lib/jwt/AccessToken");

exports.register = (req, res) => {
  console.log("inside register");
  console.log(req.body);
  emails = ["vineet.sharma@kiet.edu", "hod.verma@kiet.edu"];

  let regx = /^([a-z]+)(\.)([0-9]{4})([a-z]{2})([0-9]{4})(@)(kiet)(\.)(edu)$/;
  let tbiregx = /^([a-z]+)(\.)([a-z]+)(@)(kiet)(\.)(edu)$/;

  if (regx.test(req.body.email) || tbiregx.test(req.body.email)) {
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
                  email,
                  profiledata,
                  role,
                  phonestatus,
                  number,
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
                    profiledata,
                    role,
                    phonestatus,
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
      tbiregx.test(req.body.email) &&
      emails.includes(req.body.email)
    ) {
      let testemail = req.body.email;
      let data = _.capitalize(testemail).split(".");
      let proname = data[0];
      let prosurname = data[1].split("@")[0];
      let profiledata = {
        Profilename: proname + " " + prosurname,
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
                const {
                  _id,
                  projects,
                  hackathons,
                  schemes,
                  email,
                  profiledata,
                  role,
                  phonestatus,
                  number,
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
                    profiledata,
                    role,
                    phonestatus,
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
  } else {
    return res.status(400).json("Invalid Email id");
  }
};

exports.login = (req, res) => {
  console.log("in login route");
  const username = req.body.email;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  User.findOne({ email: username }, function (err, foundUser) {
    console.log("inside find");
    if (err || !foundUser) {
      console.log("error",err);
      return res.status(400).json({
        error: err || "User not found",
      });
    }
     else {
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
              email,
              profiledata,
              role,
              number,
              phonestatus,
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
                profiledata,
                role,
                number,
                phonestatus,
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
  if (req.profile.role === 3) {
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
