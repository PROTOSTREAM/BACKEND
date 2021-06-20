const mongoose = require("mongoose");
const { validateRequestWithBody } = require("twilio");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    phonestatus:{
      type: String,
      required: false,
      default: "Not-verify",
    },
    sid:{
      type: String,
      required: false,
      default: null,
    },
    // verification:{
    //   type: Boolean,
    //   default: false,
    //   required: false,
    // },
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
    // ableToResetPassword: {
    //   type: Boolean,
    //   default: false,
    //   required: true
    // },
    otpstatus: {
      type: String,
      default: "notsent",
      required: false,
    },
    projects: [
      {
        type: ObjectId,
        ref: "Projects",
      },
    ],
    profiledata: {},
    role: {
      type: Number,
      required: true,
    },
    hackathons: [
      {
        type: ObjectId,
        ref: "Hackathon",
      },
    ],
    innotechs: [
      {
        type: ObjectId,
        ref: "Innotech",
      },
    ],
    schemes: [
      {
        type: ObjectId,
        ref: "Scheme",
      },
    ],
    startups: [
      {
        type: ObjectId,
        ref: "Startup",
      },
    ],
    internship: [
      {
        type: ObjectId,
        ref: "Internship",
      },
    ],
    ndas: [
      {
        type: ObjectId,
        ref: "Nda",
      },
    ],
    number: {
      type: Number,
      required: true,
    },
  },
  
  { timestamps: true },
);

module.exports = new mongoose.model("User", userSchema);
