require("dotenv").config();
const User = require("../models/user");
const mongoose = require("mongoose");

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const bcrypt = require("bcrypt");
const salt = 10;


exports.isEmailRegister = (req,res,next) => {
    User.findOne( {email:req.body.email}, function (err,founduser) {
        if (founduser) { 
            next();
         } else {
             return res.json({
                 msg: "User not found",
             });
         }
    });
}

exports.passLogin = (req,res) => {
            console.log(req.body.email);
            if (req.body.email) {
                User.findOne({ email: req.body.email })
                .exec((err, user) => {
                    if (err) {
                    return res.status(400).json({
                        error: err,
                    });
                    }else{
                    client.verify.services(process.env.RESET_PASS_SERVICE_ID).verifications
                    .create({
                        to: `+${user.number}`,
                        channel: 'sms'
                    })
                    .then(data => {
                        if(data.status==="pending"){
                            res.status(200).send({data});
                        }
                        User.findOneAndUpdate(
                            { _id: req.profile._id },
                            { otpstatus: "sent" },
                            { new: true },
                            function(err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(result);
                            }
                            }
                        );
                    });   
                    }
                    
                });
            } else {
                res.status(400).send({
                    message: "Wrong email :(",
                });
            }
}


exports.passVerify = (req,res) => {
        
        if ((req.body.code).length === 6) {
            User.findOne({ email: req.body.email })
            .exec((err, user) => {
                if (err) {
                return res.status(400).json({
                    error: err,
                });
                }   
                else{
                    client.verify.services(process.env.RESET_PASS_SERVICE_ID).verificationChecks
                .create({
                    to: `+${user.number}`,
                    code: req.body.code
                })
                .then(data => {
                    if (data.status === "approved") { 
                        res.status(200).send({data});
                        User.findOneAndUpdate(
                            { _id: req.profile._id },
                            { otpstatus: "notsent" },
                            function(err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(result);
                                }
                            }
                        );
                    }else{
                        res.status(400).send({
                            err: "wrong code",
                        })
                    }
                    });
                }
            });    
        } else {
            res.status(400).send({
                message: "Wrong code:(",
            })
        }
}


exports.passwordChange = (req,res) => {
    let email=req.body.email;
    let newPassword=req.body.password;
    bcrypt.genSalt(salt, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
            if(err){
                console.log(err);
            }
            else{
                User.findOneAndUpdate(
                    { email: req.body.email },
                    { password: hash },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                          } else {
                            console.log(result);
                            res.status(200).send({
                                msg:"Password update",
                            })
                          }
                    }
                );
            }
        });
    });
}

