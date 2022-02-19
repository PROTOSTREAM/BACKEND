require("dotenv").config();
const User = require("../models/user");
const Idea = require("../models/Ideas/idea");
const Step2 = require("../models/Ideas/Step2");
const Step3 = require("../models/Ideas/Step3");
const Mentor = require("../models/mentors");
const Tbi = require("../models/tbi");
const url = require('url');

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);


//IDEA CONTROLLERS(TBI,USER,MENTORS)


//FUTURE WORK-  EDIT SLOT, TBI TASKS, FEEDBACK PAGE OF TBI, 


exports.ideaProgressPage = (req,res)=>{
      let ideaId=req.body.ideaId;
      if(req.profile.role===0){
        Idea.findById({ _id: ideaId },function(err,Idea) {
            if(err||!Idea){
              console.log("error",err);
                return res.status(400).json({
                  error: err || "Idea not found",
                });
            }
                return res.status(200).json({
                  "Idea": Idea,
                  "User": "STUDENT"
                });
          });          
      }
      if(req.profile.role===2){
        Idea.findById({ _id: ideaId },function(err,Idea) {
            if(err||!Idea){
              console.log("error",err);
                return res.status(400).json({
                  error: err || "Idea not found",
                });
            }
                return res.status(200).json({
                  "Idea": Idea,
                  "User": "TBI"
                });
          });          
      }
      if(req.profile.role===3){
        Idea.findById({ _id: ideaId },function(err,Idea) {
            if(err||!Idea){
              console.log("error",err);
                return res.status(400).json({
                  error: err || "Idea not found",
                });
            }
                return res.status(200).json({
                  "Idea": Idea,
                  "User": "MENTOR"
                });
          });          
      }
      else{
         return res.status(404).json({
                  "message":"No idea found",
                });
      }
}



exports.showAllFeedback = (req,res)=>{
  let ideaId = req.Idea._id;
  let coming_attendance=req.body.attend;      //value=present/absent
  let coming_slot=req.body.slot_no;
  Idea.updateOne({_id:ideaId,"Session.Slot":coming_slot},{$set:{"Session.$.":coming_attendance}},{new:true},(err,UpdatedIdea)=>{
            if(err || !UpdatedIdea){
                return res.status(500).json({
                error: err || "Attendance not updated",
              });
            }
              return res.status(200).json({
                  Idea:UpdatedIdea,
                  message:"Attendance Updated"
              })   
          });
}

exports.updateFeedback = (req,res)=>{
  let ideaId = req.body.ideaId;
  let coming_feedback=req.body.feedback;      //value=student feedback
  let coming_slot=req.body.slot_no;
  Idea.updateOne({_id:ideaId,"Session.Slot":coming_slot},{$set:{"Session.$.Feedback":coming_feedback}},{new:true},(err,UpdatedIdea)=>{
            if(err || !UpdatedIdea){
                return res.status(500).json({
                error: err || "Feedback not updated",
              });
            }
              return res.status(200).json({
                  Idea:UpdatedIdea,
                  message:"Feedback Updated"
              })   
          });
}

exports.updateComment = (req,res)=>{
  let ideaId = req.body.ideaId;
  let coming_comment=req.body.comment;      //value=tbi comment on feedback
  let coming_slot=req.body.slot_no;
  Idea.updateOne({_id:ideaId,"Session.Slot":coming_slot},{$set:{"Session.$.Comment":coming_comment}},{new:true},(err,UpdatedIdea)=>{
            if(err || !UpdatedIdea){
                return res.status(500).json({
                error: err || "Comment not updated",
              });
            }
              return res.status(200).json({
                  Idea:UpdatedIdea,
                  message:"Comment Updated"
              })   
          });
}


