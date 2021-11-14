require("dotenv").config();
const User = require("../models/user");
const Idea = require("../models/Ideas/idea");
const Step2 = require("../models/Ideas/Step2");
const Step3 = require("../models/Ideas/Step3");
const Mentor = require("../models/mentors");
const url = require('url');

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//!Idea..


// USER FUNCTIONALITIES
//user signin routes
exports.getIdeaById = (req, res, next) => {
  if(!(req.profile.startup)){
    return res.status(400).json({
      "Idea_ID":null,
      "Message":"idea not created yet"
    });
  }
  console.log("iammiddleware of idea");
  Idea.findById( {_id: req.profile.startup}).exec((err, idea) => {
    if (err || !idea) {
      return res.status(500).json({
        error: err || "Idea Not found",
      });
    }
    console.log(idea);
    req.idea = idea;
    next();
  });
};

exports.getIdea = (req,res)=>{
  console.log(req.idea);
  return res.json({
    "Idea":req.idea,
  });
};

exports.getStep2ById = (req, res, next) => {
      //console.log(req.idea);
      if(req.idea.status==="new-idea-created"){
          return res.status(200).json({
            "Idea":req.idea,
            "Message":"You have not choose branch yet",
          });
      }
      if(req.idea.status==="branch-choosed"){
          return res.status(200).json({
            "Idea":req.idea,
            "Message":"Step1 not completed yet"
          });
      }
      if(req.idea.status==="Step1-complete"){
        console.log("iam goin to open step2");
        next();
      }
      if(req.idea.status==="Step2-form-open"){
        console.log("redirect to open form of Step2");
        next();
      }
      if(req.idea.status==="under-reviewed" || req.idea.status==="reviewed" || req.idea.status==="under-verified" || req.idea.status==="verified" || req.idea.status==="approved" || req.idea.status==="not-verified"){
          Step2.findById({ _id: req.idea.Step2 },(err, Step2) => {
          if (err || !Step2) {
            return res.status(500).json({
              error: err || "Idea Not found",
            });
          }
          req.step2 = Step2;
          return res.json({
            "Step2":req.step2,
            "Message":"Step2 already created above"
          }
          )
        });
      }
};


exports.getStep3ById = (req, res, next) => {
  console.log(req.idea);
      if(req.idea.status==="new-idea-created"){
          return res.status(200).json({
            "Idea":req.idea,
            "Message":"You have not choose branch yet",
          });
      }
      if(req.idea.status==="branch-choosed"){
          return res.status(200).json({
            "Idea":req.idea,
            "Message":"Step1 not completed yet"
          });
      }
      if(req.idea.status==="Step1-complete" || req.idea.status==="Step2-form-open"){
          return res.status(200).json({
            "Idea":req.idea,
            "Message":"Complete your Step2"
          });
      }
      if(req.idea.status==="under-reviewed"){
         return res.status(200).json({
            "Idea":req.idea,
            "Message":"Step2 not reviewed yet"
          });
      }
      if(req.idea.status==="reviewed" || req.idea.status==="approved"){
        console.log("iam goin to open step3");
        next();
      }
      if(req.idea.status==="Step3-form-open"){
        console.log("redirect to open form of Step3");
        next();
      }
      if(req.idea.status==="under-verified" || req.idea.status==="verified" || req.idea.status==="not-verified"){
          Step3.findById({ _id: req.idea.Step3 },(err, Step3) => {
          if (err || !Step3) {
            return res.status(500).json({
              error: err || "Idea Not found",
            });
          }
          req.step3 = Step3;
          return res.json({

          }
            
          )
        });
      }
};


exports.exportMentorandOpenForm = (req,res)=>{
    let ideaId = req.idea._id;
    let branch=req.idea.department;
    Mentor.find({department:"eee"},(err,mentors)=>{
        if(err || !mentors){
          return res.status(500).json({
            error: err || "Mentors not avaiable yet",
          })
        }
        Idea.findOneAndUpdate({_id:ideaId},{status:"Step2-form-open"},{new:true},(err,UpdatedIdea)=>{
          if(err || !UpdatedIdea){
              return res.status(500).json({
              error: err || "Idea Not found",
            });
          }
          return res.status(200).json({
            "Mentor":mentors,
            "Idea":UpdatedIdea,
            "Message":"Step2 form will open now",
          });
        });
    });
}

exports.exportStep2andOpenForm3 = (req,res)=>{
    let step2Id = req.step2._id;
    let mentorId = req.step2.Mentor._id;
    let mentorInfo = {};
    if(step2.review==="1"){
         Mentor.find({_id:mentorId},(err,mentor)=>{
        if(err || !mentor){
          return res.status(500).json({
            error: err || "Mentors not avaiable yet",
          })
        }
        mentorInfo=mentor;        
    });
    }
    Idea.findOneAndUpdate({_id:ideaId},{status:"Step3-form-open"},{new:true},(err,UpdatedIdea)=>{
          if(err || !UpdatedIdea){
              return res.status(500).json({
              error: err || "Idea Not found",
            });
          }
          return res.status(200).json({
            "Mentor":mentorInfo,
            "Idea":UpdatedIdea,
            "Message":"Step2 form will open now",
          });
        });
}

