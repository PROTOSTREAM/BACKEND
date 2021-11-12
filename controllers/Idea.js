const User = require("../models/user");
const Idea = require("../models/Ideas/idea");
const Step2 = require("../models/Ideas/Step2");
const Step3 = require("../models/Ideas/Step3");
const url = require('url');

//!Idea..

//!Step2.

exports.getStep2 = (req, res, id, next) => {
  Step2.findById({ _id: id }).then((err, idea) => {
    if (err || !idea) {
      return res.status(500).json({
        error: err || "Idea Not found",
      });
    }

    res.Step2 = idea;
    next();
  });
};

exports.createStep2 = (req, res) => {
  step2 = new Step2(req.body);
  step2.save().then((err, step) => {
    if (err || !step) {
      return res.status(500).json({
        error: err || "Step2 Not Created!!",
      });
    }

    //! save all steps to mentor and save mentor to step2..
    Mentor.findOneAndUpdate({ _id: req.body.mentorId }, {}, { new: true });

    return res.status(200).json(step);
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


//user signin routes
exports.getIdeaById = (req, res, next) => {
  console.log("iammiddleware");
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
  console.log(req);
  return res.json(
    req.idea,
  );
}



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
                });        
              }
            }
          );
        });
      }
      else{
        return res.status(200).json({
          "Idea_ID":req.profile.startup._id,
        })
      }      
  }else{
    return res.status(500).json({
      error: "TRL NOT COMPLETED",
    });
  }
    

 
};

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
      message: "Idea Deleted",
      });
    });
    
  });
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

exports.chooseBranch = (req, res) => {
  console.log(req.profile.startup);
  id = req.profile.startup;
  
  Idea.findOneAndUpdate({ _id: id }, { department: req.body.branch },{new:true},
    (err, UpdatedIdea) => {
      if (err || !UpdatedIdea) {
        return res.status(404).json({
          error: err || "User Not found ",
        });
      }

      return res.status(200).json(UpdatedIdea);
    });
};

//!Step2..

exports.createReview = (req, res) => {};
//!Step3...

exports.updateIdea = (req, res) => {};

exports.otplogin = (req, res) => {
  console.log(req.profile.number);
  console.log("inside otp login");

  if (req.profile.number) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+${req.profile.number}`,
        channel: "sms",
      })
      .then((data) => {
        if (data.status === "pending") {
          res.status(200).send({ data });
        }
        Idea.findOneAndUpdate(
          { _id: req.Idea._id },
          { phonestatus: data.status },
          { new: true },
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              // console.log(result);
            }
          }
        );
      });
  } else {
    res.status(400).send({
      message: "Wrong number :(",
    });
  }
};

exports.otpverify = (req, res) => {
  if (req.body.code.length === 6) {
    console.log("inside this");
    Idea.findOne({ _id: req.Idea._id }).exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      } else {
        client.verify
          .services(process.env.SERVICE_ID)
          .verificationChecks.create({
            to: `+${req.profile.number}`,
            code: req.body.code,
          })
          .then((data) => {
            const status = data.status;
            console.log(status);
            if (status === "approved") {
              res.status(200).send({ data });
              console.log("after sending..");
              Idea.findOneAndUpdate(
                { _id: req.Idea._id },
                { phonestatus: data.status },
                { new: true },
                function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    // console.log(result);
                  }
                }
              );
            } else {
              res.status(400).send({
                err: "wrong code",
              });
            }
          })
          .catch((err) => console.log(err));
      }
    });
  } else {
    res.status(400).send({
      message: "Wrong code:(",
    });
  }
};