exports.milestoneProgress=(req,res)=>{
  let coming_message=req.body.message;
      if(req.profile.role===0){
        let data={
        Number:milestone_no,
        Student:"Nothing",
        Mentor:"Nothing",
        Tbi:"Nothing",
      }
      Idea.findByIdAndUpdate({_id:ideaId},{$push:{Milestone:data}},{new:true},(err,UpdatedIdea)=>{
            if(err || !UpdatedIdea){
                return res.status(500).json({
                error: err || "Milestone not updated",
              });
            }
              return res.status(200).json({
                  Idea:UpdatedIdea,
                  message:"Milestone updated by Student"
              })   
          });          
      }
      if(req.profile.role===2){
        Idea.findById({ _id: ideaId },function(err,Idea) {
            if(err||!Idea){
              console.log("error",err);
                return res.status(400).json({
                  error: err || "Idea not found",
                });
            }
                return res.status(200).json({
                  "Idea": Idea,
                  "User": "TBI"
                });
          });          
      }
      if(req.profile.role===3){
        Idea.findById({ _id: ideaId },function(err,Idea) {
            if(err||!Idea){
              console.log("error",err);
                return res.status(400).json({
                  error: err || "Idea not found",
                });
            }
                return res.status(200).json({
                  "Idea": Idea,
                  "User": "MENTOR"
                });
          });          
      }
      else{
         return res.status(404).json({
                  "message":"No idea found",
                });
      }
}

//TBI CONTROLLERS************************************


exports.updateAttendance = (req,res)=>{
  let ideaId = req.Idea._id;
  let coming_attendance=req.body.attend;      //value=present/absent
  let coming_slot=req.body.slot_no;
  Idea.updateOne({_id:ideaId,"Session.Slot":coming_slot},{$set:{"Session.$.Attend":coming_attendance}},{new:true},(err,UpdatedIdea)=>{
            if(err || !UpdatedIdea){
                return res.status(500).json({
                error: err || "Attendance not updated",
              });
            }
              return res.status(200).json({
                  Idea:UpdatedIdea,
                  message:"Attendance Updated"
              })   
          });
}





exports.checkSlot = (req,res)=>{
  let coming_slot=req.body.check_slot;
  let recent_slots=req.profile.provided_slots;

     //console.log(recent_slots);
      let value=recent_slots.includes(coming_slot);
      if(value===false){
        console.log("Approved");
          Tbi.findByIdAndUpdate({_id:req.profile._id},{$push:{provided_slots:coming_slot}},{new:true},(err,UpdatedTBI)=>{
            if(err || !UpdatedTBI){
                return res.status(500).json({
                error: err || "Idea Not found",
              });
            }
            console.log(UpdatedTBI);
            return res.status(200).json({
                message:"Slot available"
            })   
          });
      }
      else{
        return res.status(404).json({
          msg: "Slot not available"
        })
      }
}

exports.checkAttendanceSlot = (req,res)=>{
  let coming_slot=req.body.check_slot;
  let recent_slots=req.profile.provided_slots;
     //console.log(recent_slots);
      let value=recent_slots.includes(coming_slot);
      if(value===false){
            return res.status(200).json({
                message:"Slot not Found"
            });
      }
      else{
        console.log(coming_slot)
        Idea.find({'Session.Slot':coming_slot},(err,Ideas)=>{
          if(err || !Ideas){
            return res.status(500).json({
              error: err || "Ideas not found"
            });
          }
          console.log(Ideas[0].Session)
          return res.json({
            Idea_List: Ideas,
            msg: "found",
          })
        })
      }
}

exports.createSlot = (req,res)=>{
  let ideaId = req.Idea._id;
  let slot_no = req.body.Slot;

       let data={
        Slot:slot_no,
        Attend:"Pending",
        Feedback:"Nothing",
        Comment:"Nothing",
      }
      //let session=req.Idea.Session;
      //console.log(session);
          //session.push(data);      

          Idea.findByIdAndUpdate({_id:ideaId},{$push:{Session:data}},{new:true},(err,UpdatedIdea)=>{
            if(err || !UpdatedIdea){
                return res.status(500).json({
                error: err || "Idea Not found",
              });
            }
              return res.status(200).json({
                  Idea:UpdatedIdea,
                  message:"Slot Created"
              })   
          });
}