exports.getStep2 = (req,res)=>{
  console.log(req);
  return res.json(
    req.step2,
  )
};

exports.getStep3 = (req,res)=>{
  console.log(req);
  return res.json(
    req.step3,
  )
};


exports.getTrlValues = (req, res) => {
  User.findById({ _id: req.profile._id },function(err,user) {
    if(err||!user){
      console.log("error",err);
        return res.status(400).json({
          error: err || "User not found",
        });
    }
         return res.status(200).json({
          "Trl_value": user.TRL_Test,
        });
  });
}
    

exports.updateTrlValues = (req, res) => {
  id = req.profile._id;
    console.log(id);
  User.findOneAndUpdate({ _id: id }, { TRL_Test: req.body.TRL_Test },{new:true},function(err, UpdatedUser) {
      if (err || !UpdatedUser) {
        return res.status(404).json({
          error: err || "User Not found ",
        });
      }
      return res.status(200).json({
        "Trl_value": UpdatedUser.TRL_Test,
      });
    }
  );
};

exports.createIdea = (req, res) => {
  trlValue = req.profile.TRL_Test;
  console.log(!(req.profile.startup));
  if (trlValue==="pass") {
      if(!(req.profile.startup)){
        const idea = new Idea();
        req.profile.startup=undefined;
        idea.Student=req.profile;
    
        idea.save((err, idea) => {
          console.log(idea);
          if (err || !idea) {
            return res.status(500).json({
              error: err || "Idea cannot be created",
            });
          }

          User.findOneAndUpdate(
            { _id: req.profile._id },
            { startup:idea },
            { new: true },
            (err, updatedUser) => {
              console.log(updatedUser);
              if (err) {
                return res.status(400).json({
                  error: "Unable to save Idea",
                });
              }
              else{
                return res.status(200).json({
                  "Idea":idea,
                  "Message":"Created Fresh Idea"
                });        
              }
            }
          );
        });
      }
      else{
          Idea.findById( {_id: req.profile.startup}).exec((err, idea) => {
            if (err || !idea) {
              return res.status(500).json({
              error: err || "Idea Not found",
              });
            }
            return res.status(200).json({
              "Idea":idea,
              "Message":"Idea already created"
            });
          });
      }      
  }else{
    return res.status(500).json({
      error: "TRL NOT COMPLETED",
    });
  }
};




//STEP-1
exports.otplogin = (req, res) => {
  console.log(req.idea);
  console.log(req.profile.number);
  console.log("inside otp login");
  console.log(req.idea.department);
  if(!(req.idea.department)){
    return res.status(200).json({
      "Idea":req.idea,
      "Message":"Branch not choosen"
    })
  }
  if(req.idea.status!=="Step1-complete" || req.idea.status==="under-reviewed" || req.idea.status==="reviewed" || req.idea.status==="approved" || req.idea.status==="under-verified" || req.idea.status==="verified" || req.idea.status==="not-verified"){
    return res.status(200).json({
      "Idea":req.idea,
      "Message":"You have already verified your number"
    })
  }
  else{
    if (req.profile.number) {
      console.log("got a number")
      client.verify
        .services(process.env.SERVICE_ID)
        .verifications.create({
          to: `+91${req.profile.number}`,
          channel: "sms",
        })
        .then((data) => {
          if (data.status === "pending") {
            console.log("after pending..");
            Idea.findOneAndUpdate(
              { _id: req.idea._id },
              { phonestatus: data.status },
              { new: true },
              function (err, UpdatedIdea) {
                if (err) {
                  console.log(err);
                }
                res.status(200).json({
                  "Idea":UpdatedIdea,
                  "Data":data,
                  "Message":"otp sent"
                }); 
              }
            );
          }

        });
    } else {
      res.status(400).send({
        "Message": "Wrong number :( or otp already sent",
      });
    }
  }
};

