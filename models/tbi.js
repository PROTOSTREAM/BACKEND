const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const tbiSchema = mongoose.Schema({
  
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
   
    profiledata: {},
    role: {
      type: Number,
      required: true,
    },
    // hackathons: [
    //   {
    //     type: ObjectId,
    //     ref: "Hackathon",
    //   },
    // ],
    // innotechs: [
    //   {
    //     type: ObjectId,
    //     ref: "Innotech",
    //   },
    // ],
    // schemes: [
    //   {
    //     type: ObjectId,
    //     ref: "Scheme",
    //   },
    // ],
    // startups: [
    //   {
    //     type: ObjectId,
    //     ref: "Startup",
    //   },
    // ],
    // internship: [
    //   {
    //     type: ObjectId,
    //     ref: "Internship",
    //   },
    // ],
    // ndas: [
    //   {
    //     type: ObjectId,
    //     ref: "Nda",
    //   },
    // ],
    number: {
      type: Number,
      required: true,
    },
    Ideas: [
      {
        type: ObjectId,
        ref: "Step3",
      },
    ], 
  },

 
  // listOfIdeas: { type: ObjectId, ref: ["Ideas"] },

  { timestamps: true }
);

module.exports = mongoose.model("Tbi", tbiSchema);