exports.getStep3Id = (req,res,next) =>{
        let id = req.body.ideaId;  
        //console.log(id);
        console.log(req.profile._id);
        Step3.findById({ _id: id},(err, Step3) => {
          if (err || !Step3) {
            return res.status(500).json({
              error: err || "Step3 Not found",
            });
          }
          Idea.findById({_id:Step3.underIdea},(err,Idea)=>{
            if(err || !Idea){
              return res.status(500).json({
                error: "IDea of step3 not found",
              })
            }
            
            req.step3 = Step3;
            req.Idea = Idea;
            console.log(req.Idea);
            next();
          });
          //console.log(req.step2);
          
        });
}


exports.getAllStep3 = (req,res) =>{
   Tbi.findById({ _id: req.profile._id })
    .populate("Ideas")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      console.log()
      return res.status(200).json(
        {
          "Ideas":user.Ideas,
        });
    });
}

exports.selectIdea3 = (req,res) =>{
      console.log(req.step3);
        return res.json({
          "Step3":req.step3,
        });
};


exports.getIdeaforTbi=(req,res)=>{
    Tbi.findById({ _id: req.profile._id })
        .populate("UserIdeas")
        .exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: err,
            });
          }
          
          return res.status(200).json(
            {
              "UserIDeas":user.UserIdeas,
            });
        });
  }



exports.openIdea = (req,res) =>{
    let ideaId = req.step3.underIdea;
    let step3Id = req.step3._id;
 //value===not-verified/verified
    console.log(ideaId);
    console.log()
    // if(req.step3.verify!=="not-verified" && req.step3.verify!=="verified"){

    // }
    // else{
    //   return res.status(200).json({
    //       "Step3":req.step3,
    //       "Message":"Already updated"
    //   });
    // }
        Idea.find({_id:ideaId},(err,UpdatedIdea)=>{
          if(err || !UpdatedIdea){
              return res.status(500).json({
              error: err || "Idea Not found",
            });
          }
              
                Step3.find({_id:step3Id},(err,UpdatedStep3)=>{
                      if(err || !UpdatedStep3){
                          return res.status(500).json({
                          error: err || "Idea Not found",
                        });
                      }
                     return res.status(200).json({
                        "Step3":UpdatedStep3,
                        "Idea":UpdatedIdea,
                        "Message":"Startup Dashboard form will open now",
                        "Action":"Idea got verified"
                      });
                });
        });
}

exports.editIdea3 = (req,res) =>{
    let ideaId = req.step3.underIdea;
    let step3Id = req.step3._id;
    let tbiReviewValue=req.body.value; 
    let value="0"; //value===not-verified/verified
    console.log(ideaId);
    console.log()
    // if(req.step3.verify!=="not-verified" && req.step3.verify!=="verified"){

    // }
    // else{
    //   return res.status(200).json({
    //       "Step3":req.step3,
    //       "Message":"Already updated"
    //   });
    // }
        Idea.findOneAndUpdate({_id:ideaId},{status:tbiReviewValue},{new:true},(err,UpdatedIdea)=>{
          if(err || !UpdatedIdea){
              return res.status(500).json({
              error: err || "Idea Not found",
            });
          }
              if(tbiReviewValue==="verified"){
                  value="1";
              }
              if(tbiReviewValue==="not-verified"){
                  value="-1";
              }
                Step3.findOneAndUpdate({_id:step3Id},{verify:value},{new:true},(err,UpdatedStep3)=>{
                      if(err || !UpdatedStep3){
                          return res.status(500).json({
                          error: err || "Idea Not found",
                        });
                      }
                     return res.status(200).json({
                        "Step3":UpdatedStep3,
                        "Idea":UpdatedIdea,
                        "Message":"Startup Dashboard form will open now",
                        "Action":"Idea got verified"
                      });
                });
        });
}




//MENTOR CONTROLLERS*********************************


exports.getStep2Id = (req,res,next) =>{
        let id = req.body.ideaId;  
        //console.log(id);
        console.log(req.profile._id);
        Step2.findById({ _id: id },(err, Step2) => {
          if (err || !Step2) {
            return res.status(500).json({
              error: err || "Step2 Not found",
            });
          }
          req.step2 = Step2;
          //console.log(req.step2);
          next();
        });
}

exports.getAllStep2 = (req,res) =>{
   Mentor.findById({ _id: req.profile._id })
    .populate("Ideas")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.status(200).json(
        {
          "Ideas":user.Ideas,
        });
    });
}