exports.otpverify = (req, res) => {
    if(!(req.idea.department)){
    return res.status(200).json({
      "Idea":req.idea,
      "Message":"Branch not choosen"
    })
  }
  if(req.idea.status!=="Step1-complete" || req.idea.status==="under-reviewed" || req.idea.status==="reviewed" || req.idea.status==="approved" || req.idea.status==="under-verified" || req.idea.status==="verified" || req.idea.status==="not-verified"){
    return res.status(200).json({
      "Idea":req.idea,
      "Message":"You have already verified your number"
    })
  }
  else{
    if (req.body.code.length === 6 && req.idea.phonestatus==="pending") {
    console.log("inside this");
        client.verify
          .services(process.env.SERVICE_ID)
          .verificationChecks.create({
            to: `+91${req.profile.number}`,
            code: req.body.code,
          })
          .then((data) => {
            const status = data.status;
            console.log(status);
            if (status === "approved") {
              console.log("after verifying..");
              Idea.findOneAndUpdate(
                { _id: req.idea._id },
                {$set:{ phonestatus: data.status,status: "Step1-complete"}},
                { new: true },
                function (err, UpdatedIdea) {
                  if (err) {
                    console.log(err);
                  }
                  res.status(200).json({
                    "Idea":UpdatedIdea,
                    "Data":data,
                    "Message":"otp sent"
                  });                 
                }
              );
            } else {
              res.status(400).send({
                err: "wrong code",
              });
            }
          });
    }
    else {
    res.status(400).send({
      message: "Wrong code:( or already verified",
    });
  }
  }


};

//showtoUser
exports.getIdeaOfUser = (req, res) => {
  console.log("inside getIdeaOfUser");
  console.log(req.profile.startup);
  User.findById({ _id: req.profile._id })
    .populate("startup")
    .exec((err, user) => {
      console.log(user.startup);
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.status(200).json(user.startup);
    });
};


//deletebyUser
exports.deleteIdea = (req, res) => {
  console.log(req.idea);
  const id = req.idea._id;
  Idea.deleteOne({ _id: id },{new:true},(err, deletedIdea) => {
    if (err || !deletedIdea) {
      return res.status(500).json({
        error: err || "Idea cannot be deleted",
      });
    }
    User.findOneAndUpdate({_id:req.profile._id},{$unset:{"startup":""}},{new:true},function(err,User){
      if(err || !User){
        return res.status(404).json({
          error: err || "User Not found ",
        });
      }
      return res.status(200).json({
      profile: User,
      "Message": "Idea Deleted",
      });
    });
    
  });
};

exports.chooseBranch = (req, res) => {
  console.log("inside choosen branch");
  
  id = req.idea._id;
  if(!(req.idea.department)){
    Idea.findOneAndUpdate({ _id: id },{$set:{ department: req.body.branch, status:"branch-choosed" }} ,{new:true},
      (err, UpdatedIdea) => {
        if (err || !UpdatedIdea) {
          return res.status(404).json({
            error: err || "User Not found ",
          });
        }

        return res.status(200).json({
            "Idea":UpdatedIdea,
            "Message":"Branch choosen"
        });
      });
  }
  else{
  return res.status(200).json({
    "Idea":req.idea,
    "Message":"Branch already choosen above"
  });
  }
};




exports.createStep2 = (req, res) => {
  console.log("iamin create form");
  console.log(req.idea);
  console.log(req.idea._id);
  console.log(req.body.mentorId);
  let underMentor=req.body.mentorId;
  let mainIdea=req.idea;
  console.log(req.body);
  const step2 = new Step2(req.body);
        req.idea.Step2=undefined;
        step2.underIdea=mainIdea._id;
        step2.Mentor=underMentor;
        step2.save((err, step2) => {
          console.log(step2);
          if (err || !step2) {
            return res.status(500).json({
              error: err || "Step2 cannot be created",
            });
          }
          Idea.findOneAndUpdate(
            { _id: req.idea._id },
            {$set:{Step2:step2,status:"under-reviewed"}},
            { new: true },
            (err, updatedIdea) => {
              console.log(updatedIdea);
              if (err) {
                return res.status(400).json({
                  error: "Unable to save Step2",
                });
              }
              else{
                let arr_step2 = [];

                arr_step2.push(step2);

                Mentor.findOneAndUpdate(
                  { _id: underMentor },
                  { $push: { Ideas: arr_step2 } },
                  { new: true },
                  (err, updatedMentor) => {
                    if (err) {
                      return res.status(400).json({
                        error: "Unable to send idea to Mentor",
                      });
                    }
                    return res.status(200).json({
                      "Step2":step2,
                      "Idea":updatedIdea,
                      "Mentor":underMentor,
                      "Message":"Created Fresh Step2",
                    });  
                  }
                );
                      
              }
            }
          );
        });

};

exports.createStep3 = (req, res) => {
  step3 = new Step3(req.body);
  step3.save().then((err, step) => {
    if (err || !step) {
      return res.status(500).json({
        error: err || "Step2 Not Created!!",
      });
    }
    return res.status(200).json(step);
  });
};

//!Step3.

exports.getStep3 = (req, res, id, next) => {
  Step3.findById({ _id: id }).then((err, idea) => {
    if (err || !idea) {
      return res.status(500).json({
        error: err || "Idea Not found",
      });
    }

    res.Step3 = idea;
    next();
  });
};




//!Step2..

exports.createReview = (req, res) => {};
//!Step3...

exports.updateIdea = (req, res) => {};