exports.selectIdea2 = (req,res) =>{
      console.log(req.step2);
        return res.json({
          "Step2":req.step2,
        });
};

exports.editIdea2 = (req,res) =>{
    let ideaId = req.step2.underIdea;
    let step2Id = req.step2._id;
    let mentorReviewValue=req.body.value;  //value===reviewed/approved
    let value="0";
    console.log(ideaId);
    console.log()
    // if(req.step2.review!=="not-verified" && req.step3.review!=="verified"){

    // }
    // else{
    //   return res.status(200).json({
    //       "Step3":req.step3,
    //       "Message":"Already updated"
    //   });
    // }
        Idea.findOneAndUpdate({_id:ideaId},{status:mentorReviewValue},{new:true},(err,UpdatedIdea)=>{
          if(err || !UpdatedIdea){
              return res.status(500).json({
              error: err || "Idea Not found",
            });
          }     if(mentorReviewValue==="approved"){
                    value="1";
                }
                if(mentorReviewValue==="reviewed"){
                    value="-1";
                }
                Step2.findOneAndUpdate({_id:step2Id},{review:value},{new:true},(err,UpdatedStep2)=>{
                      if(err || !UpdatedStep2){
                          return res.status(500).json({
                          error: err || "Idea Not found",
                        });
                      }
                     return res.status(200).json({
                        "Step2":UpdatedStep2,
                        "Idea":UpdatedIdea,
                        "Message":"Step3 form will open now",
                        "Action":"Idea got approved"
                      });
                });
          
        });
}




// USER CONTROLLERS*****************************



//CREATE IDEA MIDDLEWARE******************


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



//STEP:2 MIDDLEWARE***********************


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
      if(req.idea.status==="Step3-form-open"){
          return res.status(200).json({
            "Idea":req.idea,
            "Message":"Step2 already completed,Complete your Step3"
          });
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
            "Idea":req.idea,
            "Step2":req.step2,
            "Message":"Step2 already created above"
          }
          )
        });
      }
      if(req.idea.status==="Step2-form-open"){
        console.log("redirect to open form of Step2");
        next();
      }
      if(req.idea.status==="Step1-complete"){
        console.log("iam goin to open step2");
        next();
      }
      
};


// STEP:3 MIDDLEWARE***********************


exports.getStep3ById = (req, res, next) => {
  let step2Id = req.idea.Step2;
 
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
      if(req.idea.status==="under-verified" || req.idea.status==="verified" || req.idea.status==="not-verified"){
          Step3.findById({ _id: req.idea.Step3 },(err, Step3) => {
          if (err || !Step3) {
            return res.status(500).json({
              error: err || "Idea Not found",
            });
          }
          req.step3 = Step3;
          return res.json({
              "Idea":req.idea,
              "Step2":req.step2,
              "Message":"Step3 already created above"
          });
        });
      }
      if(req.idea.status==="Step3-form-open"){
        console.log("redirect to open form of Step3");
        req.step2Id=step2Id;
        next();
      }
      if(req.idea.status==="reviewed" || req.idea.status==="approved"){
        console.log("iam goin to open step3");
          req.step2Id=step2Id;
          next();
      }
      
};



//STEP:2 ONCLICK STEP2 BUTTON FUNCTIONALITY**************


exports.exportMentorandOpenForm = (req,res)=>{
    let ideaId = req.idea._id;
    let branch=req.idea.department;
    Mentor.find({department:branch},(err,mentors)=>{
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
          for(i=0;i<mentors.length;i++){
            mentors[i].password="";
          }
          return res.status(200).json({
            "Mentor":mentors,
            "Idea":UpdatedIdea,
            "Message":"Step2 form will open now",
          });
        });
    });
}


//STEP:3 ONCLICK STEP3 BUTTON FUNCTIONALITY*************


exports.exportStep2andOpenForm3 = (req,res)=>{

    let step2Id = req.step2Id;
    console.log(step2Id);
    let mentorId = "";
    let ideaId = "";
    Step2.findById({_id:step2Id},(err,foundStep2)=>{
      if(err || !foundStep2){
          return res.status(500).json({
            error: err || "Step2 not found",
          })
        }
        else{
          mentorId=foundStep2.Mentor;
          ideaId=foundStep2.underIdea;
          console.log(mentorId);
          console.log(ideaId);
            Idea.findOneAndUpdate({_id:ideaId},{status:"Step3-form-open"},{new:true},(err,UpdatedIdea)=>{
                  if(err || !UpdatedIdea){
                      return res.status(500).json({
                      error: err || "Idea Not found",
                    });
                  }
                  Mentor.find({_id:mentorId},(err,mentor)=>{
                    if(err || !mentor){
                      return res.status(500).json({
                        error: err || "Mentors not avaiable yet",
                      })
                    }  
                    if(foundStep2.review===1){
                          return res.status(200).json({
                            "Mentor":mentor,
                            "Idea":UpdatedIdea,
                            "Message":"Step3 form will open now",
                          });
                    }
                    else{
                          return res.status(200).json({
                            "Idea":UpdatedIdea,
                            "Message":"Step3 form will open now",
                          });
                    }  
                });                  
            });  
        }
    });
}



//STEP:2 EXTRACT STEP2***********


exports.getStep2 = (req,res)=>{
  console.log(req);
  return res.json(
    req.step2,
  )
};


//STEP:3 EXTRACT STEP3***********

exports.getStep3 = (req,res)=>{
  console.log(req);
  return res.json(
    req.step3,
  )
};


//EXTRACT TRL VALUE FROM USER**********

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
    

//UPDATE TRL VALUE OF USER*************

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


//INITIATION OF IDEA- ONCLICK REGISTER IDEA FUNCTIONALITY*****


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




//STEP-1********************


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
  else if(req.idea.status==="Step1-complete" || req.idea.status==="under-reviewed" || req.idea.status==="reviewed" || req.idea.status==="approved" || req.idea.status==="under-verified" || req.idea.status==="verified" || req.idea.status==="not-verified"  || req.idea.status==="Step3-form-open"){
    return res.status(200).json({
      "Idea":req.idea,
      "Message":"You have already verified your number"
    });
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
  else if(req.idea.status==="Step1-complete" || req.idea.status==="under-reviewed" || req.idea.status==="reviewed" || req.idea.status==="approved" || req.idea.status==="under-verified" || req.idea.status==="verified" || req.idea.status==="not-verified"  || req.idea.status==="Step3-form-open"){
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



//STEP:0************************


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



//STEP:2*******************************


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
                      "Mentor":updatedMentor,
                      "Message":"Created Fresh Step2",
                    });  
                  }
                );
                      
              }
            }
          );
        });
};


//STEP:3***************************************



exports.createStep3 = (req, res) => {
  console.log("iamin create form");
  console.log(req.idea);
  console.log(req.idea._id);
  let mainIdea=req.idea;
  console.log(req.body);
  const step3 = new Step3(req.body);
        req.idea.Step3=undefined;
        step3.underIdea=mainIdea._id;
        step3.save((err, step3) => {
          console.log(step3);
          if (err || !step3) {
            return res.status(500).json({
              error: err || "Step3 cannot be created",
            });
          }
          Idea.findOneAndUpdate(
            { _id: req.idea._id },
            {$set:{Step3:step3,status:"under-verified"}},
            { new: true },
            (err, updatedIdea) => {
              console.log(updatedIdea);
              if (err) {
                return res.status(400).json({
                  error: "Unable to save Step3",
                });
              }
              else{
                let arr_step3 = [];

                arr_step3.push(step3);

                Tbi.findOneAndUpdate(
                  { _id: "6210a4e6bbefb0046457a8c0" },
                  { $push: { Ideas: arr_step3,UserIdeas:mainIdea._id } },
                  { new: true },
                  (err, updatedTbi) => {
                    if (err) {
                      return res.status(400).json({
                        error: "Unable to send idea to Mentor",
                      });
                    }
                    return res.status(200).json({
                      "Step3":step3,
                      "Idea":updatedIdea,
                      "Tbi":updatedTbi,
                      "Message":"Created Fresh Step3",
                    });  
                  }
                );
                      
              }
            }
          );
        });
};



